import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MembershipTypeEditPage } from './membership-type-edit.page';

const routes: Routes = [
  {
    path: '',
    component: MembershipTypeEditPage
  },
  {
    path: ':t',
    component: MembershipTypeEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MembershipTypeEditPage]
})
export class MembershipTypeEditPageModule {}
