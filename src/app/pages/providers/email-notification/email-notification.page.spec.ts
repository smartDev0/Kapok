import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {EmailNotificationPage} from "./email-notification.page";

describe('SessionTimePage', () => {
  let component: EmailNotificationPage;
  let fixture: ComponentFixture<EmailNotificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailNotificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
