import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTimePage } from './session-time.page';

describe('SessionTimePage', () => {
  let component: SessionTimePage;
  let fixture: ComponentFixture<SessionTimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionTimePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
