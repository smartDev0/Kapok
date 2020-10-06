import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SchoolAvailabilitiesPage } from './school-availabilities.page';

const routes: Routes = [
  {
    path: '',
    component: SchoolAvailabilitiesPage
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SchoolAvailabilitiesPage]
})
export class SchoolAvailabilitiesPageModule {}
