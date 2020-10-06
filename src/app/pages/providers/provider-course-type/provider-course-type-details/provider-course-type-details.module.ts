import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProviderCourseTypeDetailsPage } from './provider-course-type-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderCourseTypeDetailsPage
  },
  {
    path: ':t',
    component: ProviderCourseTypeDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProviderCourseTypeDetailsPage]
})
export class ProviderCourseTypeDetailsPageModule {}
