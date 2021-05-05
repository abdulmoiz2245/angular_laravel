import {Component, ViewEncapsulation, ChangeDetectionStrategy, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Toast} from '../../../../common/core/ui/toast.service';
import {MESSAGES} from '../../../toast-messages';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Review} from '../../../models/review';
import {BackendErrorMessages} from '../../../../common/core/types/backend-error-response';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {ReviewService} from '../../shared/review.service';
import {MEDIA_TYPE} from '../../media-type';

interface CrupdateReviewModalData {
   text?: String;
}

@Component({
    selector: 'site-popup-modal',
    templateUrl: './site-popup-modal.component.html',
    styleUrls: ['./site-popup-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitePopUpModalComponent {
    public errors$: BehaviorSubject<BackendErrorMessages> = new BehaviorSubject({});
    public loading$ = new BehaviorSubject(false);
    public reviewForm = new FormGroup({
        body: new FormControl(''),
        score: new FormControl(null),
    });

    constructor(
        private dialogRef: MatDialogRef<SitePopUpModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateReviewModalData,
        private toast: Toast,
        private reviews: ReviewService,
    ) {
       
    }

  
    public close() {
        this.dialogRef.close();
    }
}
