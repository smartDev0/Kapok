import { Injectable } from '@angular/core';
import {AppConstants} from './app-constants.service';
import {ACLService} from './aclservice.service';
import {HttpUtil} from './http-util.service';
import {AlbumImage} from '../models/AlbumImage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private appConstants:AppConstants, private aclService:ACLService,
              private httpUtil:HttpUtil) {

  }

  s_deleteAlbumImage(albumImageId:number, callback?) {
    if(!albumImageId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "deleteAlbumImage",  // objName
          serviceUrl + "deleteAlbumImage/" + albumImageId, //urlStr,
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

  // delete image;
  s_deleteImageById(imageId:number, callback?) {
    if(!imageId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "delete image",  // objName
          serviceUrl + "deleteImage/" + imageId, //urlStr,
          "delete", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          () => {
            // TODO: update event images?
            return true;
          }
      );
    });
  }

  // "/updateAlbumImage/:userId"
  /**********
   * Update album image for user album;
   * POST "/updateAlbumImage/:userId"
   ***********/
  s_updateAlbumImage = function(userId, albumImage:AlbumImage, callback?) {
    if(!userId || !albumImage || !albumImage.userId || !albumImage.imageId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "update album image",  // objName
          serviceUrl + "updateAlbumImage/" + userId, //urlStr,
          "post", //method,
          albumImage, //requestObj,
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
  };

  /**********
   * Upload image for user album;
   * POST "/uploadAlbumImage/:userId"
   ***********/
  s_uploadAlbumImage = function(userId, image, fileName, callback?) {
    if(!userId || !image){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "upload album image",  // objName
          serviceUrl + "uploadAlbumImage/" + userId + "/" + fileName, //urlStr,
          "post", //method,
          image, //requestObj,
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
  };


  /**********
   * Upload image for provider (school) profile for device native camera or photo library;
   * POST "/providerId/:userId"
   ***********/
  s_uploadProviderIconImage(userId, providerId, image, fileName, callback?) {
    if(!userId || !providerId || !image){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "update provider icon image",  // objName
          serviceUrl + "uploadProviderIconImage/" + userId + "/" + providerId + "/" + fileName, //urlStr,
          "post", //method,
          image, //requestObj,
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


  /**********
   * Upload image for mountain profile for device native camera or photo library;
   * POST "/uploadMountainTitleImage/:userId"
   ***********/
  s_uploadMountainTitleImage = function(userId, mountainId, image, fileName, callback?) {
    if(!userId || !mountainId || !image){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "update montain title image",  // objName
          serviceUrl + "uploadMountainTitleImage/" + userId + "/" + mountainId + "/" + fileName, //urlStr,
          "post", //method,
          image, //requestObj,
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
  };

  /**********
   * Upload image for user profile for device native camera or photo library;
   * POST "/uploadProfileImageDevice/:userId"
   ***********/
  s_uploadProfileImageDevice = function(userId, image, fileName, callback?) {
    if(!userId || !image){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "update profile image",  // objName
          serviceUrl + "uploadProfileImageDevice/" + userId + "/" + fileName, //urlStr,
          "post", //method,
          image, //requestObj,
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
  };

  /**********
   * Upload image for user profile for browser;
   * POST "/uploadProfileImageBrowser/:userId"
   ***********/
  uploadProfileImageBrowser = function(userId, image, callback?) {
    if(!userId || !image){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "update profile image",  // objName
          serviceUrl + "eventImageProfile/" + userId, //urlStr,
          "post", //method,
          image, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (result) => {
            if(callback){
              callback(result);
            }
          }
      );
    });
  };


  s_uploadEventImageJson = function(userId, eventId, image, callback?) {
    if(!userId || !eventId || !image){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "update event image",  // objName
          serviceUrl + "eventImageJson/" + userId + "/" + eventId, //urlStr,
          "post", //method,
          image, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (result) => {
            if(callback){
              callback(result);
            }
          }
      );
    });
  };
}
