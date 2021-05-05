import {Component, ViewEncapsulation, ChangeDetectionStrategy, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TitleCredit} from '../../../models/title';
import {Observable} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {Actions, Select, Store} from '@ngxs/store';
import {AddCredit, UpdateCredit} from './state/crupdate-title-actions';
import {Toast} from '../../../../common/core/ui/toast.service';
import {CreatePerson,LoadPersonMeta, ResetState, UpdatePerson, UpdatePersonMeta} from '../meta-person-page/state/meta-person-state-actions';
import {MetaPersonState} from '../meta-person-page/state/meta-person-state';
import {MESSAGES} from '../../../toast-messages';
import {CrupdateTitleState} from './state/crupdate-title-state';
import {MEDIA_TYPE} from '../../../site/media-type';
import {Creditable} from '../../../site/people/creditable';

interface CrupdateCreditModalData {
    credit?: TitleCredit;
    type: 'cast'|'crew';
    mediaItem: Creditable;
}

@Component({
    selector: 'crupdate-person-relation-modal',
    templateUrl: './crupdate-person-relation-modal.component.html',
    styleUrls: ['./crupdate-person-relation-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdatePersonRelationModalComponent {    
    @Select(MetaPersonState.loading) loading$: Observable<boolean>;
    public credit: TitleCredit;
    public person_id: Number;

    public form = this.fb.group({
        relation: [''],
        info: [''],
        name: [''],
        person_id: [''],
    });

    constructor(
        private store: Store,
        private toast: Toast,
        private fb: FormBuilder,
        private actions$: Actions,
        private dialogRef: MatDialogRef<CrupdatePersonRelationModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateCreditModalData,
    ) {
        if (this.data.credit) {
            this.credit = this.data.credit;
            this.form.patchValue(this.data.credit.pivot);
        }
    }

    public confirm() {
        const person = this.store.selectSnapshot(MetaPersonState.person);
        if(person.id){
            const response =this.store.dispatch(new UpdatePersonMeta(this.getPayload()));
            response.subscribe(() => {
            this.close();
            this.toast.open(person.id ? MESSAGES.PERSON_UPDATE_SUCCESS : MESSAGES.PERSON_CREATE_SUCCESS);
          });
        }
        return;
    }

    public close() {
        this.dialogRef.close();
    }

    public setCredit(credit: TitleCredit) {
        this.credit = credit;
        this.person_id=credit.id;
    }

    private getPayload() {
        const payload = this.form.value;
        if(this.person_id){
            payload.person_id=this.person_id;
        }
        return {relation:payload};
    }

    public getPersonType() {
        return MEDIA_TYPE.PERSON;
    }
}
