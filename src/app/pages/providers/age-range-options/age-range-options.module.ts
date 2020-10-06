import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AgeRangeOptionsPage } from './age-range-options.page';

const routes: Routes = [
  {
    path: '',
    component: AgeRangeOptionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AgeRangeOptionsPage]
})
export class AgeRangeOptionsPageModule {}
