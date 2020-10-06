import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MountainEditPage } from './mountain-edit.page';

const routes: Routes = [
  {
    path: '',
    component: MountainEditPage
  },
  {
    path: ':t',
    component: MountainEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MountainEditPage]
})
export class MountainEditPageModule {}
