import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePaymentsPage } from './pre-payments.page';

describe('PrePaymentsPage', () => {
  let component: PrePaymentsPage;
  let fixture: ComponentFixture<PrePaymentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrePaymentsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrePaymentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
