import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange, ViewEncapsulation} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {CurrentUser} from '@common/auth/current-user';
import {AuthService} from '@common/auth/auth.service';
import {FormControl, FormGroup,FormBuilder} from '@angular/forms';
import {PersonState} from '../state/person-state';
import {ShareableNetworks, shareLinkSocially} from '../../../../common/core/utils/share-link-socially';
import {Observable,Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Person} from '../../../models/person';
import {Rating} from '../../../models/rating';
import {Settings} from '../../../../common/core/config/settings.service';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {Title} from '../../../models/title';
import {ToggleGlobalLoader} from '../../../state/app-state-actions';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {shareViaEmail} from '../../../../common/core/utils/share-via-email';
import {copyToClipboard} from '../../../../common/core/utils/copy-link-to-clipboard';
import {MESSAGES} from '../../../toast-messages';
import {BehaviorSubject} from 'rxjs';
import {BackendErrorMessages} from '../../../../common/core/types/backend-error-response';
import {Translations} from '../../../../common/core/translations/translations.service';
import {Toast} from '../../../../common/core/ui/toast.service';
import {finalize,debounceTime, skip} from 'rxjs/operators';
import {RatingService} from '../../shared/rating.service';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {ReloadPerson} from '../state/person-state-actions';
import { PeopleService } from '../people.service';

@Component({
  selector: 'user-rating-widget',
  templateUrl: './user-rating-widget.component.html',
  styleUrls: ['./user-rating-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class UserRatingWidgetComponent implements OnChanges {

  @Input() item: any;
  @Input() person: any;


    @Select(PersonState.person) person$: Observable<Person>;
    @Select(PersonState.credits) credits$: Observable<{[key: string]: Title[]}>;
    @Select(PersonState.knownFor) knownFor$: Observable<Title[]>;
    @Select(PersonState.backdrop) backdrop$: Observable<string>;
    @Select(PersonState.creditsCount) creditsCount$: Observable<number>;
    @Select(PersonState.avg_rating) avg_rating$: Observable<any>;
    @Select(PersonState.loading) loading$: Observable<boolean>;
    @Select(PersonState.visibleSkills) visibleSkills$: Observable<boolean>;

    public errors$: BehaviorSubject<BackendErrorMessages> = new BehaviorSubject({});

    public userRating = this.store.selectSnapshot(PersonState.ratings);
    public avgRating = this.store.selectSnapshot(PersonState.avg_rating);
    public ratingsData:Rating;
    public loginPopup=false;
    private formSub: Subscription;

    public isLoaded=true;

    ratingForm:FormGroup;

    public oldvalue={
        forhead:2,
        eyes: 4,
        nose: 5,
        cheeks: 6,
        lips: 7,
        chin: 9,
        face: 10,
        acting: 6,
        voice: 7
    }

    constructor(
        public currentUser: CurrentUser,
        public auth: AuthService,
        public urls: TitleUrlsService,
        public fb: FormBuilder,
        private settings: Settings,
        private store: Store,
        private route: ActivatedRoute,
        private viewportScroller: ViewportScroller,
        private i18n: Translations,
        private toast: Toast,
        private ratings: RatingService,
        private peopleTest: PeopleService,
        private http: AppHttpClient
    ) {

    }

    ngOnChanges() {
        this.ratingForm =this.fb.group({
            forehead: Number(1),
            eyes: Number(1),
            nose:Number(1),
            cheeks:Number(1),
            lips:Number(1),
            chin:Number(1),
            face:Number(1),
            acting:Number(1),
            voice:Number(1),
            direction: Number(1),
            modelling: Number(1),
            influencer: Number(1),
            writing: Number(1),
            production: Number(1)
        })
        console.log(  'Rating ' );
        if(this.item){
            this.ratingForm.patchValue(this.item);
        }

        this.route.params.subscribe(() => {
            this.viewportScroller.scrollToPosition([0, 0]);
            this.store.dispatch(new ToggleGlobalLoader(false));
        });
    }

    public confirm() {
      if(this.currentUser.isLoggedIn()){

      const params = {
          ...this.ratingForm.value,
          personId:this.person.id,
      };

      const observable = this.ratings.create(params);

      observable
          .subscribe(response => {
              this.toast.open("Rating Updated");
              window.location.reload();
          }, errorResponse => {
              this.errors$.next(errorResponse.messages);
          });
      }else{
          this.loginPopup=true;
      }
  }

  public closePopup(){
    this.loginPopup=false;
}

protected isLoading() {
    return this.store.selectSnapshot(PersonState.loading);
}



}
