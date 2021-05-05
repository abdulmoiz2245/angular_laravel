/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Ccselect2Component } from './ccselect2.component';

describe('BasicComponent', () => {
  let component: Ccselect2Component;
  let fixture: ComponentFixture<Ccselect2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ccselect2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ccselect2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
