import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {AdSlotConfig} from '@common/core/config/app-config';
import {FormBuilder} from '@angular/forms';
import {Settings} from '@common/core/config/settings.service';
import {Toast} from '@common/core/ui/toast.service';
import {HttpErrors} from '@common/core/http/errors/http-errors.enum';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopUpPageComponent implements OnInit {
    public loading$ = new BehaviorSubject(false);
    public form = this.fb.group({
        'popup.disable': [false],
        'popup.text': String,
    });

    constructor(
        public settings: Settings,
        private toast: Toast,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.hydrate();
    }

    public saveAds() {
        this.loading$.next(true);
        this.settings.save({client: this.form.value})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.toast.open('Pop Up updated');
            }, () => {
                this.toast.open(HttpErrors.Default);
            });
    }


    private hydrate() {
        const settings = this.settings.getFlat() || {};        
        this.form.patchValue({
            'popup.disable': settings['popup.disable'],
            'popup.text': settings['popup.text']
        });        
    }
}
