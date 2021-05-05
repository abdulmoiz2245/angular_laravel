import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Title} from '../../../models/title';
import {Person} from '../../../models/person';
import {PeopleService} from '../../people/people.service';
import {BehaviorSubject} from 'rxjs';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {MEDIA_TYPE} from '../../media-type';
import {Store} from '@ngxs/store';
import {PlayVideo} from '../../player/state/player-state-actions';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'recently-rated-celeb',
  templateUrl: './recently-rated-celeb.component.html',
  styleUrls: ['./recently-rated-celeb.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentlyRatedCelebComponent {
  public people$: BehaviorSubject<PaginationResponse<Person>> = new BehaviorSubject(null);
  @Input() items: (Title|Person)[] = [];
  @Input() showPlayButton = false;
  @Output() actionClick = new EventEmitter();

  public trackByFn = (i: number, item: Title|Person) => item.id;

  constructor(
      private people: PeopleService,
      public urls: TitleUrlsService,
      private route: ActivatedRoute,
      private store: Store, //
  ) {}

  ngOnInit() {      
    this.loadPeople();         
}

private loadPeople(reload = false) {      
    const page = (this.people$.value && !reload) ? (this.people$.value.current_page + 1) : 1;
    this.people.getAll({perPage: 10, page, recentlyRated: true, order: ""})          
        .subscribe(response => {
            if (this.people$.value && !reload) {
                response.pagination.data = [...this.people$.value.data, ...response.pagination.data];                  
            }
            this.people$.next(response.pagination);
        });
}

  public isPerson(item: Title|Person) {
      return item.type !== MEDIA_TYPE.PERSON;
  }

  public playVideo(title: Title) {
      this.store.dispatch(new PlayVideo(title.videos[0], title));
  }
  
customOptions: any = {
  loop: false,
  navSpeed: 700,  
  autoWidth:true,      
  responsive: {        
    0: {
      items: 1
    },
    300: {
      items: 2
    },
    450:{
      items: 3
    },
    600:{
      items: 4
    },
    750:{
      items: 5
    },
    900:{
      items: 6
    },      
    1200: {
      items: 8
    },
    1500: {
      items: 9
    },
    1900: {
      items: 10
    },
    2100: {
      items: 15
    }

  },
  
}
}
