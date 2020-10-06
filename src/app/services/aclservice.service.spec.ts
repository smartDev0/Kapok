import { TestBed } from '@angular/core/testing';

import { ACLService } from './aclservice.service';

describe('ACLService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ACLService = TestBed.get(ACLService);
    expect(service).toBeTruthy();
  });
});
