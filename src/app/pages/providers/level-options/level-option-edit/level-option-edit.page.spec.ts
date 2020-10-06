import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelOptionEditPage } from './level-option-edit.page';

describe('LevelOptionEditPage', () => {
  let component: LevelOptionEditPage;
  let fixture: ComponentFixture<LevelOptionEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelOptionEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelOptionEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
