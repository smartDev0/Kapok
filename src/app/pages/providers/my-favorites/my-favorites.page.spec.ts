import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFavoritesPage } from './my-favorites.page';

describe('MyFavoritesPage', () => {
  let component: MyFavoritesPage;
  let fixture: ComponentFixture<MyFavoritesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFavoritesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFavoritesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
