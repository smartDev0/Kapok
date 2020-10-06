import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkiCourseRegistrationConfirmPage } from './ski-course-registration-confirm.page';

describe('SkiCourseRegistrationConfirmPage', () => {
  let component: SkiCourseRegistrationConfirmPage;
  let fixture: ComponentFixture<SkiCourseRegistrationConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkiCourseRegistrationConfirmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkiCourseRegistrationConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
