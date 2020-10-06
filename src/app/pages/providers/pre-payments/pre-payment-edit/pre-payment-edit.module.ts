import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PrePaymentEditPage } from './pre-payment-edit.page';

const routes: Routes = [
  {
    path: '',
    component: PrePaymentEditPage
  },
  {
    path: ':t',
    component: PrePaymentEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PrePaymentEditPage]
})
export class PrePaymentEditPageModule {}
