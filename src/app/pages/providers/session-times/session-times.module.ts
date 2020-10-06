import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SessionTimesPage } from './session-times.page';
import {SessionsCalendarComponentModule} from "./sessions-calendar/sessions-calendar.module";

const routes: Routes = [
  {
    path: '',
    component: SessionTimesPage
  },
  {
    path: ':t',
    component: SessionTimesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SessionsCalendarComponentModule,
  ],
  declarations: [SessionTimesPage]
})
export class SessionTimesPageModule {}
