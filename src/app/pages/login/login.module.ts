import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import {TermsModalModule} from '../terms/termsModal.module';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: ':t',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TermsModalModule,
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
