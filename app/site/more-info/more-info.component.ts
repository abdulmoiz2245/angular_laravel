import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange, ViewEncapsulation} from '@angular/core';
import {PersonState} from '../people/state/person-state';
import {Observable,Subscription} from 'rxjs';
import {Select, Store} from '@ngxs/store';

@Component({
  selector: 'more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MoreInfoComponent implements OnChanges {
  @Input() person: any;
  @Select(PersonState.person_meta) person$: Observable<any>;
  public unknown="Under Review";
  ngOnChanges() {
    console.log( '111' );
  }
}
