import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TripHillPage } from './trip-hill.page';

const routes: Routes = [
  {
    path: '',
    component: TripHillPage
  },
  {
    path: ':t',
    component: TripHillPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TripHillPage]
})
export class TripHillPageModule {}
