import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MountainsPage } from './mountains.page';

describe('MountainsPage', () => {
  let component: MountainsPage;
  let fixture: ComponentFixture<MountainsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MountainsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MountainsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
