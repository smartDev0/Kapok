import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AppConfigurationPage } from './app-configuration.page';
import {AdminConfigureService} from '../../../services/admin/admin-configure-service';

const routes: Routes = [
  {
    path: '',
    component: AppConfigurationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppConfigurationPage],
  providers: [
    AdminConfigureService,
  ]
})
export class AppConfigurationPageModule {}
