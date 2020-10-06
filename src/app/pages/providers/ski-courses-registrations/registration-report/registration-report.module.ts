import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrationReportPage } from './registration-report.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationReportPage
  },
  {
    path: ':t',
    component: RegistrationReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistrationReportPage]
})
export class RegistrationReportPageModule {}
