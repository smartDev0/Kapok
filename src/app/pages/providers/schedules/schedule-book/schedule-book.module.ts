import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScheduleBookPage } from './schedule-book.page';
import {GuestCheckoutPageModule} from "../../guest-checkout/guest-checkout.module";

const routes: Routes = [
  {
    path: '',
    component: ScheduleBookPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    GuestCheckoutPageModule,
  ],
  declarations: [ScheduleBookPage]
})
export class ScheduleBookPageModule {}
