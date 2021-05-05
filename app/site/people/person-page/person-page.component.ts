import {Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit} from '@angular/core';
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
import {FAQS} from './faq-data';


@Component({
    selector: 'person-page',
    templateUrl: './person-page.component.html',
    styleUrls: ['./person-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PersonPageComponent implements OnInit {
    @Select(PersonState.person) person$: Observable<Person>;
    @Select(PersonState.person_meta) personMeta$: Observable<[any]>;
    @Select(PersonState.credits) credits$: Observable<{[key: string]: Title[]}>;
    @Select(PersonState.knownFor) knownFor$: Observable<Title[]>;
    @Select(PersonState.backdrop) backdrop$: Observable<string>;
    @Select(PersonState.creditsCount) creditsCount$: Observable<number>;
    @Select(PersonState.avg_rating) avg_rating$: Observable<any>;
    @Select(PersonState.loading) loading$: Observable<boolean>;
    @Select(PersonState.ratings) userRating$: Observable<any>;
    @Select(PersonState.visibleSkills) visibleSkills$: Observable<boolean>;

    public errors$: BehaviorSubject<BackendErrorMessages> = new BehaviorSubject({});
    public person = this.store.selectSnapshot(PersonState.person);
    public userRating = this.store.selectSnapshot(PersonState.ratings);
    public avgRating = this.store.selectSnapshot(PersonState.avg_rating);
    public personMeta = this.store.selectSnapshot(PersonState.person_meta);
    public currentYear = new Date().getFullYear();
    public ratingsData:Rating;
    public loginPopup=false;
    public faqs= []; //JSON.parse(JSON.stringify(FAQS));
    public tempfaqs=JSON.parse(JSON.stringify(FAQS));
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

    ngOnInit() {
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
        });

        // alert("Person Meta person page");
        // console.log("Person")
        // console.log(PersonState.person)
        // console.log("PersonMeta")
        // console.log(PersonState.person_meta)
        // this.personMeta = this.store.selectSnapshot(PersonState.person_meta);

        if(this.userRating){
            this.ratingForm.patchValue(this.userRating);
        }
        // console.log( "this.personMeta");
        // console.log( this.personMeta);
        // this.tempfaqs.forEach((item, index)=>{
        //     if(item.question!=null){
        //         item.question = item.question.replace("Celebrity Name", this.person.name);
        //     }
        //     // console.log( this.person.name );

        //     if(this.personMeta.faqs){
        //         let obj=this.personMeta.faqs;

        //         if(obj[item.key]!=null){
        //             item.answer=obj[item.key];
        //         }
        //     }

        //     this.faqs[index] = item;
        // })

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

    public shareUsing(type: ShareableNetworks | 'mail' | 'copy') {
        const person = this.store.selectSnapshot(PersonState.person);
        var routeLink=this.urls.mediaItem(person);
        var routeLinkSting="people/"+routeLink[1]+"/"+routeLink[2];
        const link = this.settings.getBaseUrl(true) + routeLinkSting;

        if (type === 'mail') {
            const siteName = this.settings.get('branding.site_name');
            const subject = this.i18n.t('Check out this link on ') + siteName;
            const body = `${person.name} - ${siteName} - ${link}`;
            shareViaEmail(subject, body);
        } else if (type === 'copy') {
            if (copyToClipboard(link)) {
                this.toast.open(MESSAGES.COPY_TO_CLIPBOARD_SUCCESS);
            }
        } else {
            shareLinkSocially(type, link, person.name);
        }
    }

    public showRatingWidget(){
        return this.currentUser.isLoggedIn();
    }

    public closePopup(){
        this.loginPopup=false;
    }

    protected isLoading() {
        return this.store.selectSnapshot(PersonState.loading);
    }
}
