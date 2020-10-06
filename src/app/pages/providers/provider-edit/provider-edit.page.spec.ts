import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderEditPage } from './provider-edit.page';

describe('ProviderEditPage', () => {
  let component: ProviderEditPage;
  let fixture: ComponentFixture<ProviderEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
