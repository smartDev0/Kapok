import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTimesPage } from './session-times.page';

describe('SessionTimesPage', () => {
  let component: SessionTimesPage;
  let fixture: ComponentFixture<SessionTimesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionTimesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTimesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
