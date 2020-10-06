import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoursePaymentDetailsPage } from './course-payment-details.page';
import {CourseCalculationDetailsPageModule} from "./course-calculation-details/course-calculation-details.module";

const routes: Routes = [
  // current from root: course-payment-details
  {
    path: '',
    component: CoursePaymentDetailsPage
  },
  {
    path: ':t',
    component: CoursePaymentDetailsPage
  },

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CourseCalculationDetailsPageModule
  ],
  declarations: [CoursePaymentDetailsPage, ],
})
export class CoursePaymentDetailsPageModule {}
