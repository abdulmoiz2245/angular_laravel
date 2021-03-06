import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {DataTableComponent} from '@common/shared/data-table/data-table.component';
import {UiModule} from '@common/core/ui/ui.module';
import {FilterPanelComponent} from './filter-panel/filter-panel.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {BetweenDateInputModule} from '@common/core/ui/between-date-input/between-date-input.module';
import {SelectUserInputModule} from '@common/core/ui/select-user-input/select-user-input.module';
import {DataTableIntlService} from '@common/shared/data-table/data-table-intl.service';
import {PortalModule} from '@angular/cdk/portal';
import {DataTableInputsModule} from '../../../app/admin/data-table-inputs/data-table-inputs.module';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        DataTableComponent,
        FilterPanelComponent,
    ],
    imports: [
        CommonModule,
        UiModule,

        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatChipsModule,
        BetweenDateInputModule,
        MatProgressBarModule,
        PortalModule,

        DragDropModule,

        SelectUserInputModule,
        DataTableInputsModule,
    ],
    exports: [
        DataTableComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
    ],
    entryComponents: [
        FilterPanelComponent,
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: DataTableIntlService}
    ]
})
export class DataTableModule {
}
