import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkiCourseEditPage } from './ski-course-edit.page';

describe('SkiCourseEditPage', () => {
  let component: SkiCourseEditPage;
  let fixture: ComponentFixture<SkiCourseEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkiCourseEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkiCourseEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
