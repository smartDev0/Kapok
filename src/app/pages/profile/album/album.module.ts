import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlbumPage } from './album.page';

const routes: Routes = [
  {
    path: '',
    component: AlbumPage
  },
  {
    path: ':t',
    component: AlbumPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AlbumPage]
})
export class AlbumPageModule {}
