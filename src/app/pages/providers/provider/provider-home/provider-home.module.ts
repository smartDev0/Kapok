import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProviderHomePage } from './provider-home.page';
import {PopoverDetailPage} from "./Popover";

const routes: Routes = [
  {
    path: '',
    component: ProviderHomePage
  },
  {
    path: ':t',
    component: ProviderHomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProviderHomePage, PopoverDetailPage],
  entryComponents: [PopoverDetailPage]
})
export class ProviderHomePageModule {}
