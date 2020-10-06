import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaymentReportPage } from './payment-report.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentReportPage
  },
  {
    path: ':t',
    component: PaymentReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentReportPage]
})
export class PaymentReportPageModule {}
