import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AvailableMountainsPage} from "./available-mountains.page";

const routes: Routes = [
  {
    path: '',
    component: AvailableMountainsPage,
  },

  {
    path: 'availabilities/:providerId/:mountainId',
    loadChildren: './school-availabilities/school-availabilities.module#SchoolAvailabilitiesPageModule'
  },
  {
    path: 'availabilities/:providerId/:mountainId/:tripHillId',
    loadChildren: './school-availabilities/school-availabilities.module#SchoolAvailabilitiesPageModule'
  },

  // {
  //   path: '',
  //   redirectTo: '/available-mountains/school-availabilities',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvailableMountainsRoutingModule {}
