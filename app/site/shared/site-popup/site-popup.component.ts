import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {Modal} from '../../../../common/core/ui/dialogs/modal.service';
import {SitePopUpModalComponent} from '../../reviews/site-popup-modal/site-popup-modal.component';

@Component({
  selector: 'site-popup',
  templateUrl: './site-popup.component.html',
  styleUrls: ['./site-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitePopupComponent implements OnInit {

  public text;

  constructor(
    private settings: Settings,
    private modal: Modal
    ) { }

  ngOnInit() {
    if (this.settings.get('popup.disable')) return;    

    this.text = this.settings.get('popup.text');
    

    this.modal.open(
        SitePopUpModalComponent,
        {'text':this.text}
    );


  }

}
