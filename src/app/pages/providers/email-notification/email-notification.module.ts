import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {EmailNotificationPage} from "./email-notification.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  providers: [
  ],
  declarations: [EmailNotificationPage],
  entryComponents: [EmailNotificationPage]
})
export class EmailNotificationPageModule {}
