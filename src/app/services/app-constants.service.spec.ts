import { TestBed } from '@angular/core/testing';

import { AppConstants } from './app-constants.service';

describe('AppConstants', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppConstants = TestBed.get(AppConstants);
    expect(service).toBeTruthy();
  });
});
