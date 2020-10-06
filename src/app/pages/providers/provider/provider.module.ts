import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProviderPage } from './provider.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderPage
  },
  {
    path: ':t',
    component: ProviderPage
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProviderPage]
})
export class ProviderPageModule {}
