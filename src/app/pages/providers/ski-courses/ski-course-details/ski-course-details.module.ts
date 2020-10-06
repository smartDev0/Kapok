import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SkiCourseDetailsPage } from './ski-course-details.page';
import {CreateQuestionComponentModule} from "../../question-answers/create-question/create-question.module";
import {GuestCheckoutPageModule} from "../../guest-checkout/guest-checkout.module";

const routes: Routes = [
  {
    path: '',
    component: SkiCourseDetailsPage
  },
  {
    path: ':t',
    component: SkiCourseDetailsPage
  },
  {
    path: ':providerId/:courseId',
    component: SkiCourseDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CreateQuestionComponentModule,
    GuestCheckoutPageModule,
  ],
  declarations: [SkiCourseDetailsPage]
})
export class SkiCourseDetailsPageModule {}
