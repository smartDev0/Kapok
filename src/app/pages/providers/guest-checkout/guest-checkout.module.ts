import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {GuestCheckoutPage} from "./guest-checkout.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  providers: [
  ],
  declarations: [GuestCheckoutPage, ],
  entryComponents: [GuestCheckoutPage]
})
export class GuestCheckoutPageModule {}
