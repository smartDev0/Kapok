import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SkiInstructorsPage } from './ski-instructors.page';

const routes: Routes = [
  {
    path: '',
    component: SkiInstructorsPage
  },
  {
    path: ':t',
    component: SkiInstructorsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SkiInstructorsPage]
})
export class SkiInstructorsPageModule {}
