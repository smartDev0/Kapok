import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAccountPage } from './payment-account.page';

describe('PaymentAccountPage', () => {
  let component: PaymentAccountPage;
  let fixture: ComponentFixture<PaymentAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
