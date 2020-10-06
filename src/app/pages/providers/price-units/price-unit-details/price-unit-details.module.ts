import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PriceUnitDetailsPage } from './price-unit-details.page';

const routes: Routes = [
  {
    path: '',
    component: PriceUnitDetailsPage
  },
  {
    path: ':t',
    component: PriceUnitDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PriceUnitDetailsPage]
})
export class PriceUnitDetailsPageModule {}
