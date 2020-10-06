import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {SessionsCalendarComponent} from "./sessions-calendar.component";
import {NgCalendarModule} from "ionic2-calendar";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgCalendarModule,
  ],
  declarations: [SessionsCalendarComponent],
  entryComponents: [SessionsCalendarComponent]
})
export class SessionsCalendarComponentModule {}
