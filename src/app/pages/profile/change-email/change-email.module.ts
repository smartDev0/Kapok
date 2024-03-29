import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChangeEmailPage } from './change-email.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeEmailPage
  },
  {
    path: ':t',
    component: ChangeEmailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChangeEmailPage]
})
export class ChangeEmailPageModule {}
