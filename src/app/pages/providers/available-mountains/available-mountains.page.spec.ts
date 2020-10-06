import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableMountainsPage } from './available-mountains.page';

describe('AvailableMountainsPage', () => {
  let component: AvailableMountainsPage;
  let fixture: ComponentFixture<AvailableMountainsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableMountainsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableMountainsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
