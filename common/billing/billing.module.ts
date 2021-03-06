import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {UpgradePageComponent} from './upgrade-page/upgrade-page.component';
import {BillingPlansResolver} from './upgrade-page/billing-plans-resolver.service';
import {BillingRoutingModule} from './billing-routing.module';
import {PlanFeaturesListComponent} from './upgrade-page/plan-features-list/plan-features-list.component';
import {OrderSummaryComponent} from './upgrade-page/order-summary/order-summary.component';
import {AcceptedPaymentsHeaderComponent} from './upgrade-page/accepted-payments-header/accepted-payments-header.component';
import {UserSubscriptionPageComponent} from './subscriptions/user-subscription-page/user-subscription-page.component';
import {UpgradePageAsideComponent} from './upgrade-page/upgrade-page-aside/upgrade-page-aside.component';
import {CurrenciesListResolver} from './upgrade-page/currencies-list-resolver.service';
import {CreditCardFormComponent} from './credit-card-form/credit-card-form.component';
import {PaypalSubscriptions} from './subscriptions/paypal-subscriptions';
import {SelectPlanModalComponent} from './plans/select-plan-modal/select-plan-modal.component';
import {SelectPlanPanelComponent} from './plans/select-plan-panel/select-plan-panel.component';
import {SelectPlanPeriodPanelComponent} from './plans/select-plan-period-panel/select-plan-period-panel.component';
import {SubscriptionStepperState} from './subscriptions/subscription-stepper-state.service';
import {UserNotSubscribedGuard} from './guards/user-not-subscribed-guard.service';
import {UserSubscribedGuard} from './guards/user-subscribed-guard.service';
import {CreateSubscriptionPanelComponent} from './subscriptions/create-subscription-panel/create-subscription-panel.component';
import {UiModule} from '../core/ui/ui.module';
import {ContactWidgetComponent} from './upgrade-page/contact-widget/contact-widget.component';
import {FullPlanNameModule} from '../shared/billing/full-plan-name/full-plan-name.module';
import {InvoiceIndexComponent} from '@common/billing/invoices/invoice-index/invoice-index.component';
import { MatTableModule } from '@angular/material/table';
import { PricingPageComponent } from './pricing-page/pricing-page.component';
import { SupportUsComponent } from './support-us/support-us.component';
import { NgxPaypalComponent,NgxPaypalComponent2 } from './paypal.component';
import { ScriptService } from './script.service';
import { PayPalScriptService } from './paypal-script.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {SiteModule} from '../../app/site/site.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiModule,
        BillingRoutingModule,
        FullPlanNameModule,
        MatFormFieldModule,
        MatSelectModule,
        SiteModule,
    

        // material
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatDialogModule,
        MatStepperModule,
        MatProgressBarModule,
        MatTabsModule,
        MatRadioModule,
        MatTableModule,
    ],
    declarations: [
        UpgradePageComponent,
        NgxPaypalComponent,
        NgxPaypalComponent2,
        PlanFeaturesListComponent,
        OrderSummaryComponent,
        AcceptedPaymentsHeaderComponent,
        UserSubscriptionPageComponent,
        UpgradePageAsideComponent,
        CreditCardFormComponent,
        CreateSubscriptionPanelComponent,
        SelectPlanPanelComponent,
        SelectPlanModalComponent,
        SelectPlanPeriodPanelComponent,
        ContactWidgetComponent,
        InvoiceIndexComponent,
        PricingPageComponent,
        SupportUsComponent,
    ],
    entryComponents: [
        SelectPlanModalComponent,
    ],
    providers: [
        BillingPlansResolver,
        CurrenciesListResolver,
        PaypalSubscriptions,
        SubscriptionStepperState,
        SubscriptionStepperState,
        UserNotSubscribedGuard,
        UserSubscribedGuard,
        ScriptService,
        PayPalScriptService
    ],
    exports: [
        BillingRoutingModule,
        NgxPaypalComponent,
    ]
})
export class BillingModule {
}
