import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AutoBioPage } from './auto-bio.page';

const routes: Routes = [
  {
    path: '',
    component: AutoBioPage
  },
  {
    path: ':t',
    component: AutoBioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AutoBioPage]
})
export class AutoBioPageModule {}
