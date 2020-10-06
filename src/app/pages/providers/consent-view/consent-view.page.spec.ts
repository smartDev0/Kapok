import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentViewPage } from './consent-view.page';

describe('ConsentViewPage', () => {
  let component: ConsentViewPage;
  let fixture: ComponentFixture<ConsentViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
