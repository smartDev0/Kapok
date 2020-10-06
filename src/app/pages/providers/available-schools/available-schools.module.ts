import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AvailableSchoolsPage } from './available-schools.page';

const routes: Routes = [
  {
    path: '',
    component: AvailableSchoolsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AvailableSchoolsPage]
})
export class AvailableSchoolsPageModule {}
