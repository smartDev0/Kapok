import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceUnitEditPage } from './price-unit-edit.page';

describe('PriceUnitEditPage', () => {
  let component: PriceUnitEditPage;
  let fixture: ComponentFixture<PriceUnitEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceUnitEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceUnitEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
