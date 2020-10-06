import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCourseTimePage } from './choose-course-time.page';

describe('ChooseCourseTimePage', () => {
  let component: ChooseCourseTimePage;
  let fixture: ComponentFixture<ChooseCourseTimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseCourseTimePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCourseTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
