import { TestBed } from '@angular/core/testing';

import { CoursePriceFormulaService } from './course-price-formula.service';

describe('CoursePriceFormulaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoursePriceFormulaService = TestBed.get(CoursePriceFormulaService);
    expect(service).toBeTruthy();
  });
});
