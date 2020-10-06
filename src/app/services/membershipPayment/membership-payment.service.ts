import { Injectable } from '@angular/core';
import {AppConstants} from "../app-constants.service";
import {ACLService} from "../aclservice.service";
import {HttpUtil} from "../http-util.service";
import {MembershipInvoice} from "../../models/payment/membershipPayment/membership-invoice";
import {ProviderMemberWithDetails} from "../../models/ProviderMemberWithDetails";
import {GeneralResponse} from "../../models/transfer/GeneralResponse";
import {PaymentAction} from "../../models/payment/PaymentAction";

@Injectable({
  providedIn: 'root'
})
export class MembershipPaymentService {

  constructor(private appConstants:AppConstants, private aclService:ACLService,
              private httpUtil:HttpUtil) {
  }

  s_getMembershipInvoiceById(userId:number, invoiceId, callback?){
    if(!userId || !invoiceId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getMembershipInvoiceById.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getMembershipInvoiceById",  // objName
        serviceUrl + "getMembershipInvoiceById/" + userId + "/" + invoiceId, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (invoice:MembershipInvoice) => {
          if(callback){
            callback(invoice);
          }
        }
      );
    });
  }

  s_saveMembership(userId:number, providerMember:ProviderMemberWithDetails, callback?){
    if(!userId || !providerMember){
      return;
    }
    console.log("saveMembership.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveMembership",  // objName
        serviceUrl + "saveMembership/" + userId, //urlStr,
        "put", //method,
        providerMember, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (genResponse:GeneralResponse) => {
          if(callback){
            callback(genResponse);
          }
        }
      );
    });
  }

  // "/createMembershipPayment/:userId"
  s_createUpdateMembership(userId:number, providerMember:ProviderMemberWithDetails, callback?){
    if(!userId || !providerMember){
      return;
    }
    console.log("createUpdateMembership.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "createUpdateMembership",  // objName
        serviceUrl + "createUpdateMembership/" + userId, //urlStr,
        "put", //method,
        providerMember, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (genResponse:GeneralResponse) => {
          if(!genResponse){
            if(callback){
              callback(null);
            }
          }
          if(callback){
            callback(genResponse);
          }
        }
      );
    });
  }


  // "/membershipCheckOut/:userId"
  s_membershipCheckOut(userId:number, paymentAction:PaymentAction, callback?){
    if(!paymentAction){
      return;
    }
    console.log("membershipCheckOut.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "membershipCheckOut",  // objName
        serviceUrl + "membershipCheckOut/" + userId, //urlStr,
        "put", //method,
        paymentAction, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (result:boolean) => {
          if(callback){
            callback(result);
          }
        }
      );
    });
  }

  s_testCheckOut(paymentAction:PaymentAction, callback?){
    if(!paymentAction){
      return;
    }
    console.log("testCheckOut.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "testCheckOut",  // objName
        serviceUrl + "testCheckOut", //urlStr,
        "put", //method,
        paymentAction, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (result:boolean) => {
          if(callback){
            callback(result);
          }
        }
      );
    });
  }
}
