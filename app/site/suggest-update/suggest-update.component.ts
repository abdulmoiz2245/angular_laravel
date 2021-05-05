import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'suggest-update',
  templateUrl: './suggest-update.component.html',
  styleUrls: ['./suggest-update.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuggestUpdateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
