import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceUnitsPage } from './price-units.page';

describe('PriceUnitsPage', () => {
  let component: PriceUnitsPage;
  let fixture: ComponentFixture<PriceUnitsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceUnitsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceUnitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
