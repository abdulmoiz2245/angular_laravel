import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppearanceComponent} from './appearance.component';
import {MenusAppearancePanelComponent} from './panels/menus-appearance-panel/menus-appearance-panel.component';
import {AddMenuItemPanelComponent} from './panels/menus-appearance-panel/menus/add-menu-item-panel/add-menu-item-panel.component';
import {AppearancePanelMetaComponent} from './appearance-panel-meta/appearance-panel-meta.component';
import {MenuItemsComponent} from './panels/menus-appearance-panel/menus/menu-items/menu-items.component';
import {AppearanceRoutingModule} from './appearance-routing.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {UiModule} from '../../core/ui/ui.module';
import {CodeEditorModalComponent} from './panels/custom-code-appearance-panel/code-editor-modal/code-editor-modal.component';
import {OverlayPanel} from '../../core/ui/overlay-panel/overlay-panel.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ColorPickerModule} from '@common/core/ui/color-picker/color-picker.module';
import {ThemesAppearancePanelComponent} from './panels/themes-appearance-panel/themes-appearance-panel.component';
import {CrupdateCssThemeModalComponent} from './panels/themes-appearance-panel/crupdate-css-theme-modal/crupdate-css-theme-modal.component';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CssThemeColorsPanelComponent} from '@common/admin/appearance/panels/themes-appearance-panel/css-theme-colors-panel/css-theme-colors-panel.component';
import {APPEARANCE_PANELS} from '../../../app/admin/appearance/appearance-panels';
import {PortalModule} from '@angular/cdk/portal';
import {GeneralAppearancePanelComponent} from '@common/admin/appearance/panels/general-appearance-panel/general-appearance-panel.component';
import {HighlightInPreviewDirective} from './highlight-in-preview.directive';
import {SeoAppearancePanelComponent} from '@common/admin/appearance/panels/seo-appearance-panel/seo-appearance-panel.component';
import {CustomCodeAppearancePanelComponent} from '@common/admin/appearance/panels/custom-code-appearance-panel/custom-code-appearance-panel.component';
import {AppearanceImageInputComponent} from '@common/admin/appearance/appearance-image-input/appearance-image-input.component';
import {IconSelectorModule} from '@common/shared/icon-selector/icon-selector.module';
import {MatSliderModule} from '@angular/material';

@NgModule({
    imports: [
        AppearanceRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiModule,
        ColorPickerModule,
        IconSelectorModule,

        // material
        MatExpansionModule,
        MatSnackBarModule,
        MatDialogModule,
        MatSlideToggleModule,
        PortalModule,
        MatRippleModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatSliderModule,

        // temp
        MatAutocompleteModule,
        DragDropModule,
    ],
    declarations: [
        AppearanceComponent,
        AddMenuItemPanelComponent,
        AppearancePanelMetaComponent,
        MenuItemsComponent,
        CodeEditorModalComponent,
        CrupdateCssThemeModalComponent,
        CssThemeColorsPanelComponent,
        AppearanceImageInputComponent,

        MenusAppearancePanelComponent,
        ThemesAppearancePanelComponent,
        GeneralAppearancePanelComponent,
        SeoAppearancePanelComponent,
        CustomCodeAppearancePanelComponent,

        ...APPEARANCE_PANELS,

        HighlightInPreviewDirective,
    ],
    entryComponents: [
        CodeEditorModalComponent,
        AddMenuItemPanelComponent,
        CrupdateCssThemeModalComponent,

        ...APPEARANCE_PANELS,
    ],
    providers: [
        OverlayPanel,
        Modal,
    ]
})
export class AppearanceModule {
}
