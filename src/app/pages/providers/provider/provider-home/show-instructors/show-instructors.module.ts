import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShowInstructorsPage } from './show-instructors.page';

const routes: Routes = [
  {
    path: '',
    component: ShowInstructorsPage
  },
  {
    path: ':t',
    component: ShowInstructorsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ShowInstructorsPage]
})
export class ShowInstructorsPageModule {}
