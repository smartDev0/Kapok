import { TestBed } from '@angular/core/testing';

import { PriceUnitService } from './price-unit.service';

describe('PriceUnitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriceUnitService = TestBed.get(PriceUnitService);
    expect(service).toBeTruthy();
  });
});
