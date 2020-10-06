import { TestBed } from '@angular/core/testing';

import { DateTimeUtils } from './date-time-utils.service';

describe('DateTimeUtils', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DateTimeUtils = TestBed.get(DateTimeUtils);
    expect(service).toBeTruthy();
  });
});
