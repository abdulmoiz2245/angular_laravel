import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Select2Module } from 'ng2-select2';
import {RouterModule} from '@angular/router';
import {MTDB_CONFIG} from './mtdb-config';
import {AppRoutingModule} from './app-routing.module';
import {SiteModule} from './site/site.module';
import {DemoMaterialModule} from './site/dialog-overview-example/material-module';
import {NgxsModule} from '@ngxs/store';
import {AppState} from './state/app-state';
import {AppBootstrapperService} from './app-bootstrapper.service';
import {CoreModule} from '@common/core/core.module';
import {AuthModule} from '@common/auth/auth.module';
import {AccountSettingsModule} from '@common/account-settings/account-settings.module';
import {PagesModule} from '@common/core/pages/shared/pages.module';
import {APP_CONFIG} from '@common/core/config/app-config';
import {Bootstrapper} from '@common/core/bootstrapper.service';
import {NotFoundRoutingModule} from '@common/core/pages/not-found-routing.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [        
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([], {scrollPositionRestoration: 'top'}),
        CoreModule.forRoot(),
        AppRoutingModule,
        AuthModule,
        AccountSettingsModule,
        PagesModule,
        Select2Module,
        MatFormFieldModule,
        NgxsModule.forRoot([AppState], {developmentMode: false}),

        // need to load these after "NgxsModule.forRoot"
        // as site module contains "NgxsModule.forFeature"
        SiteModule,
        DemoMaterialModule,
        NotFoundRoutingModule,
    ],
    providers: [
        {
            provide: APP_CONFIG,
            useValue: MTDB_CONFIG,
            multi: true,
        },
        {
            provide: Bootstrapper,
            useClass: AppBootstrapperService,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
