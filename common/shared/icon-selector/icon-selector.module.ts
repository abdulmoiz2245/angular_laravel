import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconSelectorComponent} from '@common/shared/icon-selector/icon-selector.component';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';


@NgModule({
    declarations: [
        IconSelectorComponent,
    ],
    imports: [
        CommonModule,
        LoadingIndicatorModule,

        MatButtonModule,
        MatIconModule,
    ],
    exports: [
        IconSelectorComponent,
    ],
    entryComponents: [
        IconSelectorComponent,
    ],
})
export class IconSelectorModule {
}
