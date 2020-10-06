import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConsentViewPage } from './consent-view.page';

const routes: Routes = [
  {
    path: '',
    component: ConsentViewPage
  },
  {
    path: ':providerId',
    component: ConsentViewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConsentViewPage]
})
export class ConsentViewPageModule {}
