import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CommentsRecentPage } from './comments-recent.page';

const routes: Routes = [
  {
    path: '',
    component: CommentsRecentPage
  },
  {
    path: ':t',
    component: CommentsRecentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CommentsRecentPage]
})
export class CommentsRecentPageModule {}
