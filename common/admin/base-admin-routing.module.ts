import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from '@common/admin/admin.component';
import {AuthGuard} from '@common/guards/auth-guard.service';
import {CheckPermissionsGuard} from '@common/guards/check-permissions-guard.service';
import {SettingsComponent} from '@common/admin/settings/settings.component';
import {SettingsResolve} from '@common/admin/settings/settings-resolve.service';
import {NgModule} from '@angular/core';
import {APP_ADMIN_ROUTES, APP_SETTING_ROUTES} from '../../app/admin/app-admin-routes';
import {GeneralSettingsComponent} from '@common/admin/settings/general/general-settings.component';
import {AuthenticationSettingsComponent} from '@common/admin/settings/authentication/authentication-settings.component';
import {CacheSettingsComponent} from '@common/admin/settings/cache/cache-settings.component';
import {AnalyticsSettingsComponent} from '@common/admin/settings/analytics/analytics-settings.component';
import {LocalizationSettingsComponent} from '@common/admin/settings/localization/localization-settings.component';
import {LocalizationsResolve} from '@common/admin/localizations/localizations-resolve.service';
import {MailSettingsComponent} from '@common/admin/settings/mail/mail-settings.component';
import {LoggingSettingsComponent} from '@common/admin/settings/logging/logging-settings.component';
import {QueueSettingsComponent} from '@common/admin/settings/queue/queue-settings.component';
import {BillingSettingsComponent} from '@common/admin/settings/billing/billing-settings.component';
import {UploadingSettingsComponent} from '@common/admin/settings/uploading/uploading-settings.component';
import {RecaptchaSettingsComponent} from '@common/admin/settings/recaptcha/recaptcha-settings.component';
import {UserIndexComponent} from '@common/admin/users/user-index.component';
import {RoleIndexComponent} from '@common/admin/roles/role-index.component';
import {LocalizationIndexComponent} from '@common/admin/localizations/localization-index.component';
import {MailTemplateIndexComponent} from '@common/admin/mail-templates/mail-template-index.component';
import {MailTemplatesResolve} from '@common/admin/mail-templates/mail-templates-resolve.service';
import {FileEntryIndexComponent} from '@common/admin/file-entry-index/file-entry-index.component';
import {AdsPageComponent} from '@common/admin/ads-page/ads-page.component';
import {PopUpPageComponent} from '@common/admin/popup/popup.component';
import {SupportPageComponent} from '@common/admin/support-us-content/support-us-content.component';
import {customPagesManagerRoutes} from '@common/core/pages/manager/custom-pages-manager-routing.module';
import {PlanIndexComponent} from '@common/admin/billing/plans/plan-index/plan-index.component';
import {BillingEnabledGuard} from '@common/shared/billing/guards/billing-enabled-guard.service';
import {SubscriptionIndexComponent} from '@common/admin/billing/subscriptions/subscription-index/subscription-index.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuard, CheckPermissionsGuard],
        canActivateChild: [AuthGuard, CheckPermissionsGuard],
        data: {permissions: ['admin.access']},
        children: [
            // ANALYTICS
            {
                path: '',
                redirectTo: 'analytics',
                pathMatch: 'full',
            },
            {
                path: 'analytics',
                loadChildren: () => import('common/admin/analytics/analytics.module').then(m => m.AnalyticsModule),
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                data: {permissions: ['reports.view']}
            },

            // BASE ADMIN ROUTES
            {
                path: 'users',
                component: UserIndexComponent,
                data: {permissions: ['users.view']}
            },
            {
                path: 'roles',
                component: RoleIndexComponent,
                data: {permissions: ['roles.view']}
            },
            {
                path: 'translations',
                component: LocalizationIndexComponent,
                resolve: {localizations: LocalizationsResolve},
                data: {permissions: ['localizations.view']}
            },
            {
                path: 'mail-templates',
                component: MailTemplateIndexComponent,
                resolve: {templates: MailTemplatesResolve},
                data: {permissions: ['mail_templates.view']}
            },
            {
                path: 'files',
                component: FileEntryIndexComponent,
                data: {permissions: ['files.view']}
            },
            {
                path: 'ads',
                component: AdsPageComponent,
                data: {permissions: ['ads.update']}
            },
            {
                path: 'popup',
                component: PopUpPageComponent,
                data: {permissions: ['ads.update']}
            },
            {
                path: 'support-us',
                component: SupportPageComponent,
                data: {permissions: ['ads.update']}
            },

            // CUSTOM PAGES
            ...customPagesManagerRoutes,

            // BILLING
            {
                path: 'plans',
                component: PlanIndexComponent,
                canActivate: [BillingEnabledGuard],
                data: {permissions: ['plans.view']}
            },

            {
                path: 'subscriptions',
                component: SubscriptionIndexComponent,
                canActivate: [BillingEnabledGuard],
                data: {permissions: ['subscriptions.view']}
            },

            // BASE ADMIN ROUTES SPECIFIC TO APP
            ...APP_ADMIN_ROUTES,

            // SETTINGS
            {
                path: 'settings',
                component: SettingsComponent,
                resolve: {settings: SettingsResolve},
                data: {permissions: ['settings.view']},
                children: [
                    // TODO: implement guard for unsaved changes after this is fixed:
                    // TODO: https://github.com/angular/angular/issues/11836
                    {path: '', redirectTo: 'general', pathMatch: 'full'},
                    {path: 'general', component: GeneralSettingsComponent, pathMatch: 'full'},
                    {path: 'authentication', component: AuthenticationSettingsComponent},
                    {path: 'cache', component: CacheSettingsComponent},
                    {path: 'analytics', component: AnalyticsSettingsComponent},
                    {
                        path: 'localization',
                        component: LocalizationSettingsComponent,
                        resolve: {localizations: LocalizationsResolve}
                    },
                    {path: 'mail', component: MailSettingsComponent},
                    {path: 'logging', component: LoggingSettingsComponent},
                    {path: 'queue', component: QueueSettingsComponent},
                    {path: 'billing', component: BillingSettingsComponent},
                    {path: 'uploading', component: UploadingSettingsComponent},
                    {path: 'recaptcha', component: RecaptchaSettingsComponent},

                    // SETTING ROUTES SPECIFIC TO APP
                    ...APP_SETTING_ROUTES,
                ],
            },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BaseAdminRoutingModule {
}
