import { Injectable } from '@angular/core';
import {AppConstants} from "../app-constants.service";
import {TranslateUtil} from "../translate-util.service";
import {Utils} from "../utils.service";
import {HttpUtil} from "../http-util.service";
import {ACLService} from "../aclservice.service";
import {AgeRangeOption} from "../../models/courseOptions/AgeRangeOption";
import {LevelOption} from "../../models/courseOptions/LevelOption";

@Injectable({
  providedIn: 'root'
})
export class LevelOptionService {

  constructor(private appConstants: AppConstants, public translateUtil: TranslateUtil, private utils: Utils,
              private httpUtil: HttpUtil, private aclService:ACLService,) {

  }

  // "/saveLevelOption/:userId"
  saveLevelOption(userId:number, levelOption:LevelOption, callback?){
    if(!userId || !levelOption){
      if(callback){
        callback(null);
      }
    }
    console.log("saveLevelOption.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveLevelOption",  // objName
        serviceUrl + "saveLevelOption/" + userId, //urlStr,
        "post", //method,
        levelOption, //requestObj,
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

  //"/getLevelOptionsForUserId/:providerId/:userId"
  getLevelOptionsForUserId(providerId:number, userId:number, callback?){
    console.log("getLevelOptionsForUserId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getLevelOptionsForUserId/" + providerId + "/" + userId;
      this.httpUtil.s_call(
        "getLevelOptionsForUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        url, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (levelOptions:LevelOption[]) => {
          if(callback){
            callback(levelOptions);
          }
        }
      );
    });
  }

  // "/getLevelOptionsForCourseId/:courseId"
  getLevelOptionsForCourseId(courseId:number, callback?){
    console.log("getLevelOptionsForCourseId.");
    if(!courseId || courseId<=0){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getLevelOptionsForCourseId/" + courseId;
      this.httpUtil.s_call(
        "getLevelOptionsForCourseId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        url, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (levelOptions:LevelOption[]) => {
          if(callback){
            callback(levelOptions);
          }
        }
      );
    });
  }

  //	"/deleteLevelOption/:userId/:levelOptionId"
  deleteLevelOption(userId:number, levelOptionId:number, callback?){
    if(!userId || !levelOptionId){
      if(callback){
        callback(null);
      }
    }
    console.log("deleteLevelOption.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteLevelOption",  // objName
        serviceUrl + "deleteLevelOption/" + userId + "/" + levelOptionId, //urlStr,
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

  //	"/deleteLevelOptionForCourse/:userId/:courseId/:levelOptionId"
  deleteLevelOptionForCourse(userId:number, courseId:number, levelOptionId:number, callback?){
    if(!userId || !courseId || !levelOptionId){
      if(callback){
        callback(null);
      }
    }
    console.log("deleteLevelOptionForCourse.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteLevelOptionForCourse",  // objName
        serviceUrl + "deleteLevelOptionForCourse/" + userId + "/" + courseId + "/" + levelOptionId, //urlStr,
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
