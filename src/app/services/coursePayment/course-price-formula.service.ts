import { Injectable } from '@angular/core';
import {CoursePriceFormula} from "../../models/payment/coursePayment/CoursePriceFormula";
import {AppConstants} from "../app-constants.service";
import {TranslateUtil} from "../translate-util.service";
import {Utils} from "../utils.service";
import {HttpUtil} from "../http-util.service";
import {ACLService} from "../aclservice.service";

@Injectable({
  providedIn: 'root'
})
export class CoursePriceFormulaService {

  constructor(private appConstants: AppConstants, public translateUtil: TranslateUtil, private utils: Utils,
              private httpUtil: HttpUtil, private aclService:ACLService,) {

  }

  // "/saveCoursePriceFormula/:userId";
  saveCoursePriceFormula(userId:number, formula:CoursePriceFormula, callback?){
    if(!userId || !formula){
      if(callback){
        callback(null);
      }
    }
    console.log("saveCoursePriceFormula.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveCoursePriceFormula",  // objName
        serviceUrl + "saveCoursePriceFormula/" + userId, //urlStr,
        "post", //method,
        formula, //requestObj,
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

  getCoursePriceFormulasForUserId(providerId:number, userId:number, callback?){
    console.log("getCoursePriceFormulasForUserId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getCoursePriceFormulasForUserId/" + providerId + "/" + userId;
      this.httpUtil.s_call(
        "getCoursePriceFormulasForUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        url, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (coursePriceFormulas:CoursePriceFormula[]) => {
          if(callback){
            callback(coursePriceFormulas);
          }
        }
      );
    });
  }

  //	"deleteCoursePriceFormula/" + userId + "/" + coursePriceFormulaId
  deleteCoursePriceFormula(userId:number, coursePriceFormulaId:number, callback?){
    if(!userId || !coursePriceFormulaId){
      if(callback){
        callback(null);
      }
    }
    console.log("deleteCoursePriceFormula.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteCoursePriceFormula",  // objName
        serviceUrl + "deleteCoursePriceFormula/" + userId + "/" + coursePriceFormulaId, //urlStr,
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

  //	 "/deleteCoursePriceFormulaForCourse/:userId/:courseId/:coursePriceFormulaId";
  deleteCoursePriceFormulaForCourse(userId:number, courseId:number, coursePriceFormulaId:number, callback?){
    if(!userId || !courseId || !coursePriceFormulaId){
      if(callback){
        callback(null);
      }
    }
    console.log("deleteCoursePriceFormulaForCourse.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteCoursePriceFormulaForCourse",  // objName
        serviceUrl + "deleteCoursePriceFormulaForCourse/" + userId + "/" + courseId + "/" + coursePriceFormulaId, //urlStr,
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
