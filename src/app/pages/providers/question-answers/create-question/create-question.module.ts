import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {CreateQuestionComponent} from "./create-question.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [CreateQuestionComponent],
  entryComponents: [CreateQuestionComponent]
})
export class CreateQuestionComponentModule {}
