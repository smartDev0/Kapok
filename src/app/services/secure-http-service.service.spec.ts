import { TestBed } from '@angular/core/testing';

import { SecureHttpService } from './secure-http-service.service';

describe('SecureHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecureHttpService = TestBed.get(SecureHttpService);
    expect(service).toBeTruthy();
  });
});
