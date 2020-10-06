import { TestBed } from '@angular/core/testing';

import { MembershipPaymentService } from './membership-payment.service';

describe('MembershipPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MembershipPaymentService = TestBed.get(MembershipPaymentService);
    expect(service).toBeTruthy();
  });
});
