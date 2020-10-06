import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderHomePage } from './provider-home.page';

describe('ProviderHomePage', () => {
  let component: ProviderHomePage;
  let fixture: ComponentFixture<ProviderHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
