import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProviderDetailsPage } from './provider-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderDetailsPage
  },
  {
    path: ':t',
    component: ProviderDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ProviderDetailsPage,],
  entryComponents: [],
})
export class ProviderDetailsPageModule {}
