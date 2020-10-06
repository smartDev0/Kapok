import { TestBed } from '@angular/core/testing';
import {CoursePaymentService} from "./course-payment-service.service";


describe('CoursePaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoursePaymentService = TestBed.get(CoursePaymentService);
    expect(service).toBeTruthy();
  });
});
