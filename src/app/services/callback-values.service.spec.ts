import { TestBed } from '@angular/core/testing';

import { CallbackValuesService } from './callback-values.service';

describe('CallbackValuesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CallbackValuesService = TestBed.get(CallbackValuesService);
    expect(service).toBeTruthy();
  });
});
