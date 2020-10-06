import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SkiCourseEditPage } from './ski-course-edit.page';
import {JoditAngularModule} from 'jodit-angular';

const routes: Routes = [
  {
    path: '',
    component: SkiCourseEditPage
  },
  {
    path: ':t',
    component: SkiCourseEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    JoditAngularModule,
  ],
  declarations: [SkiCourseEditPage]
})
export class SkiCourseEditPageModule {}
