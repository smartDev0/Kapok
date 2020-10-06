import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelOptionsPage } from './level-options.page';

describe('LevelOptionsPage', () => {
  let component: LevelOptionsPage;
  let fixture: ComponentFixture<LevelOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelOptionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
