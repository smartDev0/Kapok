import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MountainDetailsPage } from './mountain-details.page';

const routes: Routes = [
  {
    path: '',
    component: MountainDetailsPage
  },
  {
    path: ':t',
    component: MountainDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MountainDetailsPage]
})
export class MountainDetailsPageModule {}
