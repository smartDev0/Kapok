import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripEditPage } from './trip-edit.page';

describe('TripEditPage', () => {
  let component: TripEditPage;
  let fixture: ComponentFixture<TripEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
