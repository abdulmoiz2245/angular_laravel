import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Title} from '../../../models/title';
import {Person} from '../../../models/person';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {MEDIA_TYPE} from '../../media-type';
import {Store} from '@ngxs/store';
import {PlayVideo} from '../../player/state/player-state-actions';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
    selector: 'title-grid',
    templateUrl: './title-grid.component.html',
    styleUrls: ['./title-grid.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleGridComponent {
    @Input() items: (Title|Person)[] = [];
    @Input() showPlayButton = false;
    @Output() actionClick = new EventEmitter();

    public trackByFn = (i: number, item: Title|Person) => item.id;

    constructor(
        public urls: TitleUrlsService,
        private store: Store, //
    ) {}

    public isPerson(item: Title|Person) {        
        return item.type == MEDIA_TYPE.PERSON;
    }

    public playVideo(title: Title) {
        this.store.dispatch(new PlayVideo(title.videos[0], title));
    }
}
