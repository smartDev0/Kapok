import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoBioPage } from './auto-bio.page';

describe('AutoBioPage', () => {
  let component: AutoBioPage;
  let fixture: ComponentFixture<AutoBioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoBioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoBioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
