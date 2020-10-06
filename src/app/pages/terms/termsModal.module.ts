import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {TermsModalPage} from './termsModal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  providers: [
  ],
  declarations: [TermsModalPage],
  entryComponents: [TermsModalPage]
})
export class TermsModalModule {}
