import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipTypesPage } from './membership-types.page';

describe('MembershipTypesPage', () => {
  let component: MembershipTypesPage;
  let fixture: ComponentFixture<MembershipTypesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipTypesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
