import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReportPage } from './payment-report.page';

describe('PaymentReportPage', () => {
  let component: PaymentReportPage;
  let fixture: ComponentFixture<PaymentReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
