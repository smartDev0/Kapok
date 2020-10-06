import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeRangeOptionsPage } from './age-range-options.page';

describe('AgeRangeOptionsPage', () => {
  let component: AgeRangeOptionsPage;
  let fixture: ComponentFixture<AgeRangeOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeRangeOptionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeRangeOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
