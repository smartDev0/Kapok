import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRegistrationPaymentPage } from './cancel-registration-payment.page';

describe('CancelRegistrationPaymentPage', () => {
  let component: CancelRegistrationPaymentPage;
  let fixture: ComponentFixture<CancelRegistrationPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelRegistrationPaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelRegistrationPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
