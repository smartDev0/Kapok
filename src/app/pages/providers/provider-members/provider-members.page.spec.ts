import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderMembersPage } from './provider-members.page';

describe('ProviderMembersPage', () => {
  let component: ProviderMembersPage;
  let fixture: ComponentFixture<ProviderMembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderMembersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
