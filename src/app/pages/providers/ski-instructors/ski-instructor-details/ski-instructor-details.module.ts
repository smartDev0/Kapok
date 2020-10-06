import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SkiInstructorDetailsPage } from './ski-instructor-details.page';

const routes: Routes = [
  {
    path: '',
    component: SkiInstructorDetailsPage
  },
  {
    path: ':t',
    component: SkiInstructorDetailsPage
  },
  {
    path: ':providerId/:instructorId',
    component: SkiInstructorDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SkiInstructorDetailsPage]
})
export class SkiInstructorDetailsPageModule {}
