import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkiCoursesPage } from './ski-courses.page';

describe('SkiCoursesPage', () => {
  let component: SkiCoursesPage;
  let fixture: ComponentFixture<SkiCoursesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkiCoursesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkiCoursesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
