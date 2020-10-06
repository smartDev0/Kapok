import { Injectable } from '@angular/core';
import {AppConstants} from './app-constants.service';
import {TranslateUtil} from './translate-util.service';
import {Utils} from './utils.service';
import {HttpUtil} from './http-util.service';
import {ACLService} from './aclservice.service';
import {Trip} from '../models/trip/Trip';
import {TripRegistration} from '../models/trip/TripRegistration';
import {Rental} from '../models/trip/Rental';
import {ReportResponse} from '../models/transfer/ReportResponse';
import {Course} from '../models/Course';
import {GeneralResponse} from '../models/transfer/GeneralResponse';

@Injectable({
  providedIn: 'root'
})
export class TripServiceService {

  constructor(private appConstants:AppConstants, public translateUtil:TranslateUtil, private utils:Utils,
              private httpUtil:HttpUtil, private aclService:ACLService,) {

  }

  // "/getTripHillDayCourses/:providerId/:targetDate/:tripHillId/:groupClassOnly"
  s_getTripHillDayCourses(providerId:number, targetDate:any, tripHillId:number, providerCourseTypeId:number, callback?) {
    console.log("getTripHillDayCourses.");
    if(!providerId || !targetDate || !tripHillId){
      if(callback){
        callback(null);
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getTripHillDayCourses/" + providerId + "/" + targetDate + "/" + tripHillId + "/" + providerCourseTypeId;
      this.httpUtil.s_call(
          "getTripHillDayCourses",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (coruses:Course[]) => {
            if(callback){
              callback(coruses);
            }
          }
      );
    });
  }

  // "/generateTripRegistrationReport/:userId/:tripId"
  s_generateTripRegistrationsReport(userId:number, tripId:number, callback?){
    if(!userId || !tripId || tripId<=0){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "generateTripRegistrationReport",  // objName
          serviceUrl + "generateTripRegistrationReport/" + userId + "/" + tripId, //urlStr,
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

  // "/deleteRental/:rentalId"
  s_deleteRental(rentalId:number, callback?:any){
    if(!rentalId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "deleteRental/" + rentalId;
      this.httpUtil.s_call(
          "deleteRental",  // objName
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

  //  "/saveRental"
  s_saveRental(rental:Rental, callback?){
    if(!rental){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveRental",  // objName
        serviceUrl + "saveRental/", //urlStr,
        "put", //method,
        rental, //requestObj,
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

  // "/logicalDeleteTrip/:userId/:tripId"
  s_logicalDeleteTrip(userId:number, tripId:number, callback?){
    if(!userId || !tripId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "logicalDeleteTrip",  // objName
        serviceUrl + "logicalDeleteTrip/" + userId + "/" + tripId, //urlStr,
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

  s_cancelTripRegistration(userId:number, tripRegistrationId:number, callback?){
    if(!tripRegistrationId){
      if(callback){
          callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "cancelTripRegistration",  // objName
        serviceUrl + "cancelTripRegistration/" + userId + "/" + tripRegistrationId, //urlStr,
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

  // "getRentalsForTripRegistrationId/" + tripRegistrationId
  s_getRentalsForTripRegistrationId(tripRegistrationId:number, callback?) {
    console.log("getRentalsForTripRegistrationId.");
    if(!tripRegistrationId){
      if(callback){
        callback(null);
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getRentalsForTripRegistrationId/" + tripRegistrationId;
      this.httpUtil.s_call(
          "getRentalsForTripRegistrationId",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (rentals:Rental[]) => {
            if(callback){
              callback(rentals);
            }
          }
      );
    });
  }

  // "/deleteTripRegistrationCourses/:tripRegistrationId"
  s_deleteTripRegistrationCourses(tripRegistrationId:number, callback?:any){
    if(!tripRegistrationId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "deleteTripRegistrationCourses/" + tripRegistrationId;
      this.httpUtil.s_call(
          "deleteTripRegistrationCourses",  // objName
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

  // "/deleteTripRegistration/:userId/:tripRegistrationId"
  s_deleteTripRegistration(userId:number, tripRegistrationId:number, callback?:any){
    if(!userId || !tripRegistrationId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "deleteTripRegistration/" + userId + "/" + tripRegistrationId;
      this.httpUtil.s_call(
          "deleteTripRegistration",  // objName
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

  // "/saveTripRegistration/:userId"
  s_saveTripRegistration(userId:number, tripRegistration:TripRegistration, callback?){
    if(!tripRegistration){
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
          "saveTripRegistration",  // objName
          serviceUrl + "saveTripRegistration/" + userId, //urlStr,
          "put", //method,
          tripRegistration, //requestObj,
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

  s_getTripRegistrationsForProviderId(userId:number, providerId:number, futureOnly:boolean, callback?) {
    console.log("getTripRegistrationsForProviderId.");
    if(!userId || !providerId){
      if(callback){
        callback(null);
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getTripRegistrationsForProviderId/" + userId + "/" + providerId + "/" + futureOnly;
      this.httpUtil.s_call(
        "getTripRegistrationsForProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (tripRegistrations:TripRegistration[]) => {
          if(callback){
            callback(tripRegistrations);
          }
        }
      );
    });
  }

  s_getTripRegistrationsForUserId(userId:number, futureOnly:boolean, callback?) {
    console.log("getTripRegistrationsForUserId.");
    if(!userId){
      if(callback){
        callback(null);
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getTripRegistrationsForUserId/" + userId + "/" + futureOnly;
      this.httpUtil.s_call(
        "getTripRegistrationsForUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (tripRegistrations:TripRegistration[]) => {
          if(callback){
            callback(tripRegistrations);
          }
        }
      );
    });
  }

  // "/getTripRegistrationById/:userId/:tripRegistrationId"
  s_getTripRegistrationById( tripRegistrationId:number, callback?) {
    console.log("getTripRegistrationById.");
    if(!tripRegistrationId){
      if(callback){
        callback(null);
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getTripRegistrationById/" + tripRegistrationId;
      this.httpUtil.s_call(
          "getTripRegistrationById",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (tripRegistrations:TripRegistration[]) => {
            if(callback){
              callback(tripRegistrations);
            }
          }
      );
    });
  }

  // "/getTripRegistrationsForTripId/:userId/:tripId"
  s_getTripRegistrationsForTripId(tripId:number, callback?) {
    console.log("getTripRegistrationsForTripId.");
    if(!tripId){
      if(callback){
        callback(null);
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getTripRegistrationsForTripId/" + tripId;
      this.httpUtil.s_call(
          "getTripRegistrationsForTripId",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (tripRegistrations:TripRegistration[]) => {
            if(callback){
              callback(tripRegistrations);
            }
          }
      );
    });
  }

  // "/deleteTrip/:userId/:tripId"
  s_deleteTrip(userId:number, tripId:number, callback?:any){
    if(!userId || !tripId || !tripId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "deleteTrip/" + userId + "/" + tripId;
      this.httpUtil.s_call(
          "deleteTrip",  // objName
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

  // "/saveTrip/:userId"
  s_saveTrip(userId:number, trip:Trip, callback?){
    if(!userId || !trip){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "saveTrip",  // objName
          serviceUrl + "saveTrip/" + userId, //urlStr,
          "put", //method,
          trip, //requestObj,
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

  /**
   * Get trip details and tripRegistrations.
   * @param tripId: tripId for the trip;
   * @param allRegists: get all trip registration for admin;
   * @param userId: get my trip registrations if userId is not null; otherwise get all tripRegistrations;
   * @param callback: call back function;
   */
  s_getTripDetailsById(tripId:number, allRegists:boolean, userId:number, callback?){
    console.log("getTripDetailsById.");
    if(!tripId){
      if(callback){
        callback(null);
      }
    }
    if(!allRegists){
      allRegists = false;
    }
    if(!userId){
      userId = -1;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getTripDetailsById/" + tripId + "/" + allRegists + "/" + userId;
      this.httpUtil.s_call(
          "getTripDetailsById",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (trip:Trip) => {
            if(callback){
              callback(trip);
            }
          }
      );
    });
  }

  // "/getTripsForProviderId/:providerId"
  s_getTripsForProviderId(prividerId:number, tripHillId:number, futureOnly:boolean, callback?) {
    console.log("getTripsForProviderId.");
    if(!prividerId){
      if(callback){
        callback(null);
      }
    }
    if(!tripHillId){
      tripHillId = -1;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getTripsForProviderId/" + prividerId + "/" + tripHillId + "/" + futureOnly;
      this.httpUtil.s_call(
          "getTripsForProviderId",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (trips:Trip[]) => {
            if(callback){
              callback(trips);
            }
          }
      );
    });
  }
}
