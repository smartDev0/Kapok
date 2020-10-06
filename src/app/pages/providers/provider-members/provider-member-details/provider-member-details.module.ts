import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProviderMemberDetailsPage } from './provider-member-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderMemberDetailsPage
  },
  {
    path: ':t',
    component: ProviderMemberDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProviderMemberDetailsPage]
})
export class ProviderMemberDetailsPageModule {}
