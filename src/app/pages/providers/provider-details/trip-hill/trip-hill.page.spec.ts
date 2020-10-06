import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripHillPage } from './trip-hill.page';

describe('TripHillPage', () => {
  let component: TripHillPage;
  let fixture: ComponentFixture<TripHillPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripHillPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripHillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
