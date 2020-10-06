import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TripRegistrationDetailsPage } from './trip-registration-details.page';
import {StudentUtil} from '../../../../services/student-util.service';

const routes: Routes = [
  {
    path: '',
    component: TripRegistrationDetailsPage
  },
  {
    path: ':t',
    component: TripRegistrationDetailsPage
  },
  {
    path: ':providerId/:tripRegistrationId/:fromLink',
    component: TripRegistrationDetailsPage
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
  declarations: [TripRegistrationDetailsPage]
})
export class TripRegistrationDetailsPageModule {}
