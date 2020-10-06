import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SkiCoursesPage } from './ski-courses.page';

const routes: Routes = [
  {
    path: '',
    component: SkiCoursesPage
  },
  {
    path: ':t',
    component: SkiCoursesPage
  },
  {
    path: ':providerId/:mountainId/:instructorId/:fromCommand',
    component: SkiCoursesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SkiCoursesPage]
})
export class SkiCoursesPageModule {}
