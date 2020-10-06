import { Injectable } from '@angular/core';
import {AppConstants} from "./app-constants.service";
import {ACLService} from "./aclservice.service";
import {HttpUtil} from "./http-util.service";
import {PaymentAccount} from "../models/payment/PaymentAccount";
import {GeneralResponse} from "../models/transfer/GeneralResponse";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private appConstants:AppConstants, private aclService:ACLService,
              private httpUtil:HttpUtil) {
  }

  s_savePaymentAccount(userId:number, providerId:number, paymentAccount:PaymentAccount, callback?){
    if(!userId || !providerId || !paymentAccount){
      return;
    }
    console.log("savePaymentAccount.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "savePaymentAccount",  // objName
        serviceUrl + "savePaymentAccount/" + userId + "/" + providerId, //urlStr,
        "post", //method,
        paymentAccount, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (resultAccount:PaymentAccount) => {
          if(callback){
            callback(resultAccount);
          }
        }
      );
    });
  }

  s_getPaymentAccountForProviderId(userId:number, providerId:number, callback?){
    if(!userId || !providerId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getPaymentAccountForProviderId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getPaymentAccountForProviderId",  // objName
        serviceUrl + "getPaymentAccountForProviderId/" + userId + "/" + providerId, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (paymentAccount:PaymentAccount) => {
          if(callback){
            callback(paymentAccount);
          }
        }
      );
    });
  }

  s_generateClientTokent(userId:number, providerId:number, callback?) {
    console.log("registerSkiCourse.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "registerSkiCourse",  // objName
        serviceUrl + "generateClientTokent/" + userId + "/" + providerId, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (response:GeneralResponse) => {
          if(callback){
            callback(response);
          }
        }
      );
    });
  }
}
