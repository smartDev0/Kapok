import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProviderMemberEditPage } from './provider-member-edit.page';
import {SearchUserComponentModule} from "../../search-user/search-user.module";

const routes: Routes = [
  {
    path: '',
    component: ProviderMemberEditPage
  },
  {
    path: ':t',
    component: ProviderMemberEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SearchUserComponentModule,
  ],
  declarations: [ProviderMemberEditPage,],
  entryComponents: []
})
export class ProviderMemberEditPageModule {}
