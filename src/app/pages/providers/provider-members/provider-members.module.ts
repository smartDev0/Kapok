import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProviderMembersPage } from './provider-members.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderMembersPage
  },
  {
    path: ':t',
    component: ProviderMembersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProviderMembersPage]
})
export class ProviderMembersPageModule {}
