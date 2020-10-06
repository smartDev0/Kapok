import {AppSession} from "../services/app-session.service";
import {Router} from '@angular/router';
import {AppConstants} from '../services/app-constants.service';

export class BasicUserIdPage {
  appSession:AppSession;

  constructor(appSession:AppSession, public router:Router, public appConstants:AppConstants,){
    this.appSession = appSession;
  }

  public l_checkUserId(toLogin?:boolean, callback?):boolean{
    console.log("l_checkUserId.");
    let userInfo = this.appSession.l_getUserInfo();
    if(callback){
      callback(userInfo);
    }
    if(!userInfo || !userInfo.id){
      if(toLogin){
        this.router.navigate([this.appConstants.ROOT_PAGE]);
      }
      return false;
    }else{
      return true;
    }
  }
}
