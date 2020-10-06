import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AgeRangeOptionEditPage } from './age-range-option-edit.page';

const routes: Routes = [
  {
    path: '',
    component: AgeRangeOptionEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AgeRangeOptionEditPage]
})
export class AgeRangeOptionEditPageModule {}
