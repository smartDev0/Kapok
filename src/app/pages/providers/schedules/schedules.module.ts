import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SchedulesPage } from './schedules.page';
import {CourseConsentPage} from "../course-consent/course-consent.page";

const routes: Routes = [
  {
    path: '',
    component: SchedulesPage
  },
  {
    path: ':providerId',
    component: SchedulesPage
  },
  {
    path: ':providerId/:instructorId',
    component: SchedulesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SchedulesPage]
})
export class SchedulesPageModule {}
