import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChooseCourseTimePage } from './choose-course-time.page';
import {StudentPageModule} from '../../student/student.module';
import {StudentUtil} from '../../../../services/student-util.service';

const routes: Routes = [
  {
    path: '',
    component: ChooseCourseTimePage
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
  providers: [
    StudentUtil,
  ],
  declarations: [ChooseCourseTimePage]
})
export class ChooseCourseTimePageModule {}
