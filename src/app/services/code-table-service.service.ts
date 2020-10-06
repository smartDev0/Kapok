import { Injectable } from '@angular/core';
import {Language} from '../models/code/Language';
import {CourseType} from '../models/code/CourseType';
import {Role} from '../models/code/Role';
import {Gender} from '../models/code/Gender';
import {CourseStatus} from '../models/code/CourseStatus';
import {LearnType} from '../models/code/LearnType';
import {PriceUnitType} from '../models/code/PriceUnitType';
import {PayOptionType} from '../models/code/PayOptionType';
import {MemberType} from '../models/code/MemberType';
import {WeekDayType} from '../models/code/WeekDayType';
import {AppConstants} from './app-constants.service';
import { Storage } from '@ionic/storage';
import {ACLService} from "./aclservice.service";
import {HttpUtil} from "./http-util.service";
import {AgeGroup} from '../models/code/AgeGroup';
import {RecurrenceType} from "../models/code/RecurrenceType";
import {ScheduleType} from "../models/code/ScheduleType";

@Injectable({
  providedIn: 'root'
})
export class CodeTableService {
  public allCodeJson:string = null;

  // General code table, load initially;
  public ct_Gender:Gender[] = null;
  public ct_Role:Role[] = null;
  public ct_Language:Language[] = null;
  public ct_AgeGroup:AgeGroup[] = null;
  public ct_CourseType:CourseType[] = null; // private, semi private or group;
  public ct_CourseStatus:CourseStatus[] = null;
  public ct_LearnType:LearnType[] = null; // Skiing or Snowboarding;
  public ct_PriceUnitType:PriceUnitType[] = null;
  public ct_PayOptionType:PayOptionType[] = null;
  public ct_MemberTypes:MemberType[] = null;
  public ct_WeekDayType:WeekDayType[] = null;
  public ct_RecurrenceTypes:RecurrenceType[] = null;
  public ct_ScheduleTypes:ScheduleType[] = null;

  constructor(private appConstants:AppConstants, private storage: Storage, private aclService:ACLService,
              private httpUtil:HttpUtil) {

  }

  extractGeneralCodes(result) {
    if(!result){
      return;
    }

    this.allCodeJson = result;
    this.ct_Gender = result.Gender;
    this.ct_Role = result.Role;
    this.ct_Language = result.Language;
    this.ct_CourseType = result.CourseType;
    this.ct_CourseStatus = result.CourseStatus;
    this.ct_AgeGroup = result.AgeGroup;
    this.ct_LearnType = result.LearnType;
    this.ct_PriceUnitType = result.PriceUnitType;
    this.ct_PayOptionType = result.PayOptionType;
    this.ct_MemberTypes = result.MemberType;
    this.ct_WeekDayType = result.WeekDayType;
    this.ct_RecurrenceTypes = result.RecurrenceType;
    this.ct_ScheduleTypes = result.ScheduleType;

    return this.allCodeJson;
  }

  s_loadGeneralCodeTables(callback, reloadServer?:boolean) {
    console.log(">>In s_loadGeneralCodeTables. Called! reloadServer: " + reloadServer);
    let ttl:number = 60*60;
    let key:string = "generalCodeTables";

    if(reloadServer){
      this.l_loadFromServer(key, ttl, callback);
      return;
    }

    //Try get from cache first;
    this.storage.get(key)
        .catch(() => {
          console.log("Can not find catch or expired for key: " + key);
          this.l_loadFromServer(key, ttl, callback);
        })
        .then((results) => {
          if(results){
            this.extractGeneralCodes(results);
            if(callback){
              callback();
            }
          }
        });
  }

  l_loadFromServer(key:string, ttl:number, callback:any){
    console.log("load code from server.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "generalCodeTables";
      this.httpUtil.s_call(
          "get code tables",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (results) => {
            if(results){
              this.storage.set(key, results);
            }
            this.extractGeneralCodes(results);
            if(callback){
              callback();
            }
          }
      );
    });
  }

  checkToReload(types:any[]):boolean{
    if(!types || types.length===0){
      return true;
    }
    for(let type of types){
      if(!type.id || !type.name){
        return true;
      }
    }
    return false;
  }

  getPayOptions(callback) {
    let reload = this.checkToReload(this.ct_PayOptionType);
    this.s_loadGeneralCodeTables(() => {
      if(callback){
        callback(this.ct_PayOptionType);
      }
    }, reload);
  }

  getGenderType(callback) {
    let reload = this.checkToReload(this.ct_Gender);
    this.s_loadGeneralCodeTables(() => {
      if(callback){
        callback(this.ct_Gender);
      }
    }, reload);
  }

  getLanguages(callback){
    let reload = this.checkToReload(this.ct_Language);
    this.s_loadGeneralCodeTables(() => {
      if(callback){
        callback(this.ct_Language);
      }
    }, reload);
  }

  getCourseType(callback){
    let reload = this.checkToReload(this.ct_CourseType);
    this.s_loadGeneralCodeTables(() => {
      if(callback){
        callback(this.ct_CourseType);
      }
    }, reload);
  }

  getCourseTypeWithName(name:string){
    if(!this.ct_CourseType || !name){
      return null;
    }
    for(let courseType of this.ct_CourseType){
      if(courseType.name.toLowerCase().indexOf(name.toLowerCase())>=0){
        return courseType;
      }
    }
  }

  getMemberType(callback){
    let reload = this.checkToReload(this.ct_MemberTypes);
    this.s_loadGeneralCodeTables(() => {
      if(!this.ct_MemberTypes) {
        this.s_loadGeneralCodeTables(() => {
              if (callback) {
                callback(this.ct_MemberTypes);
              }
            },
            true);
      }else{
        if(callback){
          callback(this.ct_MemberTypes);
        }
      }
    }, reload);
  }

  getWeekDayType(callback){
    let reload = this.checkToReload(this.ct_WeekDayType);
    this.s_loadGeneralCodeTables(() => {
      if(!this.ct_WeekDayType) {
        this.s_loadGeneralCodeTables(() => {
              if (callback) {
                callback(this.ct_WeekDayType);
              }
            },
            true);
      }else{
        if(callback){
          callback(this.ct_WeekDayType);
        }
      }
    }, reload);
  }

  getCourseStatus(callback){
    let reload = this.checkToReload(this.ct_CourseStatus);
    this.s_loadGeneralCodeTables(() => {
      if(callback){
        callback(this.ct_CourseStatus);
      }
    }, reload);
  }

  getAgeGroup(callback){
    let reload = this.checkToReload(this.ct_AgeGroup);
    this.s_loadGeneralCodeTables(() => {
      if(callback){
        callback(this.ct_AgeGroup);
      }
    }, reload);
  }

  getLearnType(callback){
    let reload = this.checkToReload(this.ct_LearnType);
    this.s_loadGeneralCodeTables(() => {
      if(!this.ct_LearnType) {
        this.s_loadGeneralCodeTables(() => {
              if (callback) {
                callback(this.ct_LearnType);
              }
            },
            true);
      }else{
        if(callback){
          callback(this.ct_LearnType);
        }
      }
    }, reload);
  }

  getRecurrenceTypes(callback){
    let reload = this.checkToReload(this.ct_RecurrenceTypes);
    this.s_loadGeneralCodeTables(() => {
      if(!this.ct_RecurrenceTypes) {
        this.s_loadGeneralCodeTables(() => {
            if (callback) {
              callback(this.ct_RecurrenceTypes);
            }
          },
          true);
      }else{
        if(callback){
          callback(this.ct_RecurrenceTypes);
        }
      }
    }, reload);
  }

  getScheduleTypes(callback){
    let reload = this.checkToReload(this.ct_ScheduleTypes);
    this.s_loadGeneralCodeTables(() => {
      if(!this.ct_ScheduleTypes) {
        this.s_loadGeneralCodeTables(() => {
            if (callback) {
              callback(this.ct_ScheduleTypes);
            }
          },
          true);
      }else{
        if(callback){
          callback(this.ct_ScheduleTypes);
        }
      }
    }, reload);
  }
}
