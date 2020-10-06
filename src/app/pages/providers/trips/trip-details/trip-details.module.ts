import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TripDetailsPage } from './trip-details.page';

const routes: Routes = [
  {
    path: '',
    component: TripDetailsPage
  },
  {
    path: ':providerId/:tripId',
    component: TripDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TripDetailsPage]
})
export class TripDetailsPageModule {}
