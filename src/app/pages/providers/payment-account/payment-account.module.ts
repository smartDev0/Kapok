import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaymentAccountPage } from './payment-account.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentAccountPage
  },
  {
    path: ':t',
    component: PaymentAccountPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentAccountPage]
})
export class PaymentAccountPageModule {}
