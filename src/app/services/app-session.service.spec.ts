import { TestBed } from '@angular/core/testing';

import { AppSession } from './app-session.service';

describe('AppSession', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppSession = TestBed.get(AppSession);
    expect(service).toBeTruthy();
  });
});
