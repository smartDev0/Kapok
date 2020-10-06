import { TestBed } from '@angular/core/testing';

import { ToastUtil } from './toast-util.service';

describe('ToastUtil', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastUtil = TestBed.get(ToastUtil);
    expect(service).toBeTruthy();
  });
});
