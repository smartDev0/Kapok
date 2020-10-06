import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkiInstructorsPage } from './ski-instructors.page';

describe('SkiInstructorsPage', () => {
  let component: SkiInstructorsPage;
  let fixture: ComponentFixture<SkiInstructorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkiInstructorsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkiInstructorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
