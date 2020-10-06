import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderMemberEditPage } from './provider-member-edit.page';

describe('ProviderMemberEditPage', () => {
  let component: ProviderMemberEditPage;
  let fixture: ComponentFixture<ProviderMemberEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderMemberEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderMemberEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
