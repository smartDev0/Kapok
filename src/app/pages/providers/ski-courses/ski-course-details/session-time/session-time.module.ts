import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessionTimePage } from './session-time.page';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: SessionTimePage
  },
  {
    path: ':t',
    component: SessionTimePage
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  providers: [
  ],
  declarations: [SessionTimePage],
})
export class SessionTimePageModule {}
