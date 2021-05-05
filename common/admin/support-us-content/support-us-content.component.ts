import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {AdSlotConfig} from '@common/core/config/app-config';
import {FormBuilder} from '@angular/forms';
import {Settings} from '@common/core/config/settings.service';
import {Toast} from '@common/core/ui/toast.service';
import {HttpErrors} from '@common/core/http/errors/http-errors.enum';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'support-us-content',
    templateUrl: './support-us-content.component.html',
    styleUrls: ['./support-us-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportPageComponent implements OnInit {
    public loading$ = new BehaviorSubject(false);
    public form = this.fb.group({        
        'support.text': String,
        'support.footer': String,
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
                this.toast.open('Support Us Content updated');
            }, () => {
                this.toast.open(HttpErrors.Default);
            });
    }

    public setBody(content: string) {
        this.form.patchValue({'support.text': content});
    }


    private hydrate() {
        const settings = this.settings.getFlat() || {}; 
        this.form.patchValue({            
            'support.text': settings['support.text'],
            'support.footer': settings['support.footer'],
        });        
    }
}
