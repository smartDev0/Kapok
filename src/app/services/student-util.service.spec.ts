import { TestBed } from '@angular/core/testing';

import { StudentUtil } from './student-util.service';

describe('StudentUtil', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentUtil = TestBed.get(StudentUtil);
    expect(service).toBeTruthy();
  });
});
