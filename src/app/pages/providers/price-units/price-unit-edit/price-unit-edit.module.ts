import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PriceUnitEditPage } from './price-unit-edit.page';

const routes: Routes = [
  {
    path: '',
    component: PriceUnitEditPage
  },
  {
    path: ':t',
    component: PriceUnitEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PriceUnitEditPage]
})
export class PriceUnitEditPageModule {}
