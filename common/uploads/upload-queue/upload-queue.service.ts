import { Injectable, NgZone } from '@angular/core';
import { UploadQueueItem } from './upload-queue-item';
import {BehaviorSubject, concat, Observable, Subject} from 'rxjs';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import { UploadedFile } from '../uploaded-file';
import { UploadCompletedEvent, UploadEvent, UploadEventTypes, UploadProgressEvent } from '../utils/upload-progress-event';
import {UploadApiConfig, UploadFileResponse, UploadsApiService} from '../uploads-api.service';
import { FileEntry } from '../file-entry';
import { UploadValidator } from '../validation/upload-validator';
import { BackendErrorResponse } from '../../core/types/backend-error-response';
import {DefaultUploadValidator} from '../validation/default-upload-validator';
import {BackendResponse} from '@common/core/types/backend-response';

@Injectable({
    providedIn: 'root'
})
export class UploadQueueService {
    public uploads$: BehaviorSubject<UploadQueueItem[]> = new BehaviorSubject([]);
    public totalProgress$: BehaviorSubject<number> = new BehaviorSubject(0);
    public uploadsAdded$ = new Subject<UploadQueueItem[]>();

    constructor(
        private api: UploadsApiService,
        private zone: NgZone,
        private defaultValidator: DefaultUploadValidator,
    ) {}

    public isEmpty(): boolean {
        return !this.uploads$.value.length;
    }

    public getAllCompleted(): FileEntry[] {
        return this.uploads$.value
            .filter(queueItem => queueItem.completed)
            .map(queueItem => queueItem.fileEntry);
    }

    public getPendingCount(): Observable<number> {
        return this.uploads$.pipe(map(uploads => {
            return uploads.filter(upload => !upload.completed).length;
        }));
    }

    public getCompletedCount(): Observable<number> {
        return this.uploads$.pipe(map(uploads => {
            return uploads.filter(upload => upload.completed).length;
        }));
    }

    public updateTotalProgress() {
        const progress = this.uploads$.value.map(upload => upload.meta$.value.progress || 0);
        this.totalProgress$.next(progress.reduce((p, c) => p + c, 0) / progress.length);
    }

    public totalProgress() {
        return this.totalProgress$.asObservable();
    }

    public start(files: UploadedFile[], config: UploadApiConfig = {}): BackendResponse<UploadFileResponse> {
        const uploads = this.transformUploads(files, config.validator || this.defaultValidator);
        this.uploads$.next(this.uploads$.value.concat(uploads));
        this.uploadsAdded$.next(uploads);

        const requests = uploads
            .filter(upload => !upload.hasError)
            .map((upload, key) => {
                return this.api.upload(files[key], config).pipe(
                    takeUntil(upload.canceled$),
                    map(e => {
                        // assign queue item ID to upload completed response so
                        // file entry can be matched to specific upload queue item
                        if (e.name === UploadEventTypes.COMPLETED) {
                            e.body.queueItemId = upload.id;
                        }
                        return e;
                    }),
                    tap(
                        response => this.handleUploadEvent(response, upload),
                        response => this.handleUploadFailure(response, upload),
                    ),
                );
            });

        return concat(...requests)
            .pipe(
                filter(e => e.name === UploadEventTypes.COMPLETED),
                map((e: UploadCompletedEvent) => e.body)
            );
    }

    public updateProgress(id: string, e: UploadProgressEvent) {
        const queueItem = this.find(id);
        if ( ! queueItem) return;

        queueItem.update({
            eta: e.eta,
            speed: e.speed,
            progress: e.progress,
            totalBytes: e.totalBytes,
            completedBytes: e.completedBytes,
        });

        this.updateTotalProgress();
    }

    public completeUpload(id: string, response: UploadFileResponse) {
        const queueItem = this.find(id);
        if ( ! queueItem) return;

        queueItem.uploadedResponse$.next(response);
        queueItem.fileEntry = response.fileEntry;
        queueItem.complete();
    }

    public errorUpload(id: string, message: string = '') {
        this.find(id).addError(message);
    }

    public reset() {
        this.uploads$.value.forEach(u => u.cancel());
        this.uploads$.next([]);
    }

    public remove(id: string) {
        const i = this.uploads$.value.findIndex(u => u.id === id),
            upload = this.uploads$.value[i];
        upload.completed ? upload.finalize() : upload.cancel();
        this.uploads$.value.splice(i, 1);
        this.uploads$.next(this.uploads$.value);
    }

    public find(id: string): UploadQueueItem {
        return this.uploads$.value.find(u => u.id === id);
    }

    /**
     * Transform specified files into upload queue items.
     */
    protected transformUploads(files: UploadedFile[], validator: UploadValidator) {
        return files.map(file => {
            const activeUpload = new UploadQueueItem(file);

            // validate upload
            if (validator) {
                const result = validator.validate(file);
                if (result.failed) activeUpload.addError(result.errorMessage);
            }

            // remove upload, if it is canceled by user
            activeUpload.canceled$.subscribe(() => {
                this.remove(activeUpload.id);
            });

            return activeUpload;
        });
    }

    protected handleUploadEvent(event: UploadEvent, upload: UploadQueueItem) {
        if (event.name === UploadEventTypes.PROGRESS) {
            this.zone.run(() => {
                this.updateProgress(upload.id, event);
            });
        } else if (event.name === UploadEventTypes.COMPLETED) {
            this.zone.run(() => {
                this.completeUpload(upload.id, event.body);
            });
        }
    }

    protected handleUploadFailure(response: BackendErrorResponse, upload: UploadQueueItem) {
        const msg = response.messages ? response.messages.file : '';
        this.errorUpload(upload.id, msg);
    }
}
