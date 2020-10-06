import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkiCourseRegistrationDetailsPage } from './ski-course-registration-details.page';

describe('SkiCourseRegistrationDetailsPage', () => {
  let component: SkiCourseRegistrationDetailsPage;
  let fixture: ComponentFixture<SkiCourseRegistrationDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkiCourseRegistrationDetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkiCourseRegistrationDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
