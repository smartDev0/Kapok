import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserDetailsPage } from './user-details.page';
import {AdminUserService} from "../../../../services/admin/admin-user-service";

const routes: Routes = [
  {
    path: '',
    component: UserDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserDetailsPage],
  providers: [AdminUserService]
})
export class UserDetailsPageModule {}
