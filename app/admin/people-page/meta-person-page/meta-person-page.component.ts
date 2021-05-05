import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy,ChangeDetectorRef} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {ActivatedRoute, Router} from '@angular/router';
import {CreatePerson,LoadPersonMeta, ResetState, UpdatePerson, UpdatePersonMeta} from './state/meta-person-state-actions';
import {MetaPersonState} from './state/meta-person-state';
import {FormBuilder} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material';
import {MESSAGES} from '../../../toast-messages';
import {Toast} from '@common/core/ui/toast.service';
import {FAQS} from '../../../site/people/person-page/faq-data';

@Component({
  selector: 'meta-person-page',
  templateUrl: './meta-person-page.component.html',
  styleUrls: ['./meta-person-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MetaPersonPageComponent implements OnInit {
    @Select(MetaPersonState.loading) loading$: Observable<boolean>;
    public poster$ = new BehaviorSubject<string>(null);
    public dataSource = new MatTableDataSource();
    public faqs = JSON.parse(JSON.stringify(FAQS));
    public temp  : any;
    public person_meta  : any;

    public personFormMeta = this.fb.group({
      also_known_as: [''],
      stage_name: [''],
      real_name: [''],
      star_sign: [''],
      eyes_color: [''],
      current_city: [''],
      residence: [''],
      politics: [''],
      food_habit: [''],
      parents: [''],
      siblings: [''],
      school: [''],
      college: [''],
      education: [''],
      height: [''],
      nationality: [''],
      affairs: [''],
      instagram: [''],
      facebook: [''],
      twitch:[],
      twitter: [''],
      youTube: [''],
      quora: [''],
      spotify: [''],
      website: [''],
      religion: [''],
      hair_color: [''],
      net_worth: [''],
      faqs:this.fb.group({
        gym: [''],
        alcohol: [''],
        smoke: [''],
        cooking: [''],
        father: [''],
        mother: [''],
        from: [''],
        birthday: [''],
        age: [''],
        search: [''],
      }),
  });

  constructor(
      private store: Store,
      private toast: Toast,
      private router: Router,
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private cdr: ChangeDetectorRef
  ) {
    this.temp='Cons';
  }

  ngOnInit() {
      this.route.params.subscribe(params => {
          this.loadPerson(params);
      });
  }

  ngOnDestroy() {
      this.store.dispatch(new ResetState());
  }

  private loadPerson(params: {id?: string}) {
      if ( ! params.id) return;
      this.store.dispatch(new LoadPersonMeta(+params.id)).subscribe(() => {

          this.person_meta = this.store.selectSnapshot(MetaPersonState.person_meta);
          this.faqs.forEach((item, index)=>{
              if(item.question!=null){
                this.faqs[index].question = item.question.replace("Celebrity Name", this.person_meta.people_name );
              }
          })
          console.log( this.faqs );
          this.cdr.markForCheck();

          this.personFormMeta.patchValue(this.person_meta );
      });
  }

    public submit_meta() {
      console.log(this.personFormMeta.value);
      const person = this.store.selectSnapshot(MetaPersonState.person);
      if(person.id){
        const response =this.store.dispatch(new UpdatePersonMeta(this.personFormMeta.value));
        response.subscribe(() => {
          this.router.navigate(['/admin/people']);
          this.toast.open(person.id ? MESSAGES.PERSON_UPDATE_SUCCESS : MESSAGES.PERSON_CREATE_SUCCESS);
      });
      }
    }

    public applyFilter(value: string) {
      this.dataSource.filter = value;
    }
}