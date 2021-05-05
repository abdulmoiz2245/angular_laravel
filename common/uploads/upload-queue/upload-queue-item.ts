import {BehaviorSubject, ReplaySubject, Subject} from 'rxjs';
import { randomString } from '../../core/utils/random-string';
import { UploadedFile } from '../uploaded-file';
import {FileEntry} from '../file-entry';
import {UploadFileResponse} from '@common/uploads/uploads-api.service';
import {Upload} from '@common/core/types/models/Upload';

export interface UploadQueueItemMeta {
    progress: number;
    speed: string;
    eta: string;
    totalBytes: number;
    completedBytes: number;
    error: string|false;
}

export class UploadQueueItem {
    id: string = randomString();
    canceled$: Subject<boolean> = new Subject();

    // file info (static)
    uploadedFile: UploadedFile;

    // backend response once file is uploaded
    uploadedResponse$ = new ReplaySubject<UploadFileResponse>(1);

    // uploaded file entry (only available on completed uploads)
    fileEntry: FileEntry;

    // meta information (will change)
    meta$: BehaviorSubject<Partial<UploadQueueItemMeta>> = new BehaviorSubject({});

    // custom data that can be attached to queue item
    public customData: object = {};

    get completed(): boolean {
        return this.meta$.value.progress === 100;
    }

    get pending(): boolean {
        return this.meta$.value.progress == null;
    }

    get hasError(): boolean {
        return this.meta$.value.error != null;
    }

    constructor(file: UploadedFile) {
        this.uploadedFile = file;
    }

    public update(data: Partial<UploadQueueItemMeta>) {
        this.meta$.next({
            ...this.meta$.value,
            ...data,
        });
    }

    public cancel() {
        // cancelling before finalizing might cause infinite loop
        this.finalize();
        this.canceled$.next(true);
    }

    public complete() {
        this.update({progress: 100});
        this.finalize();
    }

    public finalize() {
        this.uploadedResponse$.complete();
        this.canceled$.complete();
        this.meta$.complete();
    }

    public addError(message: string = '') {
        this.update({error: message});
    }
}
