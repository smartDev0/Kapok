import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CancelRegistrationPaymentPage } from './cancel-registration-payment.page';

const routes: Routes = [
  {
    path: '',
    component: CancelRegistrationPaymentPage
  },
  {
    path: ':press',
    component: CancelRegistrationPaymentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CancelRegistrationPaymentPage]
})
export class CancelRegistrationPaymentPageModule {}
