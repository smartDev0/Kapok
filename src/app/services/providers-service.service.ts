import { Injectable } from '@angular/core';
import {Provider} from "../models/Provider";
import {AppConstants} from "./app-constants.service";
import {TranslateUtil} from "./translate-util.service";
import {ACLService} from "./aclservice.service";
import {HttpUtil} from "./http-util.service";
import {Utils} from "./utils.service";
import {Course} from "../models/Course";
import {ProviderMemberTypeWithDetails} from "../models/MembershipTypeWithDetails";
import {ProviderCourseTypeWithDetails} from "../models/ProviderCourseTypeWithDetails";
import {SessionTime} from "../models/SessionTime";
import {Mountain} from "../models/Mountain";
import {InstructorWithDetails} from "../models/InstructorWithDetails";
import {DateHills} from "../models/transfer/DateHills";
import {GeneralResponse} from "../models/transfer/GeneralResponse";
import {TripHill} from "../models/TripHill";
import {ReportRequest} from "../models/transfer/ReportRequest";
import {ReportResponse} from "../models/transfer/ReportResponse";
import {CancelRegistrationAction} from "../models/payment/CancelRegistrationAction";
import {PreApprovedPayment} from "../models/payment/coursePayment/PreApprovedPayment";
import {CourseRegistration} from "../models/CourseRegistration";
import {CourseRegistrationInvoice} from "../models/payment/coursePayment/CourseRegistrationInvoice";
import {UserInfo} from "../models/UserInfo";
import {AdminUser} from "../models/AdminUser";
import {ProviderMemberWithDetails} from "../models/ProviderMemberWithDetails";
import {SearchUserRequest} from "../models/transfer/SearchUserRequest";
import {GeneralPaginationResponse} from "../models/transfer/GeneralPaginationResponse";
import {GeneralPaginationRequest} from "../models/transfer/GeneralPaginationRequest";
import {ProviderContext} from "../models/transfer/ProviderContext";
import {Consent} from '../models/Consent';
import {FavoriteInstructor} from '../models/userRelationship/FavoriteInstructor';
import {FavoriteCourse} from '../models/userRelationship/FavoriteCourse';
import {Answer} from "../models/userRelationship/Answer";
import {Question} from "../models/userRelationship/Question";
import {CodeTableService} from './code-table-service.service';
import {CourseType} from '../models/code/CourseType';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

  constructor(private appConstants:AppConstants, public translateUtil:TranslateUtil, private utils:Utils,
              private httpUtil:HttpUtil, private aclService:ACLService, private codeTableService:CodeTableService) {

  }

  deleteSessionTimeInstructor(userId:number, sessionTimeId:number, instructorId:number, callback?:any){
    if(!userId || !sessionTimeId || !instructorId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "deleteSessionTimeInstructor/" + userId + "/" + sessionTimeId + "/" + instructorId;
      this.httpUtil.s_call(
        "deleteSessionTimeInstructor",  // objName
        url, //urlStr,
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

  deleteCourseRegistrationInstructor(userId:number, courseRegistrationId:number, instructorId:number, callback?:any){
    if(!userId || !courseRegistrationId || !instructorId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "deleteCourseRegistrationInstructor/" + userId + "/" + courseRegistrationId + "/" + instructorId;
      this.httpUtil.s_call(
        "deleteCourseRegistrationInstructor",  // objName
        url, //urlStr,
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

  // "/deleteCourseInstructor/:userId/:courseId/:instructorId"
  deleteCourseInstructor(userId:number, courseId:number, instructorId:number, callback?:any){
    if(!userId || !courseId || !instructorId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "deleteCourseInstructor/" + userId + "/" + courseId + "/" + instructorId;
      this.httpUtil.s_call(
        "deleteCourseInstructor",  // objName
        url, //urlStr,
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

  s_getProviderCourseTypeGroup(providerId:number, callback){
    if(!providerId){
      if(callback){
        callback(null);
      }
      return;
    }

    let groupCourseType:CourseType = this.codeTableService.getCourseTypeWithName("group");
    if(!groupCourseType){
      if(callback){
        callback(null);
      }
      return;
    }

    this.s_getProviderCourseTypesByProviderId(providerId, true, (pcTypes:ProviderCourseTypeWithDetails[]) => {
      if(!pcTypes){
        if(callback){
          callback(null);
        }
        return;
      }

      for(let pcType of pcTypes){
        if(pcType.courseTypeCodeId===groupCourseType.id){
          if(callback){
            callback(pcType);
          }
        }
      }
    });
  }

  s_getMembershipTypesForProviderId(providerId:number, activated:boolean, callback?){
    if(!providerId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getMembershipTypesForProviderId/" + providerId + "/" + activated;
      this.httpUtil.s_call(
        "getMembershipTypesForProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (membershipTyps:ProviderMemberTypeWithDetails[]) => {
          if(callback){
            callback(membershipTyps);
          }
        }
      );
    });
  }

  // "/deleteProviderMembershipType/:userId/:providerMembershipTypeId"
  s_deleteProviderMembershipType(userId:number, providerMembershipTypeId:number, callback?){
    console.log("deleteProviderMembershipType.");
    if(!userId || !providerMembershipTypeId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "deleteProviderMembershipType/" + userId + "/" + providerMembershipTypeId;
      this.httpUtil.s_call(
        "deleteProviderMembershipType",  // objName
        url, //urlStr,
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


  // "/getProviderMembershipTypeDetails/:providerMemberTypeId"
  s_getProviderMembershipTypeDetails(providerMemberTypeId:number, callback?){
    if(!providerMemberTypeId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getProviderMembershipTypeDetails/" + providerMemberTypeId;
      this.httpUtil.s_call(
        "getProviderMembershipTypeDetails",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (providerMembershipType:ProviderMemberTypeWithDetails) => {
          if(callback){
            callback(providerMembershipType);
          }
        }
      );
    });
  }

  s_saveProviderCourseTypes(userId:number, providerId:number, providerCourseTypes:ProviderCourseTypeWithDetails[], callback?){
    if(!userId || !providerId || !providerCourseTypes || providerCourseTypes.length===0){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveProviderCourseTypes",  // objName
        serviceUrl + "saveProviderCourseTypes/" + userId + "/" + providerId, //urlStr,
        "put", //method,
        providerCourseTypes, //requestObj,
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

  // "/saveProviderMemberType/:userId"
  s_saveProviderMemberType(userId:number, providerMembershipType:ProviderMemberTypeWithDetails, callback?){
    if(!userId || !providerMembershipType || !providerMembershipType.providerId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveProviderMemberType",  // objName
        serviceUrl + "saveProviderMemberType/" + userId, //urlStr,
        "put", //method,
        providerMembershipType, //requestObj,
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

  // "/deleteProvider/:userId/:providerId"
  s_deleteProvider(userId:number, providerId:number, callback?){
    console.log("deleteProvider.");
    if(!userId || !providerId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "deleteProvider/" + userId + "/" + providerId;
      this.httpUtil.s_call(
        "deleteProvider",  // objName
        url, //urlStr,
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

  // "/removeSessionTime/:userId/:courseId/:sessionTimeId"
  s_removeSessionTime(userId:number, sessionTimeId:number, callback?){
    console.log("removeSessionTime.");
    if(!userId || !sessionTimeId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "removeSessionTime/" + userId + "/" + sessionTimeId;
      this.httpUtil.s_call(
        "removeSessionTime",  // objName
        url, //urlStr,
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

  saveSessionTime(userId:number, sessionTime:SessionTime, callback?) {
    if(!sessionTime || !userId){
      if(callback){
        callback(false);
      }
      return;
    }

    sessionTime.instructor = null;

    console.log("sessionTime.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "sessionTime",  // objName
        serviceUrl + "saveSessionTime/" + userId, //urlStr,
        "put", //method,
        sessionTime, //requestObj,
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

  // "/getSchoolsOnMountain/:mountainId"
  s_getSchoolsOnMountain(mountainId:number, callback?){
    console.log("getSchoolsOnMountain.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getSchoolsOnMountain/" + mountainId;
      this.httpUtil.s_call(
        "getSchoolsOnMountain",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (schools:Provider[]) => {
          if(callback){
            callback(schools);
          }
        }
      );
    });
  }

  // "/getProviderIdForCourseId/:courseId"
  s_getProviderIdForCourseId(courseId:number, callback){
    if(!courseId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getProviderIdForCourseId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getProviderIdForCourseId/" + courseId;
      this.httpUtil.s_call(
        "getProviderIdForCourseId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (providerId:number) => {
          if(callback){
            callback(providerId);
          }
        }
      );
    });
  }


  s_getMountainsWithSchool(all:boolean, callback?){
    console.log("getMountainsWithSchool.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getMountainsWithSchool/" + all;
      this.httpUtil.s_call(
        "getMountainsWithSchool",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (mountains:Mountain[]) => {
          if(mountains){
            for(let mountain of mountains){
              this.utils.replaceIconUrl(mountain);
            }
          }
          if(callback){
            callback(mountains);
          }
        }
      );
    });
  }

  s_getAllMountains(enabledOnly:boolean, callback?){
    console.log("getAllMountains.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAllMountains/" + enabledOnly;
      this.httpUtil.s_call(
        "getAllMountains",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (mountains:Mountain[]) => {
          if(mountains){
            for(let mountain of mountains){
              this.utils.replaceIconUrl(mountain);
            }
          }
          if(callback){
            callback(mountains);
          }
        }
      );
    });
  }

  // "/getMountainById/:userId/:mountainId"
  s_getMountainById(userId:number, mountainId:number, callback?){
    if(!userId){
      userId = -1;
    }
    console.log("getMountainById.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getMountainById/" + userId + "/" + mountainId;
      this.httpUtil.s_call(
        "getMountainById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (mountain:Mountain) => {
          if(mountain){
            this.utils.replaceIconUrl(mountain);
          }

          if(callback){
            callback(mountain);
          }
        }
      );
    });
  }

  // "/deleteMountain/:userId/:mountainId"
  s_deleteMountain(userId:number, mountainId:number, callback?){
    console.log("deleteMountain.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "deleteMountain/" + userId + "/" + mountainId;
      this.httpUtil.s_call(
        "deleteMountain",  // objName
        url, //urlStr,
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

  s_setCourseInstructorId(userId:number, courseId:number, instructorId:number, callback?:any){
    console.log("setCourseInstructorId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "setCourseInstructorId",  // objName
        serviceUrl + "setCourseInstructorId/" + userId + "/" + courseId + "/" + instructorId, //urlStr,
        "put", //method,
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

  s_setSessionTimeInstructorId(userId:number, sessionTimeId:number, instructorId:number, callback?:any){
    console.log("setSessionTimeInstructorId.");
    if(!userId || !sessionTimeId){
      if(callback){
        callback(false);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "setSessionTimeInstructorId",  // objName
        serviceUrl + "setSessionTimeInstructorId/" + userId + "/" + sessionTimeId + "/" + instructorId, //urlStr,
        "put", //method,
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

  deleteSessionTimeExtraInstructor(userId:number, sessionTimeId:number, instructorId:number, callback?:any){
    console.log("deleteSessionTimeExtraInstructor.");
    if(!userId || !sessionTimeId){
      if(callback){
        callback(false);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteSessionTimeExtraInstructor",  // objName
        serviceUrl + "deleteSessionTimeExtraInstructor/" + userId + "/" + sessionTimeId + "/" + instructorId, //urlStr,
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

  s_getCourseRegistrationsCountForCourseIdAndUser(courseId:number, userId:number, callback?){
    if(!courseId || !userId){
      if(callback){
        callback(null);
      }
      return;
    }

    console.log("getCourseRegistrationsCountForCourseIdAndUser.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getCourseRegistrationsCountForCourseIdAndUser/" + courseId + "/" + userId;
      this.httpUtil.s_call(
        "getCourseRegistrationsCountForCourseIdAndUser",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (count:number) => {
          if(callback){
            callback(count);
          }
        }
      );
    });
  }


  // "/getAvailableDates/:providerId/:mountainId"
  s_getAvailableDates(providerId:number, mountainId:number, callback?){
    console.log("getAvailableDates.");
    if(!providerId || !mountainId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAvailableDates/" + providerId + "/" + mountainId;
      this.httpUtil.s_call(
        "getAvailableDates",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (availableDates:DateHills[]) => {
          if(callback){
            callback(availableDates);
          }
        }
      );
    });
  }

  s_getAllInstructorCoursesForUserId(userId:number, callback?){
    console.log("getAllInstructorCoursesForUserId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getAllInstructorCoursesForUserId",  // objName
        serviceUrl + "getAllInstructorCoursesForUserId/" + userId, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (skiCourses:Course[]) => {
          if(callback){
            callback(skiCourses);
          }
        }
      );
    });
  }

  s_saveCommentForSkiRegistration(userId:number, registrationId:number, comment:string, callback?) {
    console.log("saveCommentForSkiRegistration.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveCommentForSkiRegistration",  // objName
        serviceUrl + "saveCommentForSkiRegistration/" + userId + "/" + registrationId + "/" + comment, //urlStr,
        "put", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (newComment:string) => {
          if(callback){
            callback(newComment);
          }
        }
      );
    });
  }

  // "/saveMountain/:userId"
  saveMountain(userId:number, mountain:Mountain, callback?) {
    console.log("saveMountain.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveMountain",  // objName
        serviceUrl + "saveMountain/" + userId, //urlStr,
        "put", //method,
        mountain, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (result:Mountain) => {
          if(callback){
            callback(result);
          }
        }
      );
    });
  }

  // "/saveTripHill/:userId"
  s_saveTripHill(userId:number, tripHill:TripHill, callback?) {
    console.log("saveTripHill.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveTripHill",  // objName
        serviceUrl + "saveTripHill/" + userId, //urlStr,
        "put", //method,
        tripHill, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (result:TripHill) => {
          if(callback){
            callback(result);
          }
        }
      );
    });
  }

  //"/deleteTripHill/:userId/:meetPlaceId"
  s_deleteTripHill(userId:number, meetPlaceId:number, callback?){
    if(!userId || !meetPlaceId){
      if(callback){
        callback(null);
      }
    }
    console.log("deleteTripHill.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteTripHill",  // objName
        serviceUrl + "deleteTripHill/" + userId + "/" + meetPlaceId, //urlStr,
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

  // "/getCourseStudentCount/:courseId"
  s_getCourseStudentCount(courseId:number, callback) {
    console.log("getCourseStudentCount.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getCourseStudentCount",  // objName
        serviceUrl + "getCourseStudentCount/" + courseId, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (space:number) => {
          if(callback){
            callback(space);
          }
        }
      );
    });
  }

  s_saveProvider(userId:number, provider:Provider, callback?) {
    console.log("saveProvider.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveProvider",  // objName
        serviceUrl + "saveProvider/" + userId, //urlStr,
        "put", //method,
        provider, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (resultProvider:Provider) => {
          if(callback){
            callback(resultProvider);
          }
        }
      );
    });
  }

  // ReportRequest
  s_generateProviderRegistrationReport(userId:number, reportRequest:ReportRequest, callback?){
    if(!userId || !reportRequest || !reportRequest.providerId || !reportRequest.startTime || !reportRequest.endTime){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "generateProviderRegistrationReport",  // objName
        serviceUrl + "generateProviderRegistrationReport/" + userId, //urlStr,
        "post", //method,
        reportRequest, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (response:ReportResponse) => {
          if(callback){
            callback(response);
          }
        }
      );
    });
  }

  // Course registrations report;
  s_generateCourseRegistrationReport(userId:number, courseId:number, callback?){
    if(!userId || !courseId || courseId<=0){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "generateCourseRegistrationReport",  // objName
          serviceUrl + "generateCourseRegistrationReport/" + userId + "/" + courseId, //urlStr,
          "post", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (response:ReportResponse) => {
            if(callback){
              callback(response);
            }
          }
      );
    });
  }

  // ReportRequest
  s_generatePaymentReport(userId:number, reportRequest:ReportRequest, callback?){
    if(!userId || !reportRequest || !reportRequest.providerId || !reportRequest.startTime || !reportRequest.endTime){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "generatePaymentReport",  // objName
        serviceUrl + "generatePaymentReport/" + userId, //urlStr,
        "post", //method,
        reportRequest, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (response:ReportResponse) => {
          if(callback){
            callback(response);
          }
        }
      );
    });
  }

  // cancelRegistrationByClient
  s_cancelRegistrationByClient(cancelAction:CancelRegistrationAction, callback?){
    if(!cancelAction || !cancelAction.providerId || !cancelAction.registrationId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "cancelRegistrationByClient",  // objName
        serviceUrl + "cancelRegistrationByClient", //urlStr,
        "post", //method,
        cancelAction, //requestObj,
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

  s_getProviderCourseTypesByProviderId(providerId:number, enabledOnly, callback) {
    console.log("getProviderCourseTypessByProviderId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getProviderCourseTypesByProviderId/" + providerId + "/" + enabledOnly;
      this.httpUtil.s_call(
        "getProviderCourseTypesByProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (pcTypes:ProviderCourseTypeWithDetails[]) => {
          if(callback){
            callback(pcTypes);
          }
        }
      );
    });
  }

  // "/getProvideConsent/:providerId"
  s_getProvideConsent(providerId:number, callback?) {
    console.log("getProvideConsent.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getProvideConsent/" + providerId;
      this.httpUtil.s_call(
          "getProvideConsent",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (consent:Consent) => {
            if(callback){
              callback(consent);
            }
          }
      );
    });
  }

  s_saveProviderConsent(providerId:number, consent:Consent, callback?){
    if(!providerId || !consent || providerId!==consent.providerId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveProviderConsent",  // objName
        serviceUrl + "saveProviderConsent/" + providerId, //urlStr,
        "put", //method,
        consent, //requestObj,
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

  // "/getScheduledProviderCourseTypesByProviderId/:providerId/:mountainId/:enabledOnly"
  s_getScheduledProviderCourseTypesByProviderId(providerId:number, mountainId:number, enabledOnly, callback?) {
    if(!providerId){
      if(callback){
        callback(null);
        return;
      }
    }
    if(!mountainId){
      mountainId = -1;
    }
    console.log("getScheduledProviderCourseTypesByProviderId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getScheduledProviderCourseTypesByProviderId/" + providerId + "/" + mountainId + "/" + enabledOnly;
      this.httpUtil.s_call(
        "getScheduledProviderCourseTypesByProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (pcTypes:ProviderCourseTypeWithDetails[]) => {
          if(callback){
            callback(pcTypes);
          }
        }
      );
    });
  }

  s_getPrePaymentById(userId:number, prePaymentId:number, callback?){
    console.log("getPrePaymentById.");
    if(!userId || !prePaymentId){
      if(callback){
        callback(null);
        return;
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getPrePaymentById/" + userId + "/" + prePaymentId;
      this.httpUtil.s_call(
        "getCoursesDetailsById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (prePayment:PreApprovedPayment) => {
          if(callback){
            callback(prePayment);
          }
        }
      );
    });
  }

  // s_getPrePaymentsByProviderId(this.userId, this.providerId, (prePayments:PreApprovedPayment[])
  s_getPrePaymentsByProviderId(userId:number, providerId:number, callback?) {
    if(!userId || !providerId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getPrePaymentsByProviderId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getPrePaymentsByProviderId/" + userId + "/" + providerId;
      this.httpUtil.s_call(
        "getPrePaymentsByProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (prePayments:PreApprovedPayment) => {
          if(callback){
            callback(prePayments);
          }
        }
      );
    });
  }

  // s_savePrePayment(this.userId, this.prePayment, (prePayment:PreApprovedPayment);
  s_savePrePayment(userId:number, prePayment:PreApprovedPayment, callback?) {
    console.log("savePrePayment.");
    if(!userId || !prePayment){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "savePrePayment",  // objName
        serviceUrl + "savePrePayment/" + userId, //urlStr,
        "put", //method,
        prePayment, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (resultPrePay:PreApprovedPayment) => {
          if(callback){
            callback(resultPrePay);
          }
        }
      );
    });
  }

  s_deletePrePayment(userId:number, prePayId:number, callback?) {
    if(!userId || !prePayId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("deletePrePayment.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deletePrePayment",  // objName
        serviceUrl + "deletePrePayment/" + userId + "/" + prePayId, //urlStr,
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

  s_getCoursesDetailsById(courseId:number, callback?) {
    console.log("getCoursesDetailsById.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getCoursesDetailsById/" + courseId;
      this.httpUtil.s_call(
        "getCoursesDetailsById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (course:Course) => {
          if(callback){
            callback(course);
          }
        }
      );
    });
  }

  s_setCourseRegistrationOfflinePaid(userId:number, registrationId:number, callback?:any){
    if(!userId || !registrationId){
      if(callback){
        callback(null);
      }
      return;
    }

    console.log("setCourseRegistrationOfflinePaid.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "setCourseRegistrationOfflinePaid",  // objName
        serviceUrl + "setCourseRegistrationOfflinePaid/" + userId + "/" + registrationId, //urlStr,
        "put", //method,
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

  // "/checkCourseStudentSpace/:courseId"
  s_checkCourseStudentSpace(courseId:number, callback?) {
    if(!courseId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("checkCourseStudentSpace.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "checkCourseStudentSpace/" + courseId;
      this.httpUtil.s_call(
        "checkCourseStudentSpace",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (roomCount:number) => {
          if(callback){
            callback(roomCount);
          }
        }
      );
    });
  }

  // 1. Validate startTime(mandatory), endTime(mandatory), type of registration (private, semi-private or group):
  //    private, semi-private can assign schedule recurrence, group can not;
  // 2. For private, semi-private registration:
  //      if schedule recurrence assigned to registration, create course first, than add schedule recurrence and registration to the course;
  //      otherwise, save the registration with startTime and endTime only(mandatory);
  // 3. For group registration:
  //      no schedule can be specified. no startTime or end time can be specified. Request for time and instructor can be
  //      put into description or comments; After submition, instructor or admin will try to assign to group course; In case no
  //      group course available for some time, member will be notified that the registration expired.
  // returned: Payment to be paid;
  s_registerSkiRegistration(userId:number, registration:CourseRegistration, callback?) {
    if(!registration){
      if(callback){
        callback(null);
      }
      return;
    }
    if(!userId){
      userId = -1;
    }

    console.log("registerSkiCourse.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "registerSkiCourse",  // objName
        serviceUrl + "registerSkiRegistration/" + userId, //urlStr,
        "put", //method,
        registration, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (regResponse:GeneralResponse) => {
          if(regResponse && regResponse.resultObject){
            let invoice:CourseRegistrationInvoice = regResponse.resultObject;
            regResponse.resultObject = invoice;
          }
          if(callback){
            callback(regResponse);
          }
        }
      );
    });
  }

  // userId can be null for guest user to view and cancel registration;
  s_getCourseRegistrationById(userId:number, registrationId:number, callback?) {
    if(!registrationId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getCourseRegistrationById.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getCourseRegistrationById/" + userId + "/" + registrationId;
      this.httpUtil.s_call(
        "getCourseRegistrationById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (registration:CourseRegistration) => {
          if(callback){
            callback(registration);
          }
        }
      );
    });
  }

  s_getRegistrationsByCourseId(userId:number, courseId:number, callback?) {
    if(!userId || !courseId){
      if(callback){
        callback(null);
      }
      return;
    }

    console.log("getRegistrationsByCourseId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getRegistrationsByCourseId",  // objName
        serviceUrl + "getRegistrationsByCourseId/" + userId + "/" + courseId, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (registrations:CourseRegistration[]) => {
          if(callback){
            callback(registrations);
          }
        }
      );
    });
  }

  s_getTripHillsForProviderId(userId:number, providerId:number, callback?) {
    if(!userId || !providerId){
      if(callback){
        callback(null);
      }
      return;
    }

    console.log("getTripHillsForProviderId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getTripHillsForProviderId/" + userId + "/" + providerId;
      this.httpUtil.s_call(
        "getTripHillsForProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (places:TripHill[]) => {
          if(callback){
            callback(places);
          }
        }
      );
    });
  }

  s_getCourseRegistrationsForCourseId(courseId:number, callback?) {
    if(!courseId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getCourseRegistrationsForCourseId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getCourseRegistrationsForCourseId/" + courseId;
      this.httpUtil.s_call(
        "getCourseRegistrationsForCourseId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (registrations:CourseRegistration[]) => {
          if(callback){
            callback(registrations);
          }
        }
      );
    });
  }

  s_getUserBriefByInstructorId(userId:number, instructorId:number, callback?) {
    if(!userId || !instructorId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getUserBriefByInstructorId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getUserBriefByInstructorId/" + userId + "/" + instructorId;
      this.httpUtil.s_call(
        "getUserBriefByInstructorId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (userBrief:UserInfo) => {
          if(callback){
            callback(userBrief);
          }
        }
      );
    });
  }

  /**
   * Get provider course registrations.
   */
  s_getCourseRegistrationsForProviderId(providerId:number, courseTypeId:number, available:boolean, futureOnly:boolean, callback?) {
    if(!providerId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getCourseRegistrationsForProviderId.");
    if(available==null || available === undefined){
      available = false;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getCourseRegistrationsForProviderId/" + providerId + "/" + courseTypeId + "/" + available + "/" + futureOnly;
      this.httpUtil.s_call(
        "getCourseRegistrationsForProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (regs:CourseRegistration[]) => {
          if(callback){
            callback(regs);
          }
        }
      );
    });
  }

  // "/getAdministratorsByProviderId/:userId/:providerId"
  s_getAdministratorsByProviderId(userId:number, providerId:number, callback?) {
    console.log("getAdministratorsByProviderId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAdministratorsByProviderId/" + userId + "/" + providerId;
      this.httpUtil.s_call(
        "getAdministratorsByProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (adminUsers:AdminUser[]) => {
          if(callback){
            callback(adminUsers);
          }
        }
      );
    });
  }

  // "/getAdministratorDetailsByAdminUserId/:userId/:adminUserId"
  s_getAdministratorDetailsById(userId:number, adminUserId:number, callback?) {
    console.log("getAdministratorDetailsByAdminUserId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAdministratorDetailsByAdminUserId/" + userId + "/" + adminUserId;
      this.httpUtil.s_call(
        "getAdministratorDetailsByAdminUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (adminUser:AdminUser) => {
          if(callback){
            callback(adminUser);
          }
        }
      );
    });
  }

  s_saveSkiCourse(userId:number, skiCourse:Course, callback?) {
    if(!userId){
      userId=-1;
    }
    if(!Course){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("saveSkiCourse.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveSkiCourse",  // objName
        serviceUrl + "saveSkiCourse/" + userId, //urlStr,
        "put", //method,
        skiCourse, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (course:Course) => {
          if(callback){
            callback(course);
          }
        }
      );
    });
  }

  s_deleteSkiCourse(userId:number, courseId:number, callback?) {
    console.log("deleteSkiCourse.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteSkiCourse",  // objName
        serviceUrl + "deleteSkiCourse/" + userId + "/" + courseId, //urlStr,
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

  s_removeRegistrationFromCourse(userId:number, skiRegistrationId:number, callback?) {
    console.log("removeRegistrationFromCourse.");

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "removeRegistrationFromCourse",  // objName
        serviceUrl + "removeRegistrationFromCourse/" + userId + "/" + skiRegistrationId, //urlStr,
        "put", //method,
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

  s_assignRegistrationToCourse(userId:number, courseId:number, skiRegistrationId:number, callback?) {
    console.log("assignRegistrationToCourse.");

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "assignRegistrationToCourse",  // objName
        serviceUrl + "assignRegistrationToCourse/" + userId + "/" + courseId + "/" + skiRegistrationId, //urlStr,
        "put", //method,
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

  s_deleteSkiCoruseRegistration(userId:number, skiRegistrationId:number, deleteRegistration:boolean, callback?) {
    console.log("deleteSkiCoruseRegistration.");

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteSkiCoruseRegistration",  // objName
        serviceUrl + "deleteSkiCoruseRegistration/" + userId + "/" + skiRegistrationId + "/" + deleteRegistration, //urlStr,
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

  s_getSkiInstructorDetailsById(instructorId:number, callback?) {
    console.log("getSkiInstructorDetailsById.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getSkiInstructorDetailsById/" + instructorId;
      this.httpUtil.s_call(
        "getSkiInstructorDetailsById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (instructor:InstructorWithDetails) => {
          if(instructor){
            instructor = this.utils.replaceIconUrl(instructor);
          }
          if(callback){
            callback(instructor);
          }
        }
      );
    });
  }

  // s_checkFavoriteInstructor(this.userId, this.instructorId, (isFavorite:boolean)
  s_checkFavoriteInstructor(userId:number, instructorId:number, callback?) {
    console.log("checkFavoriteInstructor.");
    if(!userId || !instructorId){
      if(callback){
        callback(false);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "checkFavoriteInstructor/" + userId + "/" + instructorId;
      this.httpUtil.s_call(
          "checkFavoriteInstructor",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (isFavorite:boolean) => {
            if(callback){
              callback(isFavorite);
            }
          }
      );
    });
  }

  s_getInstructorsForCourseId(courseId:number, callback?) {
    console.log("getInstructorsForCourseId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getInstructorsForCourseId",  // objName
        serviceUrl + "getInstructorsForCourseId/" + courseId, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (instructors:InstructorWithDetails[]) => {
          if(instructors){
            for(let instructor of instructors){
              instructor = this.utils.replaceIconUrl(instructor);
            }
          }
          if(callback){
            callback(instructors);
          }
        }
      );
    });
  }

  //"/getInstructorsForCourseRegistrationId/:courseRegistrationId"
  getInstructorsForCourseRegistrationId(courseRegistrationId:number, callback?) {
    console.log("getInstructorsForCourseRegistrationId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getInstructorsForCourseRegistrationId",  // objName
        serviceUrl + "getInstructorsForCourseRegistrationId/" + courseRegistrationId, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (instructors:InstructorWithDetails[]) => {
          if(instructors){
            for(let instructor of instructors){
              instructor = this.utils.replaceIconUrl(instructor);
            }
          }
          if(callback){
            callback(instructors);
          }
        }
      );
    });
  }

  s_getTripHillById(tripHillId:number, callback?) {
    if(!tripHillId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getTripHillById.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getTripHillById/" + tripHillId;
      this.httpUtil.s_call(
        "getTripHillById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (tripHill:TripHill) => {
          if(callback){
            callback(tripHill);
          }
        }
      );
    });
  }

  s_sendCourseCommentsUpdatedEmail(userId:number, providerId:number, courseId:number, callback?) {
    if(!userId || !providerId || !courseId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "sendCourseCommentsUpdatedEmail",  // objName
        serviceUrl + "sendCourseCommentsUpdatedEmail/" + userId + "/" + providerId + "/" + courseId, //urlStr,
        "put", //method,
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

  sendEmailNotificationForCourseRegistration(userId:number, instructorId:number, providerId:number, courseRegistrationId:number, notes:string, callback?){
    console.log("saveInstructorDetails.");
    if(!userId || !providerId || !courseRegistrationId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "sendEmailNotificationForCourseRegistration",  // objName
        serviceUrl + "sendEmailNotificationForCourseRegistration/" + userId + "/" + instructorId + "/" + providerId + "/" + courseRegistrationId, //urlStr,
        "put", //method,
        notes, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (instructorVar:InstructorWithDetails) => {
          if(callback){
            callback(instructorVar);
          }
        }
      );
    });
  }

  s_saveSkiInstructorDetails(userId:number, instructor:InstructorWithDetails, callback?) {
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveInstructorDetails",  // objName
        serviceUrl + "saveInstructorDetails/" + userId, //urlStr,
        "put", //method,
        instructor, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (instructorVar:InstructorWithDetails) => {
          if(callback){
            callback(instructorVar);
          }
        }
      );
    });
  }

  s_saveAdminUser(userId:number, adminUser:AdminUser, callback?) {
    console.log("saveAdminUser.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveAdminUser",  // objName
        serviceUrl + "saveAdminUser/" + userId, //urlStr,
        "put", //method,
        adminUser, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (adminUserRes:AdminUser) => {
          if(callback){
            callback(adminUserRes);
          }
        }
      );
    });
  }

  s_getAllProviderInstructorWithDetailsForProvider(providerId:number, enabledOnly:boolean, callback?) {
    console.log("getAllProviderInstructorWithDetailsForProvider.");
    if(!providerId){
      providerId = -1;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAllProviderInstructorWithDetailsForProvider/" + providerId + "/" + enabledOnly;
      this.httpUtil.s_call(
        "getAllProviderInstructorWithDetailsForProvider",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (instructors:InstructorWithDetails[]) => {
          if(instructors){
            for(let instructor of instructors){
              this.utils.replaceIconUrl(instructor);
              instructor.description = this.utils.showLarge(instructor.description);
            }
          }
          if(callback){
            callback(instructors);
          }
        }
      );
    });
  }

  s_getSkiInstructorsForProviderId(providerId:number, mountainId:number, providerCourseTypeId:number, enabledOnly:boolean, callback?) {
    console.log("getSkiInstructorsForProviderId.");
    if(!mountainId){
      mountainId = -1;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getSkiInstructorsForProviderId/" + providerId + "/" + mountainId + "/" + providerCourseTypeId + "/" + enabledOnly;
      this.httpUtil.s_call(
        "getSkiInstructorsForProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (instructors:InstructorWithDetails[]) => {
          if(instructors){
            for(let instructor of instructors){
              this.utils.replaceIconUrl(instructor);
              instructor.description = this.utils.showLarge(instructor.description);
            }
          }
          if(callback){
            callback(instructors);
          }
        }
      );
    });
  }

  s_saveMemberDetails(userId:number, member:ProviderMemberWithDetails, callback?) {
    console.log("saveMemberDetails.");

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveMemberDetails",  // objName
        serviceUrl + "saveMemberDetails/" + userId, //urlStr,
        "put", //method,
        member, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (memberVar:ProviderMemberWithDetails) => {
          if(callback){
            callback(memberVar);
          }
        }
      );
    });
  }

  s_deleteMember(userId:number, memberId:number, callback?) {
    console.log("deleteMember.");

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteMember",  // objName
        serviceUrl + "deleteMember/" + userId + "/" + memberId, //urlStr,
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

  deleteSessionTime(userId:number, sessionTimeId:number, callback?) {
    console.log("deleteSessionTime.");

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteSessionTime",  // objName
        serviceUrl + "deleteSessionTime/" + userId + "/" + sessionTimeId, //urlStr,
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


  s_deleteInstructor(userId:number, instructorId:number, callback?) {
    console.log("deleteInstructor.");

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteInstructor",  // objName
        serviceUrl + "deleteInstructor/" + userId + "/" + instructorId, //urlStr,
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

  s_deleteAdministrator(userId:number, adminId:number, callback?){
    console.log("deleteAdministrator.");

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteAdministrator",  // objName
        serviceUrl + "deleteAdministrator/" + userId + "/" + adminId, //urlStr,
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

  s_getMemberDetailsForProviderIdUserId(providerId:number, userId:number, callback?) {
    console.log("getMemberDetailsForProviderIdUserId.");

    if(!providerId || !userId){
      if(callback){
        callback(null);
      }
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getMemberDetailsForProviderIdUserId",  // objName
        serviceUrl + "getMemberDetailsForProviderIdUserId/" + providerId + "/" + userId, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (member:ProviderMemberWithDetails) => {
          if(callback){
            callback(member);
          }
        }
      );
    });
  }

  s_getMemberDetailsForMemberId(memberId:number, callback?) {
    console.log("getMemberDetailsForMemberId.");

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getMemberDetailsForMemberId",  // objName
        serviceUrl + "getMemberDetailsForMemberId/" + memberId, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (member:ProviderMemberWithDetails) => {
          if(callback){
            callback(member);
          }
        }
      );
    });
  }

  s_getMembersForProviderId(providerId:number, reqObj:SearchUserRequest, callback?) {
    console.log("getMembersForProviderId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getMembersForProviderId/" + providerId;
      this.httpUtil.s_call(
        "getMembersForProviderId",  // objName
        url, //urlStr,
        "put", //method,
        reqObj, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (pageResponse:GeneralPaginationResponse) => {
          if(callback){
            callback(pageResponse);
          }
        }
      );
    });
  }

  s_getCoursesForProviderIdPagination(userId:number, request:GeneralPaginationRequest, callback?) {
    console.log("getCoursesForProviderIdPagination.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getCoursesForProviderIdPagination",  // objName
        serviceUrl + "getCoursesForProviderIdPagination/" + userId, //urlStr,
        "post", //method,
        request, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (response:GeneralPaginationResponse) => {
          if(callback){
            callback(response);
          }
        }
      );
    });
  }

  s_getRegistrationsForUserId(providerId:number, userId:number, futureOnly:boolean, callback?) {
    console.log("getRegistrationsForUserId.");
    if(!userId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getRegistrationsForUserId/" + providerId + "/" + userId + "/" + futureOnly;
      this.httpUtil.s_call(
        "getRegistrationsForUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (regs:CourseRegistration[]) => {
          if(callback){
            callback(regs);
          }
        }
      );
    });
  }

  searchCourseRegistrationsForEmail(providerId:number, email:string, futureOnly:boolean, callback?) {
    console.log("searchCourseRegistrationsForEmail.");
    if(!email || email.trim().length===0 || email.indexOf('@')<=0 || email.indexOf('.')<=0){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "searchCourseRegistrationsForEmail/" + providerId + "/" + email + "/" + futureOnly;
      this.httpUtil.s_call(
        "searchCourseRegistrationsForEmail",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (regs:CourseRegistration[]) => {
          if(callback){
            callback(regs);
          }
        }
      );
    });
  }

  s_getRegistrationsForInstructorId(instructorId:number, futureOnly:boolean, callback?) {
    console.log("getRegistrationsForInstructorId.");
    if(!instructorId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getRegistrationsForInstructorId/" + instructorId + "/" + futureOnly;
      this.httpUtil.s_call(
        "getRegistrationsForInstructorId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (regs:CourseRegistration[]) => {
          if(callback){
            callback(regs);
          }
        }
      );
    });
  }

  // "/getRegistrationsCountForCourseId/:courseId"
  s_getRegistrationsCountForCourseId(courseId:number, callback?) {
    console.log("getRegistrationsCountForCourseId.");
    if(!courseId){
      if(callback){
        callback(0);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getRegistrationsCountForCourseId/" + courseId;
      this.httpUtil.s_call(
        "getRegistrationsCountForCourseId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (count:number) => {
          if(callback){
            callback(count);
          }
        }
      );
    });
  }

  // s_getAvailableCourses
  s_getAvailableCourses(futureOnly:boolean, openOnly:boolean, providerId:number, mountainId:number, instructorId:number, courseTypeId:number, privateOnly:boolean, callback?) {
    console.log("getAvailableCourses.");
    if(!mountainId){
      mountainId = -1;
    }
    if(!instructorId){
      instructorId = -1;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAvailableCoursesForUserId/" + futureOnly + "/" + openOnly + "/" + providerId + "/" + mountainId + "/" + instructorId + "/" + courseTypeId + "/" + privateOnly;
      this.httpUtil.s_call(
        "getAvailableCoursesForUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (courses:Course[]) => {
          if(callback){
            callback(courses);
          }
        }
      );
    });
  }

  s_getCoursesForUserId(providerId:number, userId:number, courseTypeId:number, futureOnly:boolean, callback?) {
    console.log("getCoursesForUserId.");
    if(!providerId || providerId<=0 || !userId || userId<=0){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getCoursesForUserId/" + "/" + providerId + "/" + userId + "/" + courseTypeId + "/" + futureOnly;
      this.httpUtil.s_call(
        "getCoursesForUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (courses:Course[]) => {
          if(callback){
            callback(courses);
          }
        }
      );
    });
  }

  s_getAllCoursesForProviderId(providerId:number, futureOnly:boolean, courseTypeId:number, callback?) {
    console.log("getAllCoursesForProviderId.");
    if(!providerId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAllCoursesForProviderId/" + providerId + "/" + futureOnly + "/" + courseTypeId;
      this.httpUtil.s_call(
        "getAllCoursesForProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (courses:Course[]) => {
          if(callback){
            callback(courses);
          }
        }
      );
    });
  }

  // "/getSessionsForOnDate/:providerId/:instructorId/:onDate"
  s_getSessionsForInstructorOnDate(providerId:number, instructorId:number, onDate:any, callback?) {
    console.log("getSessionsForInstructorId.");
    if(!providerId || !instructorId || !onDate){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getSessionsForOnDate/" + providerId + "/" + instructorId + "/" + onDate;
      this.httpUtil.s_call(
        "getSessionsForOnDate",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (sessionTimes:SessionTime[]) => {
          if(callback){
            callback(sessionTimes);
          }
        }
      );
    });
  }

  getSessionTimeWithDetails(sessionTimeId:number, callback?) {
    console.log("getSessionTimeWithDetails.");
    if(!sessionTimeId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getSessionTimeWithDetails/" + sessionTimeId;
      this.httpUtil.s_call(
        "getSessionTimeWithDetails",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (sessionTime:SessionTime) => {
          if(callback){
            callback(sessionTime);
          }
        }
      );
    });
  }

  getLearningSessionsForUserId(providerId:number, userId:number, futureOnly:boolean, callback?) {
    console.log("getLearningSessionsForUserId.");
    if(!providerId || !userId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getLearningSessionsForUserId/" + providerId + "/" + userId + "/" + futureOnly;
      this.httpUtil.s_call(
        "getLearningSessionsForUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (sessionTimes:SessionTime[]) => {
          if(callback){
            callback(sessionTimes);
          }
        }
      );
    });
  }

  // "/getSessionsForInstructorId/:providerId/:instructorId/:futureOnly"
  s_getSessionsForInstructorId(providerId:number, instructorId:number, futureOnly:boolean, callback?) {
    console.log("getSessionsForInstructorId.");
    if(!providerId || !instructorId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getSessionsForInstructorId/" + providerId + "/" + instructorId + "/" + futureOnly;
      this.httpUtil.s_call(
        "getSessionsForInstructorId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (sessionTimes:SessionTime[]) => {
          if(callback){
            callback(sessionTimes);
          }
        }
      );
    });
  }

  // "/getAllSessionsForProviderId/:providerId/:futureOnly"
  getAllSessionsForProviderId(providerId:number, futureOnly:boolean, callback?) {
    console.log("getAllSessionsForProviderId.");
    if(!providerId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAllSessionsForProviderId/" + providerId + "/" + futureOnly;
      this.httpUtil.s_call(
        "getAllSessionsForProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (sessionTimes:SessionTime[]) => {
          if(callback){
            callback(sessionTimes);
          }
        }
      );
    });
  }

  // "/searchSessionTimesForStudentEmail/:providerId/:email/:futureOnly"
  searchSessionTimesForStudentEmail(providerId:number, email:string, futureOnly:boolean, callback?) {
    console.log("searchSessionTimesForStudentEmail.");
    if(!providerId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "searchSessionTimesForStudentEmail/" + providerId + "/" + email + "/" + futureOnly;
      this.httpUtil.s_call(
        "searchSessionTimesForStudentEmail",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (sessionTimes:SessionTime[]) => {
          if(callback){
            callback(sessionTimes);
          }
        }
      );
    });
  }

  // "/getSkiCourseSimpleWithOptionsById/:courseId"
  getSkiCourseSimpleWithOptionsById(courseId:number, callback?) {
    console.log("getSkiCourseSimpleWithOptionsById.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getSkiCourseSimpleWithOptionsById/" + courseId;
      this.httpUtil.s_call(
        "getSkiCourseSimpleWithOptionsById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (course:Course) => {
          if(callback){
            callback(course);
          }
        }
      );
    });
  }

  s_getCoursesForInstructorId(providerId:number, instructorId:number, createdTypeId:number, futureOnly:boolean, courseTypeId, callback?) {
    console.log("getCoursesForInstructorId.");
    if(!providerId || !instructorId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getCoursesForInstructorId/" + providerId + "/" + instructorId + "/" + createdTypeId + "/" + futureOnly + "/" + courseTypeId;
      this.httpUtil.s_call(
        "getCoursesForInstructorId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (courses:Course[]) => {
          if(callback){
            callback(courses);
          }
        }
      );
    });
  }

  s_getProgramRequests(futureOnly:boolean, providerId:number, mountainId:number, instructorId:number, callback?) {
    console.log("getProgramRequests.");
    if(!providerId){
      if(callback){
        callback(null);
      }
      return;
    }
    if(!mountainId){
      mountainId = -1;
    }
    if(!instructorId){
      instructorId = -1;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getProgramRequests/" + futureOnly + "/" + providerId + "/" + mountainId + "/" + instructorId;
      this.httpUtil.s_call(
        "providerId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (courses:Course[]) => {
          if(callback){
            callback(courses);
          }
        }
      );
    });
  }

  // "/getUserFavoriteCourses/:providerId/:userId"
  s_getUserFavoriteCourses(userId:number, callback?) {
    console.log("getUserFavoriteCourses.");
    if(!userId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getUserFavoriteCourses/" + userId;
      this.httpUtil.s_call(
          "getUserFavoriteCourses",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (courses:FavoriteCourse[]) => {
            if(callback){
              callback(courses);
            }
          }
      );
    });
  }

  // "/getUserFavoriteInstructors/:providerId/:userId"
  s_getUserFavoriteInstructors(userId:number, callback?) {
    console.log("getUserFavoriteInstructors.");
    if(!userId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getUserFavoriteInstructors/" + userId;
      this.httpUtil.s_call(
          "getUserFavoriteInstructors",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (insts:FavoriteInstructor[]) => {
            if(callback){
              callback(insts);
            }
          }
      );
    });
  }

  s_getQuestionsForUserId(providerId:number, userId:number, callback?) {
    console.log("getQuestionsUserId.");
    if(!userId){
      if(callback){
        callback(null);
      }
      return;
    }
    if(!providerId){
      providerId = -1;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getQuestionsUserId/" + providerId + "/" + userId;
      this.httpUtil.s_call(
          "getQuestionsUserId",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (courses:Course[]) => {
            if(callback){
              callback(courses);
            }
          }
      );
    });
  }

  s_getQuestionsForCourseId(providerId:number, courseId:number, callback?) {
    console.log("getQuestionForCourseId.");
    if(!courseId){
      if(callback){
        callback(null);
      }
      return;
    }
    if(!providerId){
      providerId = -1;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getQuestionsForCourseId/" + providerId + "/" + courseId;
      this.httpUtil.s_call(
        "getQuestionsForCourseId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (questions:Question[]) => {
          if(callback){
            callback(questions);
          }
        }
      );
    });
  }

  s_getQuestionsForAssignedUserId(providerId:number, userId:number, callback?) {
    console.log("getQuestionsForAssignedUserId.");
    if(!userId){
      if(callback){
        callback(null);
      }
      return;
    }
    if(!providerId){
      providerId = -1;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getQuestionsForAssignedUserId/" + providerId + "/" + userId;
      this.httpUtil.s_call(
        "getQuestionsForAssignedUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (questions:Question[]) => {
          if(callback){
            callback(questions);
          }
        }
      );
    });
  }

  s_getQuestionById(id:number, callback?) {
    console.log("getQuestionsForAssignedUserId.");
    if(!"/getQuestionById/:id"){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getQuestionById/" + id;
      this.httpUtil.s_call(
        "getQuestionById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (question:Question) => {
          if(question){
            this.utils.replaceIconUrl(question);
          }
          if(callback){
            callback(question);
          }
        }
      );
    });
  }


  s_getAnswersForQuestion(questionId:number, callback?) {
    console.log("getAnswersForQuestion.");
    if(!questionId){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAnswersForQuestion/" + questionId;
      this.httpUtil.s_call(
        "getAnswersForQuestion",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (answers:Answer[]) => {
          if(answers){
            for(let answer of answers){
              this.utils.replaceIconUrl(answer);
            }
          }
          if(callback){
            callback(answers);
          }
        }
      );
    });
  }

  s_getCampCourses(futureOnly:boolean, providerId:number, mountainId:number, callback?) {
    console.log("getCampCourses.");
    if(!providerId){
      if(callback){
        callback(null);
      }
      return;
    }
    if(!mountainId){
      mountainId = -1;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getCampCourses/" + futureOnly + "/" + providerId + "/" + mountainId;
      this.httpUtil.s_call(
          "getCampCourses",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (courses:Course[]) => {
            if(callback){
              callback(courses);
            }
          }
      );
    });
  }

  // "/saveCourseInstructors/:userId/:courseId"
  saveCourseInstructors(userId:number, courseId:number, instructorIds:number[], callback?) {
    console.log("saveQuestion.");
    if(!userId || !courseId || !instructorIds || instructorIds.length===0){
      if(callback){
        callback(false);
      }
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveCourseInstructors",  // objName
        serviceUrl + "saveCourseInstructors/" + userId + "/" + courseId, //urlStr,
        "post", //method,
        instructorIds, //requestObj,
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

  saveSessionTimeExtraInstructorIds(userId:number, sessionTimeId:number, instructorIds:number[], callback?) {
    console.log("saveSessionTimeExtraInstructorIds.");
    if(!userId || !sessionTimeId || !instructorIds || instructorIds.length===0){
      if(callback){
        callback(false);
      }
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveSessionTimeExtraInstructorIds",  // objName
        serviceUrl + "saveSessionTimeExtraInstructorIds/" + userId + "/" + sessionTimeId, //urlStr,
        "post", //method,
        instructorIds, //requestObj,
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

  saveCourseRegistrationInstructors(userId:number, courseRegistrationId:number, instructorIds:number[], callback?) {
    console.log("saveCourseRegistrationInstructors.");
    if(!userId || !courseRegistrationId || !instructorIds || instructorIds.length===0){
      if(callback){
        callback(false);
      }
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveCourseRegistrationInstructors",  // objName
        serviceUrl + "saveCourseRegistrationInstructors/" + userId + "/" + courseRegistrationId, //urlStr,
        "post", //method,
        instructorIds, //requestObj,
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

  s_saveQuestion(providerId:number, userId:number, question:Question, callback?) {
    console.log("saveQuestion.");
    if(!providerId || !userId || !question){
      if(callback){
        callback(false);
      }
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveQuestion",  // objName
        serviceUrl + "saveQuestion/" + providerId + "/" + userId, //urlStr,
        "post", //method,
        question, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (resultQuestion:Question) => {
          if(callback){
            callback(resultQuestion);
          }
        }
      );
    });
  }

  s_saveAnswer(providerId:number, userId:number, answer:Answer, callback?) {
    console.log("saveAnswer.");
    if(!providerId || !userId || !answer){
      if(callback){
        callback(false);
      }
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "saveAnswer",  // objName
          serviceUrl + "saveAnswer/" + providerId + "/" + userId, //urlStr,
          "post", //method,
          answer, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (resultAnswer:Answer) => {
            if(callback){
              callback(resultAnswer);
            }
          }
      );
    });
  }


  // s_getCoursesForInstructorId(instructorId:number, skiEventId:number, callback?) {
  s_getCoursesForInstructorIdPagination(userId:number, request:GeneralPaginationRequest, callback?) {
    console.log("getCoursesForInstructorIdPagination.");

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getCoursesForInstructorIdPagination",  // objName
        serviceUrl + "getCoursesForInstructorIdPagination/" + userId, //urlStr,
        "post", //method,
        request, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (response:GeneralPaginationResponse) => {
          if(callback){
            callback(response);
          }
        }
      );
    });
  }

  // Get all providers; Will do pagination later;
  s_getProviderById(providerId:number, callback?) {
    console.log("s_getProviderById.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getProviderById/" + providerId;
      this.httpUtil.s_call(
        "getProviderById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (provider:Provider) => {
          this.utils.replaceIconUrl(provider);
          if(callback){
            callback(provider);
          }
        }
      );
    });
  }

  // "/getProvidersHasAccountsForUserId/:userId"
  // get providers for user include admin, courseRegistration, tripRegistration, instructor and membership;
  s_getProvidersHasAccountOrCourseRegistrationForUserId(userId:number, callback?){
    console.log("getProvidersHasAccountOrCourseRegistrationForUserId.");
    if(!userId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getProvidersHasAccountOrCourseRegistrationForUserId",  // objName
        serviceUrl + "getProvidersHasAccountOrCourseRegistrationForUserId/" + userId, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (providers:Provider[]) => {
          if(providers && providers.length>0){
            for(let provider of providers){
              provider = this.utils.replaceIconUrl(provider);
            }
          }
          if(callback){
            callback(providers);
          }
        }
      );
    });
  }

  s_getProviderContextForUserId(providerId:number, userId:number, callback?){
    console.log("getProviderContextForUserId.");
    if(!providerId){
      if(callback){
        callback(null);
      }
      return;
    }
    if(!userId){
      let context:ProviderContext = new ProviderContext();
      context.providerId = providerId;
      if(callback){
        callback(context);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getProviderContextForUserId/" + providerId + "/" + userId;
      console.log("url for s_getProviderContextForUserId: " + url);

      this.httpUtil.s_call(
        "getProviderContextForUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (context:ProviderContext) => {
          if(callback){
            callback(context);
          }
        }
      );
    });
  }

  // Get getMyProviders; Will do pagination later;
  s_getMyProviders(ownerId:number, callback?) {
    console.log("s_getMyProviders.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getMyProviders/" + ownerId;
      this.httpUtil.s_call(
        "getMyProviders",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (providers:Provider[]) => {
          if(callback){
            callback(providers);
          }
        }
      );
    });
  }

  // Get all providers; Will do pagination later;
  s_getAllProviders(activated:boolean, callback?) {
    console.log("s_getAllProviders.");

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAllProviders/" + activated;
      this.httpUtil.s_call(
        "getAllProviders",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (providers:Provider[]) => {
          if(providers && providers.length>0){
            for(let provider of providers){
              provider = this.utils.replaceIconUrl(provider);
            }
          }
          if(callback){
            callback(providers);
          }
        }
      );
    });
  }


  s_addFavoriteInstructor(userId:number, instructorId:number, callback?){
    if(!userId || !instructorId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "addFavoriteInstructor",  // objName
        serviceUrl + "addFavoriteInstructor/" + userId, //urlStr,
        "post", //method,
        instructorId, //requestObj,
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

  s_removeFavoriteInstructor(userId:number, instructorId:number, callback?){
    if(!userId || !instructorId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "removeFavoriteInstructor",  // objName
          serviceUrl + "removeFavoriteInstructor/" + userId + "/" + instructorId, //urlStr,
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

  s_addFavoriteCourse(userId:number, courseId:number, callback?){
    if(!userId || !courseId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "addFavoriteCourse",  // objName
          serviceUrl + "addFavoriteCourse/" + userId, //urlStr,
          "post", //method,
          courseId, //requestObj,
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

  s_removeFavoriteCourse(userId:number, courseId:number, callback?){
    if(!userId || !courseId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "removeFavoriteCourse",  // objName
          serviceUrl + "removeFavoriteCourse/" + userId + "/" + courseId, //urlStr,
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

  s_checkFavoriteCourse(userId:number, courseId:number, callback?) {
    console.log("checkFavoriteCourse.");
    if(!userId || !courseId){
      if(callback){
        callback(false);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "checkFavoriteCourse/" + userId + "/" + courseId;
      this.httpUtil.s_call(
          "checkFavoriteCourse",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (isFavorite:boolean) => {
            if(callback){
              callback(isFavorite);
            }
          }
      );
    });
  }
}
