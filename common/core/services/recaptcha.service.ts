import {Injectable} from '@angular/core';
import {Settings} from '../config/settings.service';
import {LazyLoaderService} from '../utils/lazy-loader.service';
import {AppHttpClient} from '../http/app-http-client.service';
import {GenericBackendResponse} from '@common/core/types/backend-response';

declare var grecaptcha: any;
const RECAPTCHA_URL = 'https://www.google.com/recaptcha/api.js?render=';

@Injectable({
    providedIn: 'root'
})
export class RecaptchaService {
    constructor(
        private settings: Settings,
        private http: AppHttpClient,
        private lazyLoader: LazyLoaderService,
    ) {}

    public enabledFor(page: string) {
        return this.settings.get('recaptcha.site_key') &&
            this.settings.get('recaptcha.secret_key') &&
            this.settings.get(`recaptcha.enable_for_${page}`);
    }

    public load() {
        return this.lazyLoader
            .loadAsset(RECAPTCHA_URL + this.settings.get('recaptcha.site_key'), {type: 'js'});
    }

    public verify(page: string): Promise<boolean> {
        return new Promise(resolve => {
            if ( ! grecaptcha) return false;
            grecaptcha.ready(() => {
                grecaptcha.execute(this.settings.get('recaptcha.site_key'), {action: page})
                    .then(token => {
                        this.http.post<GenericBackendResponse<{success: boolean}>>('recaptcha/verify', {token})
                            .subscribe(response => resolve(response.success));
                    });
            });
        });
    }
}
