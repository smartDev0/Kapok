import { TestBed } from '@angular/core/testing';

import { LevelOptionService } from './level-option.service';

describe('LevelOptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LevelOptionService = TestBed.get(LevelOptionService);
    expect(service).toBeTruthy();
  });
});
