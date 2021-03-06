import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {UploadedFile} from '@common/uploads/uploaded-file';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {UploadInputConfig, UploadInputTypes} from '@common/uploads/upload-input-config';
import {UploadApiConfig, UploadsApiService} from '@common/uploads/uploads-api.service';
import {AppearanceImageUploadValidator} from '@common/admin/appearance/appearance-image-input/appearance-image-upload-validator';

@Component({
    selector: 'upload-image-control',
    templateUrl: './upload-image-control.component.html',
    styleUrls: ['./upload-image-control.component.scss'],
    providers: [UploadQueueService, {
        provide: NG_VALUE_ACCESSOR,
        useExisting: UploadImageControlComponent,
        multi: true,
    }]
})
export class UploadImageControlComponent implements ControlValueAccessor {
    @Output() fileDeleted = new EventEmitter();
    @Input() defaultBackground: string;
    @Input() buttonText = 'Upload image';
    @Input() uploadConfig: UploadApiConfig;
    @Input() uploadType: string;
    public uploadInputConfig: UploadInputConfig = {multiple: false, types: [UploadInputTypes.image]};
    public src$ = new BehaviorSubject<string>(null);
    private propagateChange: Function;

    constructor(
        private uploadQueue: UploadQueueService,
        private imageValidator: AppearanceImageUploadValidator,
        private uploadsApi: UploadsApiService,
    ) {}

    public writeValue(value: string) {
        this.src$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    public uploadImage(files: UploadedFile[]) {
        this.uploadQueue.start(files, this.uploadConfig || this.defaultUploadConfig())
            .subscribe(response => {
                this.src$.next(response.fileEntry.url);
                this.propagateChange(response.fileEntry.url);
            });
    }

    public deleteUpload() {
        this.uploadsApi.delete({paths: [this.src$.value], deleteForever: true})
            .subscribe(() => {
                this.src$.next(null);
                this.propagateChange(null);
                this.fileDeleted.emit();
            });
    }

    private defaultUploadConfig(): UploadApiConfig {
        return {
            httpParams: {type: this.uploadType || 'common'},
            uri: 'uploads/images',
            validator: this.imageValidator,
        };
    }
}
