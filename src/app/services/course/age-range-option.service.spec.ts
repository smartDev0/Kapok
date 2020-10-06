import { TestBed } from '@angular/core/testing';

import { AgeRangeOptionService } from './age-range-option.service';

describe('AgeRangeOptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgeRangeOptionService = TestBed.get(AgeRangeOptionService);
    expect(service).toBeTruthy();
  });
});
