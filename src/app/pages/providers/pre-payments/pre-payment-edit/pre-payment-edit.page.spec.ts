import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePaymentEditPage } from './pre-payment-edit.page';

describe('PrePaymentEditPage', () => {
  let component: PrePaymentEditPage;
  let fixture: ComponentFixture<PrePaymentEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrePaymentEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrePaymentEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
