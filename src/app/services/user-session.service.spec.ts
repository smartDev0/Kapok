import { TestBed } from '@angular/core/testing';

import { UserSession } from './user-session.service';

describe('UserSession', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserSession = TestBed.get(UserSession);
    expect(service).toBeTruthy();
  });
});
