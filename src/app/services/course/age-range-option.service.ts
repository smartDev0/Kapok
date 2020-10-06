import { Injectable } from '@angular/core';
import {AppConstants} from "../app-constants.service";
import {TranslateUtil} from "../translate-util.service";
import {Utils} from "../utils.service";
import {HttpUtil} from "../http-util.service";
import {ACLService} from "../aclservice.service";
import {AgeRangeOption} from "../../models/courseOptions/AgeRangeOption";

@Injectable({
  providedIn: 'root'
})
export class AgeRangeOptionService {

  constructor(private appConstants: AppConstants, public translateUtil: TranslateUtil, private utils: Utils,
              private httpUtil: HttpUtil, private aclService:ACLService,) {

  }

  // "/saveAgeRangeOption/:userId"
  saveAgeRangeOption(userId:number, ageRangeOption:AgeRangeOption, callback?){
    if(!userId || !ageRangeOption){
      if(callback){
        callback(null);
      }
    }
    console.log("saveAgeRangeOption.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveAgeRangeOption",  // objName
        serviceUrl + "saveAgeRangeOption/" + userId, //urlStr,
        "post", //method,
        ageRangeOption, //requestObj,
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

  // "/getAgeRangeOptionsForUserId/:providerId/:userId"
  getAgeRangeOptionsForUserId(providerId:number, userId:number, callback?){
    console.log("getCoursePriceFormulasForUserId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAgeRangeOptionsForUserId/" + providerId + "/" + userId;
      this.httpUtil.s_call(
        "getAgeRangeOptionsForUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        url, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (ageRangeOptions:AgeRangeOption[]) => {
          if(callback){
            callback(ageRangeOptions);
          }
        }
      );
    });
  }

  // "/getAgeRangeOptionsForCourseId/:courseId"
  getAgeRangeOptionsForCourseId(courseId:number, callback?){
    console.log("getAgeRangeOptionsForCourseId.");
    if(!courseId || courseId<=0){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAgeRangeOptionsForCourseId/" + courseId;
      this.httpUtil.s_call(
        "getAgeRangeOptionsForCourseId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        url, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (ageRangeOptions:AgeRangeOption[]) => {
          if(callback){
            callback(ageRangeOptions);
          }
        }
      );
    });
  }

  //	//	"deleteAgeRangeOption/" + userId + "/" + ageRangeOptionId
  deleteAgeRangeOption(userId:number, ageRangeOptionId:number, callback?){
    if(!userId || !ageRangeOptionId){
      if(callback){
        callback(null);
      }
    }
    console.log("deleteAgeRangeOption.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteAgeRangeOption",  // objName
        serviceUrl + "deleteAgeRangeOption/" + userId + "/" + ageRangeOptionId, //urlStr,
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

  //	 "/deleteAgeRangeOptionForCourse/:userId/:courseId/:ageRangeOptionId"
  deleteAgeRangeOptionForCourse(userId:number, courseId:number, ageRangeOptionId:number, callback?){
    if(!userId || !courseId || !ageRangeOptionId){
      if(callback){
        callback(null);
      }
    }
    console.log("deleteAgeRangeOptionForCourse.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteAgeRangeOptionForCourse",  // objName
        serviceUrl + "deleteAgeRangeOptionForCourse/" + userId + "/" + courseId + "/" + ageRangeOptionId, //urlStr,
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
}
