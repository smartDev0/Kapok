import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLevelsPage } from './my-levels.page';

describe('MyLevelsPage', () => {
  let component: MyLevelsPage;
  let fixture: ComponentFixture<MyLevelsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyLevelsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLevelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
