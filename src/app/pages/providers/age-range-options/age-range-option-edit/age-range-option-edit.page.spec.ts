import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeRangeOptionEditPage } from './age-range-option-edit.page';

describe('AgeRangeOptionEditPage', () => {
  let component: AgeRangeOptionEditPage;
  let fixture: ComponentFixture<AgeRangeOptionEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeRangeOptionEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeRangeOptionEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
