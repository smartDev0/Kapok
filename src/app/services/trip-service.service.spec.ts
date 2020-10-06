import { TestBed } from '@angular/core/testing';

import { TripServiceService } from './trip-service.service';

describe('TripServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TripServiceService = TestBed.get(TripServiceService);
    expect(service).toBeTruthy();
  });
});
