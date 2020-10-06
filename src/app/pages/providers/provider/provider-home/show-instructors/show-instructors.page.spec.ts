import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowInstructorsPage } from './show-instructors.page';

describe('ShowInstructorsPage', () => {
  let component: ShowInstructorsPage;
  let fixture: ComponentFixture<ShowInstructorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowInstructorsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowInstructorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
