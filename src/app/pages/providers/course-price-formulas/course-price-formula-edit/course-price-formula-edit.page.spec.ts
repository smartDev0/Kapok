import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePriceFormulaEditPage } from './course-price-formula-edit.page';

describe('CoursePriceFormulaEditPage', () => {
  let component: CoursePriceFormulaEditPage;
  let fixture: ComponentFixture<CoursePriceFormulaEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePriceFormulaEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePriceFormulaEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
