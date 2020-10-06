import { Injectable } from '@angular/core';
import {AppConstants} from './app-constants.service';
import {Utils} from './utils.service';
import {ToastUtil} from './toast-util.service';
import {HttpUtil} from './http-util.service';
import {TranslateUtil} from './translate-util.service';
import {ACLUser} from '../models/transfer/RegisterUser';
import {UserInfo} from '../models/UserInfo';
import {GeneralResponse} from '../models/transfer/GeneralResponse';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ACLService {

  constructor(private appConstants:AppConstants, public utils:Utils, private toastUtil:ToastUtil,
              private httpUtil:HttpUtil, public translateUtil:TranslateUtil, private alertCtl:AlertController) {
  }


  s_getAcceptedVersion(clientVersion:string, callback?){

  }

  /**
   * ACL service url for this app version;
   */
  s_getAppVersionServiceURL(clientVersion, callback?){
  }

  s_getJSONFromPress(press:string, callback?){

  }

  /**
   * ACL Register UserInfo;
   */
  s_RegisterUser(registerUser:ACLUser, callback?){

  }

  /**
   * This method should only be used by AppSession.
   */
  s_LoginUser(loginUser:ACLUser, callback?){

  }

  /**
   * This method should only be used by AppSession.
   */
  l_updateLogin(userInfo:UserInfo){

  }

  // l_setSorageUserInfo(userInfo:UserInfo, callback?){
  //   console.log("update session user$ 03.");
  //   this.appSession.user$.next(userInfo);
  //   this.storage.set(this.appConstants.SAVED_USER, userInfo).then(() => {
  //     if(callback){
  //       callback(userInfo);
  //     }
  //     return;
  //   });
  // }

  /**
   * This method should only be used by AppSession.
   * ACL Logout UserInfo;
   * "/logoutUser/:userId"
   */
  s_LogoutUser(callback?){

  }

  /**
   * Check email address in use;
   */
  s_checkEmailExist(email:string, callback?){

  }

  /**
   * Reset password;
   */
  s_resetPassword(email:string, callback?){

  }

  /**
   * Reset password;
   * put "/updatePassword/:userId/:currentPassword/:newPassword"
   */
  s_updatePassword(userId:number, currentPassword:string, newPassword:string, callback?){

  }

  /**
   * ACL Register UserInfo;
   */
  s_confirmEmail(press:string, callback?){

  }

  /**
   * Check ACL for service function;
   */
  s_checkACL(userId:number, nameList:string[], callback?){

  }

}
