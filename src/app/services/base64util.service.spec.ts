import { TestBed } from '@angular/core/testing';

import { Base64util } from './base64util.service';

describe('Base64util', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Base64util = TestBed.get(Base64util);
    expect(service).toBeTruthy();
  });
});
