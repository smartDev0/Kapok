import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkiCoursesRegistrationsPage } from './ski-courses-registrations.page';

describe('SkiCoursesRegistrationsPage', () => {
  let component: SkiCoursesRegistrationsPage;
  let fixture: ComponentFixture<SkiCoursesRegistrationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkiCoursesRegistrationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkiCoursesRegistrationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
