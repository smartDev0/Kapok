import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAvailabilitiesPage } from './school-availabilities.page';

describe('SchoolAvailabilitiesPage', () => {
  let component: SchoolAvailabilitiesPage;
  let fixture: ComponentFixture<SchoolAvailabilitiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolAvailabilitiesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolAvailabilitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
