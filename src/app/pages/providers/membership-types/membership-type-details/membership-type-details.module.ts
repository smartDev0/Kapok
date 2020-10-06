import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MembershipTypeDetailsPage } from './membership-type-details.page';

const routes: Routes = [
  {
    path: '',
    component: MembershipTypeDetailsPage
  },
  {
    path: ':t',
    component: MembershipTypeDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MembershipTypeDetailsPage]
})
export class MembershipTypeDetailsPageModule {}
