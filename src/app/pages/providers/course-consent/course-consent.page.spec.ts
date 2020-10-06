import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseConsentPage } from './course-consent.page';

describe('CourseConsentPage', () => {
  let component: CourseConsentPage;
  let fixture: ComponentFixture<CourseConsentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseConsentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
