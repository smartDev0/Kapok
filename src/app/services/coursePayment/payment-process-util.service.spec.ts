import { TestBed } from '@angular/core/testing';

import { PaymentProcessUtil } from './payment-process-util.service';

describe('PaymentProcessUtil', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentProcessUtil = TestBed.get(PaymentProcessUtil);
    expect(service).toBeTruthy();
  });
});
