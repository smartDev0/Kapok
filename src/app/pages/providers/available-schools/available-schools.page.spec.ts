import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableSchoolsPage } from './available-schools.page';

describe('AvailableSchoolsPage', () => {
  let component: AvailableSchoolsPage;
  let fixture: ComponentFixture<AvailableSchoolsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableSchoolsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableSchoolsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
