import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PrePaymentsPage } from './pre-payments.page';

const routes: Routes = [
  {
    path: '',
    component: PrePaymentsPage
  },
  {
    path: ':t',
    component: PrePaymentsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PrePaymentsPage]
})
export class PrePaymentsPageModule {}
