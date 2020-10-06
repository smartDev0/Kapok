import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MembershipPaymentDetailsPage } from './membership-payment-details.page';

const routes: Routes = [
  {
    path: '',
    component: MembershipPaymentDetailsPage
  },
  {
    path: ':t',
    component: MembershipPaymentDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MembershipPaymentDetailsPage]
})
export class MembershipPaymentDetailsPageModule {}
