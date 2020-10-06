import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWizardPage } from './test-wizard.page';

describe('TestWizardPage', () => {
  let component: TestWizardPage;
  let fixture: ComponentFixture<TestWizardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestWizardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWizardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
