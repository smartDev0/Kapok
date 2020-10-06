import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsRecentPage } from './comments-recent.page';

describe('CommentsRecentPage', () => {
  let component: CommentsRecentPage;
  let fixture: ComponentFixture<CommentsRecentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsRecentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsRecentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
