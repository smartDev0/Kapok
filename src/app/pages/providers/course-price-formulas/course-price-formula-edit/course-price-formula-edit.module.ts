import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoursePriceFormulaEditPage } from './course-price-formula-edit.page';

const routes: Routes = [
  {
    path: '',
    component: CoursePriceFormulaEditPage
  },
  {
    path: ':t',
    component: CoursePriceFormulaEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CoursePriceFormulaEditPage]
})
export class CoursePriceFormulaEditPageModule {}
