import { TestBed } from '@angular/core/testing';

import { TranslateUtil } from './translate-util.service';

describe('TranslateUtil', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TranslateUtil = TestBed.get(TranslateUtil);
    expect(service).toBeTruthy();
  });
});
