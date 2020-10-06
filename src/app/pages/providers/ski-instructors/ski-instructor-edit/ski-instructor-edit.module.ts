import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SkiInstructorEditPage } from './ski-instructor-edit.page';
import {SearchUserComponentModule} from "../../search-user/search-user.module";
import {JoditAngularModule} from 'jodit-angular';

const routes: Routes = [
  {
    path: '',
    component: SkiInstructorEditPage
  },
  {
    path: ':t',
    component: SkiInstructorEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SearchUserComponentModule,
    JoditAngularModule
  ],
  declarations: [SkiInstructorEditPage]
})
export class SkiInstructorEditPageModule {}
