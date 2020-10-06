import { Injectable } from '@angular/core';
import {TranslateUtil} from '../translate-util.service';
import {PriceUnit} from '../../models/payment/coursePayment/PriceUnit';
import {HttpUtil} from '../http-util.service';
import {AppConstants} from '../app-constants.service';
import {ACLService} from '../aclservice.service';
import {Utils} from '../utils.service';

@Injectable({
  providedIn: 'root'
})
export class PriceUnitService {

  constructor(private appConstants: AppConstants, public translateUtil: TranslateUtil, private utils: Utils,
              private httpUtil: HttpUtil, private aclService:ACLService,) {

  }

  s_savePriceUnit(userId:number, priceUnit:PriceUnit, callback?){
    if(!userId || !priceUnit){
      if(callback){
        callback(null);
      }
    }
    console.log("savePriceUnit.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "savePriceUnit",  // objName
          serviceUrl + "savePriceUnit/" + userId, //urlStr,
          "post", //method,
          priceUnit, //requestObj,
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

  s_deletePriceUnit(userId:number, priceUnitId:number, callback?){
    if(!userId || !priceUnitId){
      if(callback){
        callback(null);
      }
    }
    console.log("deletePriceUnit.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "deletePriceUnit",  // objName
          serviceUrl + "deletePriceUnit/" + userId + "/" + priceUnitId, //urlStr,
          "delete", //method,
          null, //requestObj,
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

  s_getPriceUnitsByProviderId(userId:number, providerId:number, callback?){
    console.log("getPriceUnitsByProviderId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getPriceUnitsByProviderId/" + userId + "/" + providerId;
      this.httpUtil.s_call(
          "getPriceUnitsByProviderId",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          url, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (priceUnits:PriceUnit[]) => {
            if(callback){
              callback(priceUnits);
            }
          }
      );
    });
  }

  s_getPriceUnitDetailsById(userId:number, priceUnitId:number, callback?){
    if(!priceUnitId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getPriceUnitDetailsById.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getPriceUnitDetailsById/" + userId + "/" + priceUnitId;
      this.httpUtil.s_call(
          "getPriceUnitDetailsById",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          url, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (priceUnit:PriceUnit) => {
            if(callback){
              callback(priceUnit);
            }
          }
      );
    });
  }
}
