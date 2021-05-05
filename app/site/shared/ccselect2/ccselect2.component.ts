import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';

@Component({
  selector: 'ccselect2',
  templateUrl: './ccselect2.component.html',
  styleUrls: ['./ccselect2.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ccselect2Component implements OnInit {

  public exampleData: Array<Select2OptionData>;

  constructor() { }

  ngOnInit() {

    
    this.exampleData = [
      {
        id: 'basic1',
        text: 'Acting'
      },
      {
        id: 'basic2',        
        text: 'Dance'
      },
      {
        id: 'basic3',
        text: 'Music'
      },
      {
        id: 'basic4',
        text: 'Direction'
      }
    ];
  }

}
