import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProviderCourseTypePage } from './provider-course-type.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderCourseTypePage
  },
  {
    path: ':t',
    component: ProviderCourseTypePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProviderCourseTypePage]
})
export class ProviderCourseTypePageModule {}
