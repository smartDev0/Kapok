import { Injectable } from '@angular/core';
import {TranslateUtil} from "./translate-util.service";
import {ACLService} from "./aclservice.service";
import {AppConstants} from "./app-constants.service";
import {HttpUtil} from "./http-util.service";
import {Utils} from "./utils.service";
import {AttachedFile} from "../models/AttachedFile";

@Injectable({
  providedIn: 'root'
})
export class AttachedFileService {

  constructor(private appConstants:AppConstants, public translateUtil:TranslateUtil, private utils:Utils,
              private httpUtil:HttpUtil, private aclService:ACLService,) {

  }

  // "/getStreamingForVideoId/:videoId"
  s_getVideoURL(userId:number, videoId:number){
    if(!userId || !videoId){
      return null;
    }
    return this.appConstants.BASE_URL + "getStreamingForVideoId/" + videoId;
  }

  s_deleteCourseAttachedFile(userId:number, videoId:number, callback?){
    if(!userId || !videoId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("deleteCourseAttachedFile.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteCourseAttachedFile",  // objName
        serviceUrl + "deleteCourseAttachedFile/" + userId + "/" + videoId, //urlStr,
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

  s_updateFile(userId:number, video:AttachedFile, callback?){
    if(!userId || !video){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "updateFile",  // objName
        serviceUrl + "updateFile/" + userId, //urlStr,
        "post", //method,
        video, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (result:AttachedFile) => {
          if(callback){
            callback(result);
          }
        }
      );
    });
  }

  s_createVideoForAnswer(userId:number, videoData:any, fileName:string, answerId:number, callback?){
    if(!userId || !videoData || !fileName || !answerId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
        "createVideoForAnswer",  // objName
        serviceUrl + "createVideoForAnswer/" + userId + "/" + fileName + "/" + answerId, //urlStr,
        "put", //method,
        videoData, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (result:AttachedFile) => {
          if(callback){
            callback(result);
          }
        }
      );
    });
  }

  s_createFileForCourseId(userId:number, fileData:any, fileName:string, courseId:number, callback?){
    if(!userId || !fileData || !fileName || !courseId){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "createFileForCourseId",  // objName
          serviceUrl + "createFileForCourseId/" + userId + "/" + fileName + "/" + courseId, //urlStr,
          "put", //method,
          fileData, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (result:AttachedFile) => {
            if(callback){
              callback(result);
            }
          }
      );
    });
  }

  s_getAttachedFileById(fileId:number, callback){
    if(!fileId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAttachedFileById/" + fileId;
      this.httpUtil.s_call(
        "getAttachedFileById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (file:AttachedFile) => {
          if(callback){
            callback(file);
          }
        }
      );
    });
  }

  s_getAttachedFileContentById(fileId:number, callback){
    if(!fileId || fileId<=0){
      if(callback){
        callback(null);
      }
      return;
    }

    // /getAttachedFileContentById/:fileId
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAttachedFileContentById/" + fileId;
      this.httpUtil.s_call(
          "getAttachedFileContentById",  // objName
          url, //urlStr,
          "post", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (file:AttachedFile) => {
            if(callback){
              callback(file);
            }
          }
      );
    });
  }

  s_getAttachedFileListForUserId(userId:number, callback){
    if(!userId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getAttachedFileListForUserId/" + userId;
      this.httpUtil.s_call(
        "getAttachedFileListForUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (videos:AttachedFile[]) => {
          if(callback){
            callback(videos);
          }
        }
      );
    });
  }
}
