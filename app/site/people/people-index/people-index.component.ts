import {ChangeDetectionStrategy, Component, NgZone, OnInit,ViewChild,ViewEncapsulation} from '@angular/core';
import {PeopleService} from '../people.service';
import {BehaviorSubject} from 'rxjs';
import {Settings} from '../../../../common/core/config/settings.service';
import {Select, Store} from '@ngxs/store';
import {Person} from '../../../models/person';
import {finalize} from 'rxjs/operators';
import {debounceTime, skip} from 'rxjs/operators';
import {Translations} from '../../../../common/core/translations/translations.service';
import {ShareableNetworks, shareLinkSocially} from '../../../../common/core/utils/share-link-socially';
import {BrowseTitleState} from '../../titles/state/browse/browse-title.state';
import {Observable, Subscription} from 'rxjs';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {shareViaEmail} from '../../../../common/core/utils/share-via-email';
import {copyToClipboard} from '../../../../common/core/utils/copy-link-to-clipboard';
import {MESSAGES} from '../../../toast-messages';
import {Toast} from '../../../../common/core/ui/toast.service';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {ActivatedRoute, Router} from '@angular/router';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {FormControl,FormBuilder} from '@angular/forms';
import {MatSelectionList} from '@angular/material';
import {CountryListItem, LanguageListItem, ValueLists} from '@common/core/services/value-lists.service';

@Component({
    selector: 'people-index',
    templateUrl: './people-index.component.html',
    styleUrls: ['./people-index.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleIndexComponent extends InfiniteScroll implements OnInit {
    @ViewChild('looksList', {static: true}) genreList: MatSelectionList;
    @Select(BrowseTitleState.genres) genres$: Observable<string[]>;
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public people$: BehaviorSubject<PaginationResponse<Person>> = new BehaviorSubject(null);
    public sortFormControl = new FormControl('');
    private formSub: Subscription;
    public looksOption$ =[
        'overall looks',
        'best forehead',
        'best eyes',
        'best nose',
        'best lips',
        'best cheeks',
        'best chin',
        'best face',
    ];

    public skillsOption$=[
        'overall skills',
        'best acting',
        'best voice',
        'best direction',
        'best modelling',
        'best influencing',
        'best writing',
        'best production'
    ];

    public countries$:any;

    public professionOptions$=[
        'all',
        'model',
        'influencer',
        'singer',
        'actor',
        'director',
        'writer',
        'producer'
    ];

    public sortOptions = {
        'name': 'Name',
        'birth_date': 'Birthday',
        'popularity': 'Popularity',
        'created_at': 'Date Added',
    };



    public form = this.fb.group({
        title_type: [],
        title_search: [],
        title_id: [],
        death: []=["asc"],
        birthday: []=["asc"],
        age: [],
        gender: [],
        ratings: [],
        skills: [],
        looks: [],
        country: [],
        profession: [],
        lookskills: [],
        birthstatus: [],
        deathstatus: [],
        genderstatus: []
    });

    constructor(
        private people: PeopleService,
        private fb: FormBuilder,
        private settings: Settings,
        private store: Store,
        private valueLists: ValueLists,
        public urls: TitleUrlsService,
        public breakpoints: BreakpointsService,
        private route: ActivatedRoute,
        private router: Router,
        protected zone: NgZone,
        private i18n: Translations,
        private toast: Toast
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

        this.route.queryParams.pipe(skip(1)).subscribe(params => {
            if (params.type && params.type !== this.form.value.type) {
                this.form.reset({type: params.type});
            }
        });
        this.loadCountries();
        this.loadPeople();
        
        

        this.formSub = this.form.valueChanges
        .pipe(debounceTime(50))
        .subscribe(value => {
            this.loadPeople(true,value);
        });

        

        const params = this.queryParamsToFilters(
            this.route.snapshot.queryParams
        );
        

        this.form.patchValue(params);


        // const defaultSort = this.route.snapshot.queryParams.sort ?
        //     this.route.snapshot.queryParams.sort :
        //     'popularity:desc';
        // this.sortFormControl.setValue(defaultSort);

        this.sortFormControl.valueChanges.subscribe(sort => {
            this.router.navigate([], {queryParams: {sort}});
            this.loadPeople(true);
        });


    
        
    }

    private loadPeople(reload = false,filter={}) {
        this.loading$.next(true);
        const page = (this.people$.value && !reload) ? (this.people$.value.current_page + 1) : 1;  
        
        filter=this.queryParamsToFilters(filter);        

        const newFilter={};

        if (filter['birthstatus']=='true'){                
            newFilter['birthday']=filter['birthday'];                
        }
        if (filter['deathstatus']=='true'){                
            newFilter['death']=filter['death'];                
        }
        if (filter['genderstatus']=='true'){                
            newFilter['gender']=filter['gender'];                
        }

        Object.keys(filter).forEach(key => {
            if(key=='birthday' || key=='death' || key=='gender' ){
                return ;
            } else{
                newFilter[key]=filter[key];
            }            
        });


                
        // apply specified filters as query params to current url
        this.router.navigate([], {queryParams: this.filtersToQueryParams(newFilter), replaceUrl: true});

        const queryParams={
            perPage: 12,
            page:page,
            topRated: true,
            ...newFilter
        };

        this.people.getAll(queryParams)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {                
                if (this.people$.value && !reload) {                    
                    response.pagination.data = [...this.people$.value.data, ...response.pagination.data];
                }
                this.people$.next(response.pagination);
            });
    }

    protected loadMoreItems() {        
        this.loadPeople(false,this.form.value);
    }

    protected canLoadMore() {
        return !this.isLoading() && this.people$.value.current_page < this.people$.value.last_page;
    }

    protected isLoading() {
        return this.loading$.value;
    }

    public shareUsing(type: ShareableNetworks | 'mail' | 'copy') {        
        const link = this.settings.getBaseUrl(true)+"people";

        if (type === 'mail') {
            const siteName = this.settings.get('branding.site_name');
            const subject = this.i18n.t('Check out this link on ') + siteName;
            const body = `${siteName} - ${link}`;
            shareViaEmail(subject, body);
        } else if (type === 'copy') {
            if (copyToClipboard(link)) {
                this.toast.open(MESSAGES.COPY_TO_CLIPBOARD_SUCCESS);
            }
        } else {
            shareLinkSocially(type, link,"cCelebs");
        }
    }

    public filtersToQueryParams(values: object) {
        const queryParams = {};
        Object.keys(values).forEach(key => {
            if (!values[key]) return;
            queryParams[key] = Array.isArray(values[key]) ?
                values[key].join(',') :
                values[key];
        });
        return queryParams;
    }

    private loadCountries(){
        this.valueLists.get(['countries', 'languages']).subscribe(response => {
            this.countries$=response.countries;
        });
    }

    private queryParamsToFilters(params: object): any {
        const formValues = {};        

        const keys = ['looks', 'lookskills', 'skills', 'profession','birthstatus','deathstatus','genderstatus'];
        Object.keys(params).forEach(key => {
            if ( ! params[key]) return;

            if (! params[key].length) return;
        
            if (keys.indexOf(key) > -1 && !Array.isArray(params[key])) {
                formValues[key] = params[key].split(',');
            } else if (params[key] === 'true') {
                formValues[key] = true;
            } else if (params[key] === 'false') {
                formValues[key] = false;
            } else {                                
                formValues[key] = params[key];
            }
        });

        return formValues;
    }


    public searchPerson(params:any){ 
        this.form.patchValue({
            title_search:[params.name],
            title_id:[params.id]
        })
        return;

    }

    public getType(){     

        if(this.form.value.title_type)   
            return this.form.value.title_type;
        else
            return true;
        
    }

    public clearAllFilters() {
        this.form.reset({
            death:["asc"],
            birthday:["asc"],
        });
    }

}
