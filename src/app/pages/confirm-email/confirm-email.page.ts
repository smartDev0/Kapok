import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../services/app-constants.service";
import {ToastUtil} from "../../services/toast-util.service";
import {ACLService} from "../../services/aclservice.service";
import {NavController,} from "@ionic/angular";
import {TranslateUtil} from "../../services/translate-util.service";
import {AppSession} from "../../services/app-session.service";
import {GeneralResponse} from "../../models/transfer/GeneralResponse";

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss'],
})
export class ConfirmEmailPage implements OnInit {
  public confirmed:boolean;
  public errorMessage:string;
  public press:string;

  constructor(public appSession:AppSession, public navCtrl: NavController, public translateUtil:TranslateUtil,
              private aclService:ACLService, public toastUtil:ToastUtil,
              public appConstants:AppConstants, private route: ActivatedRoute, private router: Router,) {
    this.confirmed = false;
    this.errorMessage = null;
  }

  ngOnInit() {
    this.press = this.route.snapshot.paramMap.get('press');
    if(this.press){
      this.aclService.s_confirmEmail(this.press, (response:GeneralResponse) => {
        if(response && response.code===0){
          this.confirmed = true;
        }else{
          this.confirmed = false;
          this.errorMessage = response.message;
        }
        console.log("confirmed: " + this.confirmed);
      });
    }else{
      this.toastUtil.showToast(this.translateUtil.translateKey("EMPTY_VALUE"));
    }
  }

  onGoHome(){
    console.log("Going home page.");
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }
}
