import { Component } from '@angular/core';
import {NavParams, PopoverController} from "@ionic/angular";
import {AppSession} from "../../../../services/app-session.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
@Component({
  templateUrl: 'Popover.html'
})

export class PopoverDetailPage {
  public userId:number = null;
  public providerId:number = null;
  public callback:any;

  constructor(public popCtrl:PopoverController, public navParams: NavParams, public appSession:AppSession, public translateUtil:TranslateUtil,) {
    this.userId = this.navParams.get('userId');
    this.providerId = this.navParams.get('providerId');
    this.callback = this.navParams.get('callback');
    console.log("PopoverDetailPage, userId: " + this.userId + ", providerId: " + this.providerId);
  }

  close(selection:string) {
    console.log("close called, selection: " + selection);
    if(this.callback){
      this.callback(selection);
    }
    this.popCtrl.dismiss(selection);
  }
}
