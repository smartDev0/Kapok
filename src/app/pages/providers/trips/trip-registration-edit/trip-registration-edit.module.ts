import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TripRegistrationEditPage } from './trip-registration-edit.page';
import {StudentUtil} from '../../../../services/student-util.service';

const routes: Routes = [
  {
    path: '',
    component: TripRegistrationEditPage
  },
  {
    path: ':t',
    component: TripRegistrationEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    StudentUtil,
  ],
  declarations: [TripRegistrationEditPage]
})
export class TripRegistrationEditPageModule {}
