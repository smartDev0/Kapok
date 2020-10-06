import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorEditPage } from './administrator-edit.page';

describe('AdministratorEditPage', () => {
  let component: AdministratorEditPage;
  let fixture: ComponentFixture<AdministratorEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministratorEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
