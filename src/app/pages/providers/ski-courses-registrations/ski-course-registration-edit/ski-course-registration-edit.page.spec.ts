import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkiCourseRegistrationEditPage } from './ski-course-registration-edit.page';

describe('SkiCourseRegistrationEditPage', () => {
  let component: SkiCourseRegistrationEditPage;
  let fixture: ComponentFixture<SkiCourseRegistrationEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkiCourseRegistrationEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkiCourseRegistrationEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
