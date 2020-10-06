import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailableMountainsPage } from './available-mountains.page';
import {AvailableMountainsRoutingModule} from "./available-mountains-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailableMountainsRoutingModule,
  ],
  declarations: [AvailableMountainsPage],
  entryComponents: []
})
export class AvailableMountainsPageModule {}
