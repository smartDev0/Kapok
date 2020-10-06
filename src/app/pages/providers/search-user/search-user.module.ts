import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {SearchUserComponent} from "./search-user.component";
import {AdminUserService} from "../../../services/admin/admin-user-service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  providers: [AdminUserService],
  declarations: [SearchUserComponent, ],
  entryComponents: [SearchUserComponent]
})
export class SearchUserComponentModule {}
