import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePriceFormulasPage } from './course-price-formulas.page';

describe('CoursePriceFormulasPage', () => {
  let component: CoursePriceFormulasPage;
  let fixture: ComponentFixture<CoursePriceFormulasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePriceFormulasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePriceFormulasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
