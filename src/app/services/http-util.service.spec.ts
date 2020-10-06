import { TestBed } from '@angular/core/testing';

import { HttpUtil } from './http-util.service';

describe('HttpUtil', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpUtil = TestBed.get(HttpUtil);
    expect(service).toBeTruthy();
  });
});
