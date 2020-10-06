import { TestBed } from '@angular/core/testing';

import { CourseUtil } from './course-util.service';

describe('CourseUtil', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CourseUtil = TestBed.get(CourseUtil);
    expect(service).toBeTruthy();
  });
});
