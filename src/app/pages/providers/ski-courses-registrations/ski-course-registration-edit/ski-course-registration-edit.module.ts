import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SkiCourseRegistrationEditPage } from './ski-course-registration-edit.page';
import {StudentPageModule} from "../../student/student.module";

const routes: Routes = [
  {
    path: '',
    component: SkiCourseRegistrationEditPage
  },
  {
    path: ':t',
    component: SkiCourseRegistrationEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    StudentPageModule
  ],
  declarations: [SkiCourseRegistrationEditPage]
})
export class SkiCourseRegistrationEditPageModule {}
