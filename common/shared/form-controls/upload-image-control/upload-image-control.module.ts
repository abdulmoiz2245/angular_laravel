import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadImageControlComponent} from './upload-image-control.component';
import {UiModule} from '@common/core/ui/ui.module';
import {UploadsModule} from '@common/uploads/uploads.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
    declarations: [UploadImageControlComponent],
    imports: [
        CommonModule,
        UiModule,
        UploadsModule,
        MatProgressBarModule,
    ],
    exports: [
      UploadImageControlComponent,
    ]
})
export class UploadImageControlModule {
}
