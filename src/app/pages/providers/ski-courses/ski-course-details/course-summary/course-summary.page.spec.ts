import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSummaryPage } from './course-summary.page';

describe('CourseSummaryPage', () => {
  let component: CourseSummaryPage;
  let fixture: ComponentFixture<CourseSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseSummaryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
