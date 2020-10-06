import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SkiCourseRegistrationDetailsPage } from './ski-course-registration-details.page';
import {CourseCalculationDetailsPageModule} from '../../../course-payment-details/course-calculation-details/course-calculation-details.module';
import {EmailNotificationPageModule} from "../../email-notification/email-notification.module";

const routes: Routes = [
  {
    path: '',
    component: SkiCourseRegistrationDetailsPage
  },
  {
    path: ':t',
    component: SkiCourseRegistrationDetailsPage
  },
  {
    path: ':providerId/:registrationId',
    component: SkiCourseRegistrationDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),

    CourseCalculationDetailsPageModule,
    EmailNotificationPageModule
  ],
  declarations: [SkiCourseRegistrationDetailsPage]
})
export class SkiCourseRegistrationDetailsPageModule {}
