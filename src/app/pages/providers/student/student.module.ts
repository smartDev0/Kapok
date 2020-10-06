import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {StudentPage} from "./student.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  providers: [
  ],
  declarations: [StudentPage, ],
  entryComponents: [StudentPage]
})
export class StudentPageModule {}
