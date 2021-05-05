import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {SocialAuthService} from '../social-auth.service';
import {CurrentUser} from '../current-user';
import {Router} from '@angular/router';
import {Settings} from '../../core/config/settings.service';
import {Toast} from '../../core/ui/toast.service';
import {Bootstrapper} from '../../core/bootstrapper.service';
import {RecaptchaService} from '../../core/services/recaptcha.service';
import {FormBuilder} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    public form = this.fb.group({
        email: [''],
        password: [''],
        password_confirmation: [''],
        purchase_code: [''],
    });
    public errors$ = new BehaviorSubject<{
        email?: string,
        password?: string,
        general?: string,
        purchase_code?: string
    }>({});

    constructor(
        public auth: AuthService,
        public socialAuth: SocialAuthService,
        public settings: Settings,
        private user: CurrentUser,
        private router: Router,
        private toast: Toast,
        private bootstrapper: Bootstrapper,
        private recaptcha: RecaptchaService,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        if (this.recaptcha.enabledFor('registration')) {
            this.recaptcha.load();
        }
    }

    public async register() {
        this.loading$.next(true);
        if (this.recaptcha.enabledFor('registration') && ! await this.recaptcha.verify('registration')) {
            this.loading$.next(false);
            return this.toast.open('Could not verify you are human.');
        }

        this.auth.register(this.form.value)
            .subscribe(response => {
                if (this.settings.get('require_email_confirmation')) {
                    this.router.navigate(['/login']).then(() => {
                        this.loading$.next(false);
                        this.toast.open('We have sent you an email with instructions on how to activate your account.', {duration: 6000});
                    });
                } else {
                    this.bootstrapper.bootstrap(response.data);
                    this.router.navigate([this.auth.getRedirectUri()]).then(() => {
                        this.loading$.next(false);
                        this.toast.open('Registered successfully.');
                    });
                }
            }, err => {
                this.errors$.next(err.messages);
                this.loading$.next(false);
            });
    }
}
