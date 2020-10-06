import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyLevelsPage } from './my-levels.page';

const routes: Routes = [
  {
    path: '',
    component: MyLevelsPage
  },
  {
    path: ':t',
    component: MyLevelsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyLevelsPage]
})
export class MyLevelsPageModule {}
