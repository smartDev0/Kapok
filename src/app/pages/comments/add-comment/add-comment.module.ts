import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddCommentPage } from './add-comment.page';

const routes: Routes = [
  {
    path: '',
    component: AddCommentPage
  },
  {
    path: ':press',
    component: AddCommentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddCommentPage]
})
export class AddCommentPageModule {}
