import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdministratorEditPage } from './administrator-edit.page';
import {SearchUserComponentModule} from "../../search-user/search-user.module";

const routes: Routes = [
  {
    path: '',
    component: AdministratorEditPage
  },
  {
    path: ':t',
    component: AdministratorEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SearchUserComponentModule
  ],
  declarations: [AdministratorEditPage, ],
  entryComponents: []
})
export class AdministratorEditPageModule {}
