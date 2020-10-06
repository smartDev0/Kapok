import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SkiCoursesRegistrationsPage } from './ski-courses-registrations.page';
import {SearchUserComponentModule} from "../search-user/search-user.module";

const routes: Routes = [
  {
    path: '',
    component: SkiCoursesRegistrationsPage
  },
  {
    path: ':t',
    component: SkiCoursesRegistrationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SearchUserComponentModule
  ],
  declarations: [SkiCoursesRegistrationsPage]
})
export class SkiCoursesRegistrationsPageModule {}
