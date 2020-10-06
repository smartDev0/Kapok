import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdministratorDetailsPage } from './administrator-details.page';

const routes: Routes = [
  {
    path: '',
    component: AdministratorDetailsPage
  },
  {
    path: ':t',
    component: AdministratorDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [AdministratorDetailsPage, ],
  entryComponents: []
})
export class AdministratorDetailsPageModule {}
