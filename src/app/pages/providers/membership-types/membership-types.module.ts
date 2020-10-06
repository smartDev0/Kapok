import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MembershipTypesPage } from './membership-types.page';

const routes: Routes = [
  {
    path: '',
    component: MembershipTypesPage
  },
  {
    path: ':t',
    component: MembershipTypesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MembershipTypesPage]
})
export class MembershipTypesPageModule {}
