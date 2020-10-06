import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgCalendarModule } from "ionic2-calendar";

import { IonicModule } from '@ionic/angular';

import { TestPagePage } from './test-page.page';
import {JoditAngularModule} from 'jodit-angular';

const routes: Routes = [
  {
    path: '',
    component: TestPagePage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        JoditAngularModule,
        NgCalendarModule
    ],
  declarations: [TestPagePage]
})
export class TestPagePageModule {}
