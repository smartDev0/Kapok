import { TestBed } from '@angular/core/testing';
import {AttachedFileService} from './attached-file.service';


describe('AttachedFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttachedFileService = TestBed.get(AttachedFileService);
    expect(service).toBeTruthy();
  });
});
