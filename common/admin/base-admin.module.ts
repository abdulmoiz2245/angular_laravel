import {NgModule} from '@angular/core';
import {CrupdateRoleModalComponent} from './roles/crupdate-role-modal/crupdate-role-modal.component';
import {UserIndexComponent} from './users/user-index.component';
import {AdminComponent} from './admin.component';
import {CrupdateUserModalComponent} from './users/crupdate-user-modal/crupdate-user-modal.component';
import {RoleIndexComponent} from './roles/role-index.component';
import {MailTemplateIndexComponent} from './mail-templates/mail-template-index.component';
import {MailTemplatePreviewComponent} from './mail-templates/mail-template-preview/mail-template-preview.component';
import {SelectRolesModalComponent} from './users/select-roles-modal/select-roles-modal.component';
import {AppearanceModule} from './appearance/appearance.module';
import {AdsPageComponent} from './ads-page/ads-page.component';
import {PopUpPageComponent} from './popup/popup.component';
import {SupportPageComponent} from './support-us-content/support-us-content.component';
import {SettingsModule} from './settings/settings.module';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UiModule} from '../core/ui/ui.module';
import {AuthModule} from '../auth/auth.module';
import {TextEditorModule} from '../text-editor/text-editor.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatNativeDateModule, MatPseudoCheckboxModule, MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SelectPermissionsModalComponent} from './permissions/select-permissions-modal/select-permissions-modal.component';
import {PermissionManagerComponent} from './permissions/permission-manager/permission-manager.component';
import {CrupdatePlanModalComponent} from './billing/plans/crupdate-plan-modal/crupdate-plan-modal.component';
import {CrupdateSubscriptionModalComponent} from './billing/subscriptions/crupdate-subscription-modal/crupdate-subscription-modal.component';
import {SubscriptionIndexComponent} from './billing/subscriptions/subscription-index/subscription-index.component';
import {PlanIndexComponent} from './billing/plans/plan-index/plan-index.component';
import {SpaceInputModule} from '../core/ui/space-input/space-input.module';
import {COMMON_ADMIN_CONFIG} from './common-admin-config';
import {Settings} from '../core/config/settings.service';
import {FullPlanNameModule} from '../shared/billing/full-plan-name/full-plan-name.module';
import {FileEntryIndexComponent} from './file-entry-index/file-entry-index.component';
import {DataTableModule} from '@common/shared/data-table/data-table.module';
import {CustomPagesManagerModule} from '@common/core/pages/manager/custom-pages-manager.module';
import {ImageZoomModule} from '@common/core/ui/image-zoom/image-zoom.module';
import {RoleManagerComponent} from '@common/admin/users/role-manager/role-manager.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {LocalizationIndexComponent} from '@common/admin/localizations/localization-index.component';
import {NewLineModalComponent} from '@common/admin/localizations/new-line-modal/new-line-modal.component';
import {CrupdateLocalizationModalComponent} from '@common/admin/localizations/crupdate-localization-modal/crupdate-localization-modal.component';
import {BaseAdminRoutingModule} from '@common/admin/base-admin-routing.module';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {FindUserModalModule} from '@common/auth/find-user-modal/find-user-modal.module';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextEditorModule,
        AppearanceModule,
        SettingsModule,
        UiModule,
        AuthModule,
        FullPlanNameModule,
        SpaceInputModule,
        DataTableModule,

        // need to use multi here as config might get overwritten
        // if page manager module is imported into admin twice
        CustomPagesManagerModule.forRoot({
            resourceName: 'pages',
            type: null,
            showSlug: true,
        }),
        BaseAdminRoutingModule,

        // material
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatSidenavModule,
        DragDropModule,
        MatProgressBarModule,

        // for plan modal only
        MatListModule,

        // for permission/role modal only
        MatExpansionModule,
        MatPseudoCheckboxModule,

        // for subscription modal and list only
        MatDatepickerModule,
        MatNativeDateModule,

        // for ads page only
        ImageZoomModule,
        MatRippleModule,

        // for role index component
        FindUserModalModule,
    ],
    declarations: [
        AdminComponent,
        RoleIndexComponent,
        CrupdateRoleModalComponent,
        RoleManagerComponent,
        UserIndexComponent,
        CrupdateUserModalComponent,
        LocalizationIndexComponent,
        CrupdateLocalizationModalComponent,
        NewLineModalComponent,
        MailTemplateIndexComponent,
        MailTemplatePreviewComponent,
        SelectRolesModalComponent,
        SelectPermissionsModalComponent,
        PermissionManagerComponent,
        AdsPageComponent,
        PopUpPageComponent,
        SupportPageComponent,
        FileEntryIndexComponent,

        // billing
        PlanIndexComponent,
        SubscriptionIndexComponent,
        CrupdatePlanModalComponent,
        CrupdateSubscriptionModalComponent,
    ],
    entryComponents: [
        CrupdateUserModalComponent,
        CrupdateRoleModalComponent,
        CrupdateLocalizationModalComponent,
        NewLineModalComponent,
        SelectRolesModalComponent,
        SelectPermissionsModalComponent,
        PermissionManagerComponent,

        // billing
        CrupdatePlanModalComponent,
        CrupdateSubscriptionModalComponent,
    ],
    exports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextEditorModule,
        AppearanceModule,
        SettingsModule,
        UiModule,
        AuthModule,
        PermissionManagerComponent,
        SelectPermissionsModalComponent,
        DataTableModule,

        // material
        MatButtonModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatChipsModule,
    ],
})
export class BaseAdminModule {
    constructor(private settings: Settings) {
        this.settings.merge({vebto: COMMON_ADMIN_CONFIG});
    }
}
