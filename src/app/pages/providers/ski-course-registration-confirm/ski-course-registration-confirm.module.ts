import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SkiCourseRegistrationConfirmPage } from './ski-course-registration-confirm.page';
import {StudentUtil} from "../../../services/student-util.service";
import {GuestCheckoutPageModule} from "../guest-checkout/guest-checkout.module";
import {StudentPageModule} from "../student/student.module";

const routes: Routes = [
  {
    path: '',
    component: SkiCourseRegistrationConfirmPage
  },
  {
    path: ':t',
    component: SkiCourseRegistrationConfirmPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    StudentPageModule,
    GuestCheckoutPageModule,
  ],
  providers: [
    StudentUtil,
  ],
  declarations: [SkiCourseRegistrationConfirmPage, ]
})
export class SkiCourseRegistrationConfirmPageModule {}
