import { Injectable } from '@angular/core';
import {AppConstants} from "./app-constants.service";
import {TranslateUtil} from "./translate-util.service";
import {Utils} from "./utils.service";
import {HttpUtil} from "./http-util.service";
import {ACLService} from "./aclservice.service";
import {CodeTableService} from "./code-table-service.service";
import {Schedule} from "../models/schedule/Schedule";
import {CourseRegistration} from "../models/CourseRegistration";
import {GeneralResponse} from "../models/transfer/GeneralResponse";
import {ChooseRecurrenceRequest} from "../models/transfer/ChooseRecurrenceRequest";
import {RecurrenceInstance} from '../models/schedule/RecurrenceInstance';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private appConstants:AppConstants, public translateUtil:TranslateUtil, private utils:Utils,
              private httpUtil:HttpUtil, private aclService:ACLService, private codeTableService:CodeTableService) {

  }

  /*
   * Get back recurrenceInstances and their schedule for courseId;
   */
  queryCourseSchedule(userId:number, request:ChooseRecurrenceRequest, callback){
    if(!userId || !request){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "queryCourseSchedule",  // objName
        serviceUrl + "queryCourseSchedule/" + userId, //urlStr,
        "post", //method,
        request, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (instances:RecurrenceInstance[]) => {
          if(callback){
            callback(instances);
          }
        }
      );
    });
  }

  /*
   * Get back schedule for instructor's available time onDate. Each schedule will only contains one recurrenceInstance;
   */
  queryInstructorSchedule(userId:number, request:ChooseRecurrenceRequest, callback){
    if(!request){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "queryInstructorSchedule",  // objName
        serviceUrl + "queryInstructorSchedule/" + userId, //urlStr,
        "post", //method,
        request, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (instances:RecurrenceInstance[]) => {
          if(callback){
            callback(instances);
          }
        }
      );
    });
  }

  getScheduleInstances(providerId:number, userId:number, onDate:any, callback){
    if(!providerId || !userId || !onDate){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getScheduleInstances",  // objName
        serviceUrl + "getScheduleInstances/" + providerId + "/" + userId + "/" + onDate, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (instances:RecurrenceInstance) => {
          if(callback){
            callback(instances);
          }
        }
      );
    });
  }

  // "/registerScheduleCourseRegistration/:userId"
  registerScheduleCourseRegistration(userId:number, courseRegistration:CourseRegistration, callback?){
    if(!courseRegistration){
      if(callback){
        callback(false);
      }
      return;
    }
    if(!userId){
      userId = -1;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "registerScheduleCourseRegistration",  // objName
        serviceUrl + "registerScheduleCourseRegistration/" + userId, //urlStr,
        "put", //method,
        courseRegistration, //requestObj,
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

  // "/deleteScheduleLearnType/:scheduleId/:learnTypeId"
  deleteScheduleLearnType(scheduleId:number, learnTypeId:number, callback?){
    if(!scheduleId || !learnTypeId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("deleteScheduleLearnType.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteScheduleLearnType",  // objName
        serviceUrl + "deleteScheduleLearnType/" + scheduleId + "/" + learnTypeId, //urlStr,
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

  // "/deleteScheduleProviderCourseType/:scheduleId/:providerCourseTypeId"
  deleteScheduleProviderCourseType(scheduleId:number, providerCourseTypeId:number, callback?){
    if(!scheduleId || !providerCourseTypeId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("deleteScheduleProviderCourseType.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteScheduleProviderCourseType",  // objName
        serviceUrl + "deleteScheduleProviderCourseType/" + scheduleId + "/" + providerCourseTypeId, //urlStr,
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

  // "/deleteScheduleTripHill/:scheduleId/:tripHillId"
  deleteScheduleTripHill(scheduleId:number, tripHillId:number, callback?){
    if(!scheduleId || !tripHillId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("deleteScheduleTripHill.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteScheduleTripHill",  // objName
        serviceUrl + "deleteScheduleTripHill/" + scheduleId + "/" + tripHillId, //urlStr,
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

  deleteScheduleCourse(scheduleId:number, courseId:number, callback?){
    if(!scheduleId || !courseId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("deleteScheduleCourse.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteScheduleCourse",  // objName
        serviceUrl + "deleteScheduleCourse/" + scheduleId + "/" + courseId, //urlStr,
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

  // "/deleteSchedule/:scheduleId"
  deleteSchedule(scheduleId:number, callback){
    if(!scheduleId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("deleteSchedule.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteSchedule",  // objName
        serviceUrl + "deleteSchedule/" + scheduleId, //urlStr,
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

  // "/deleteRecurrenceInstance/:recurrenceInstanceId"
  deleteRecurrenceInstance(recurrenceInstanceId:number, callback?){
    if(!recurrenceInstanceId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("deleteRecurrenceInstance.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteRecurrenceInstance",  // objName
        serviceUrl + "deleteRecurrenceInstance/" + recurrenceInstanceId, //urlStr,
        "delete", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (resultInst:RecurrenceInstance) => {
          if(callback){
            callback(resultInst);
          }
        }
      );
    });
  }

  // "/deleteRecurrence/:recurrenceId"
  deleteRecurrence(recurrenceId:number, callback?){
    if(!recurrenceId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("deleteRecurrence.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteRecurrence",  // objName
        serviceUrl + "deleteRecurrence/" + recurrenceId, //urlStr,
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

  deleteTimeSlot(timeSlotId:number, callback?){
    if(!timeSlotId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("deleteTimeSlot.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteTimeSlot",  // objName
        serviceUrl + "deleteTimeSlot/" + timeSlotId, //urlStr,
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

  createOrUpdateSchedule(userId:number, schedule:Schedule, callback){
    if(!userId || !schedule){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "createOrUpdateSchedule",  // objName
        serviceUrl + "createOrUpdateSchedule/" + userId, //urlStr,
        "post", //method,
        schedule, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (savedSchedule:Schedule) => {
          if(callback){
            callback(savedSchedule);
          }
        }
      );
    });
  }

  // "/getSchedulesForProviderId/:providerId"
  getSchedulesForProviderId(providerId:number, userId:number, callback) {
    console.log("getSchedulesForProviderId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getSchedulesForProviderId/" + providerId + "/" + userId;
      this.httpUtil.s_call(
        "getSchedulesForProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (schedules:Schedule[]) => {
          if(callback){
            callback(schedules);
          }
        }
      );
    });
  }

  getSchedulesForProviderIdInstructorId(providerId:number, instructorId:number, callback) {
    console.log("getSchedulesForProviderIdInstructorId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getSchedulesForProviderIdInstructorId/" + providerId + "/" + instructorId;
      this.httpUtil.s_call(
        "getSchedulesForProviderIdInstructorId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (schedules:Schedule[]) => {
          if(callback){
            callback(schedules);
          }
        }
      );
    });
  }

  // "/getSchedulesForUserId/:providerId/:userId"
  getSchedulesForUserId(providerId:number, userId:number, callback?) {
    console.log("getSchedulesForUserId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getSchedulesForUserId/" + providerId + "/" + userId;
      this.httpUtil.s_call(
        "getSchedulesForUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (schedules:Schedule[]) => {
          if(callback){
            callback(schedules);
          }
        }
      );
    });
  }

  // "/getScheduleWithDetailsById/:scheduleId"
  getScheduleWithDetailsById(scheduleId:number, callback?) {
    console.log("getScheduleWithDetailsById.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getScheduleWithDetailsById/" + scheduleId;
      this.httpUtil.s_call(
        "getScheduleWithDetailsById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (schedule:Schedule) => {
          if(callback){
            callback(schedule);
          }
        }
      );
    });
  }

  // "/saveRecurrenceInstance/:userId"
  saveRecurrenceInstance(userId:number, instance:RecurrenceInstance, callback){
    if(!userId || !instance){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveRecurrenceInstance",  // objName
        serviceUrl + "saveRecurrenceInstance/" + userId, //urlStr,
        "post", //method,
        instance, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (result:RecurrenceInstance) => {
          if(callback){
            callback(result);
          }
        }
      );
    });
  }
}
