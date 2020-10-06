import { Injectable } from '@angular/core';
import {AppConstants} from '../app-constants.service';
import {Utils} from '../utils.service';
import {AppSession} from '../app-session.service';
import {HttpUtil} from '../http-util.service';
import {AppConfiguration} from '../../models/admin/AppConfiguration';


@Injectable()
export class AdminConfigureService {

  constructor(private appConstants:AppConstants, private utils:Utils,
              public appSession:AppSession, private httpUtil:HttpUtil) {
    console.log('Hello GroupService Provider');
  }

  s_getAppConfiguration(callback?){
    this.httpUtil.s_call(
      "getAppConfiguration",  // objName
      this.appConstants.BASE_URL + "adminService/getAppConfiguration", //urlStr,
      "get", //method,
      null, //requestObj,
      null, //keyStr,
      null, //groupKeyStr,
      null, //ttl,
      (appConfigure:AppConfiguration) => {
        if(callback){
          callback(appConfigure);
        }
      }
    );
  }

  s_saveAppConfigure(appConfigure:AppConfiguration, callback?){
    this.httpUtil.s_call(
      "saveAppConfigure",  // objName
      this.appConstants.BASE_URL + "adminService/saveAppConfigure", //urlStr,
      "post", //method,
      appConfigure, //requestObj,
      null, //keyStr,
      null, //groupKeyStr,
      null, //ttl,
      (result:boolean) => {
        if(callback){
          callback(result);
        }
      }
    );
  }
}
