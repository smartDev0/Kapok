import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripRegistrationEditPage } from './trip-registration-edit.page';

describe('TripRegistrationEditPage', () => {
  let component: TripRegistrationEditPage;
  let fixture: ComponentFixture<TripRegistrationEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripRegistrationEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripRegistrationEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
