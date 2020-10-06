import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  // { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [HomePage]
})
export class HomePageModule {}
