import { AfterViewInit,Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy,ViewChild,ElementRef} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Settings} from '@common/core/config/settings.service';
import {Subscription} from '@common/shared/billing/models/subscription';
import {Subscriptions} from '@common/shared/billing/subscriptions.service';
import {BehaviorSubject, Observable, of as observableOf, Subject, from} from 'rxjs';
import {debounceTime, distinctUntilChanged, finalize, switchMap} from 'rxjs/operators';
import {Toast} from '@common/core/ui/toast.service';
import {Person} from '../../../app/models/person';
import {Plan} from '@common/core/types/models/Plan';
import {CurrentUser} from '../../auth/current-user';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {ActivatedRoute, Router} from '@angular/router';
import {PeopleService} from '../../../app/site/people/people.service';

declare var hljs: any;

interface Price {
  value: string;
  viewValue: string;
}

interface Errors extends Partial<Subscription> {
  general?: string;
}


@Component({
  selector: 'support-us',
  templateUrl: './support-us.component.html',
  styleUrls: ['./support-us.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportUsComponent implements OnInit {
  public loading$ = new BehaviorSubject<boolean>(false);
  public errors$ = new BehaviorSubject<Errors>({});
  public content$ = new BehaviorSubject<any>("");
  public footercontent$ = new BehaviorSubject<any>("");
  public people$: BehaviorSubject<PaginationResponse<Person>> = new BehaviorSubject(null);
  public plans;
  public monthPlan;
  public yearPlan;
  public plan_id;
  public subscriptionName="cCelebs Subscription";

  public defaultPrice: string = '3';
  public payPalConfig?: any;

  public showSuccess: boolean = false;  
  public showCancel: boolean = false;
  public showError: boolean = false;

  private clientId:string = "sb";

  private currencyCode: string="USD";

  Prices: Price[] = [
    {value: '3', viewValue: 'Star: $3 / Monthly'},
    {value: '5.99', viewValue: 'Superstar: $5.99 / Monthly'},
    {value: '11.99', viewValue: 'Epic: $11.99 / Monthly'},
    {value: '23.99', viewValue: 'Guardian: $23.99 / Monthly'},
    {value: '49.99', viewValue: 'Hero: $49.99 / Monthly'},
    {value: '100', viewValue: 'Legend: $100 / Monthly'},
    {value: '500', viewValue: 'Angel: $500 / Monthly'},
  ];

  YearPrices: Price[] = [
    {value: '36', viewValue: 'Star: $36 / Yearly'},
    {value: '72', viewValue: 'Superstar: $72 / Yearly'},
    {value: '144', viewValue: 'Epic: $144 / Yearly'},
    {value: '288', viewValue: 'Guardian: $288 / Yearly'},
    {value: '576', viewValue: 'Hero: $576 / Yearly'},
    {value: '1200', viewValue: 'Legend: $1200 / Yearly'},
    {value: '5000', viewValue: 'Angel: $5000 / Yearly'},
  ];

  @ViewChild('priceElem', { static: false }) priceElem?: ElementRef;

  constructor(
    private settings:Settings,
    public subscriptions: Subscriptions,
    private route: ActivatedRoute,
    private currentUser: CurrentUser,
    private router: Router,
    private people: PeopleService,
    private toast: Toast){
      
    }

  ngOnInit() {
    this.loading$.next(true);
    this.loadPeople();
    const settings = this.settings.getFlat() || {};    
    this.content$.next(settings['support.text']);
    this.footercontent$.next(settings['support.footer']);
    this.clientId=settings['paypal_client_id'];
    this.initConfig(this.defaultPrice);
    this.route.data.subscribe((data: {plans: Plan[]}) => {
      this.plans=data.plans;
      this.monthPlan = this.plans.filter(app => { 
        if(!app.free && app.interval=="month") { 
          return app;
        } 
      });

      this.yearPlan = this.plans.filter(app => { 
        if(!app.free && app.interval=="year") { 
          return app;
        } 
      });

    });
    this.loading$.next(false);
  }

  public subscribed() {
    this.loading$.next(true);
    let request;
    const a={plan_id: this.plan_id,
      description: null,
      renews_at: "2050-01-11",
      //ends_at: "2022-01-11",
      user_id: this.currentUser.get('id')
    }

    request =  this.subscriptions.create(a);

    request
        .pipe(finalize(() => this.router.navigate(['/thanks'])))
        .subscribe(response => {
            //this.close(response.subscription);
            const action = 'created';
            this.toast.open('Subscription ' + action);
        }, err => this.errors$.next(err.messages));

  }

  private loadPeople(reload = false,filter={}) {
    
    this.loading$.next(true);
    const page = (this.people$.value && !reload) ? (this.people$.value.current_page + 1) : 1;      
    
    const queryParams={
        perPage: 12,
        page:page,
        mostPopular: true,
        birthdayToday:true
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


  public selectedPlanUser(id){    
    const data = this.plans.filter(app => { 
      if(app.id==id) { 
        return app;
      } 
    });

    return data[0];
  }

  changePrice(event:any): void {
    const seletedPlan=this.selectedPlanUser(event);
    this.defaultPrice = seletedPlan.amount;
    this.plan_id=seletedPlan.id;
    this.currencyCode=seletedPlan.currency;    
    this.subscriptionName=seletedPlan.name;
    this.initConfig(this.defaultPrice);
  }


  private initConfig(price: string): void {
    this.payPalConfig = {
      currency: this.currencyCode,
      clientId: this.clientId,
      createOrderOnClient: (data) => <any>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: this.currencyCode,
              value: price,
              breakdown: {
                item_total: {
                  currency_code: this.currencyCode,
                  value: price
                }
              }
            },
            items: [
              {
                name: this.subscriptionName,
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: this.currencyCode,
                  value: price,
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {  
        if (this.currentUser.isLoggedIn()) {
            this.subscribed();
          }        
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        this.showError = true;
      },
      onClick: (data, actions) => {
        if ( ! this.currentUser.isLoggedIn()) {
          this.currentUser.redirectUri = this.router.url;
          this.toast.open('Please Login or Register');
          return this.router.navigate(['/login']);
        }
        console.log('onClick', data, actions);
        this.resetStatus();
      },
      onInit: (data, actions) => {
        console.log('onInit', data, actions);
      }
    };
  }

  private resetStatus(): void {
    this.showError = false;
    this.showSuccess = false;
    this.showCancel = false;
  }


}
