import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoursePriceFormulasPage } from './course-price-formulas.page';

const routes: Routes = [
  {
    path: '',
    component: CoursePriceFormulasPage
  },
  {
    path: ':providerId',
    component: CoursePriceFormulasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CoursePriceFormulasPage]
})
export class CoursePriceFormulasPageModule {}
