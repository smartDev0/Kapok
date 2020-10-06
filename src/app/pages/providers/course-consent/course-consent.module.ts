import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CourseConsentPage } from './course-consent.page';

const routes: Routes = [
  {
    path: '',
    component: CourseConsentPage
  },
  {
    path: ':providerId',
    component: CourseConsentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CourseConsentPage]
})
export class CourseConsentPageModule {}
