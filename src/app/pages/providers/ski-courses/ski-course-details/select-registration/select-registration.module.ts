import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SelectRegistrationPage } from './select-registration.page';

const routes: Routes = [
  {
    path: '',
    component: SelectRegistrationPage
  },
  {
    path: ':t',
    component: SelectRegistrationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelectRegistrationPage]
})
export class SelectRegistrationPageModule {}
