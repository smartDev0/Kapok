import { Injectable } from '@angular/core';
import {AppConstants} from '../app-constants.service';
import {Utils} from '../utils.service';
import {AppSession} from '../app-session.service';
import {HttpUtil} from '../http-util.service';
import {UserInfo} from '../../models/UserInfo';
import {SearchUserRequest} from "../../models/transfer/SearchUserRequest";
import {SearchUserResponse} from "../../models/transfer/SearchUserResponse";


@Injectable()
export class AdminUserService {

  constructor(private appConstants:AppConstants, private utils:Utils,
              public appSession:AppSession, private httpUtil:HttpUtil) {
    console.log('Hello GroupService Provider');
  }


  // "/adminService/changeSiteAdmin/:userId"
  s_changeSiteAdmin(userId:number, isSiteAdmin:boolean, callback?){
    if(!userId){
      if(callback){
        callback(null);
      }
      return;
    }
    if(!isSiteAdmin){
      isSiteAdmin = false;
    }
    this.httpUtil.s_call(
      "changeSiteAdmin",  // objName
      this.appConstants.BASE_URL + "adminService/changeSiteAdmin/" + userId, //urlStr,
      "post", //method,
      isSiteAdmin, //requestObj,
      null, //keyStr,
      null, //groupKeyStr,
      null, //ttl,
      (result:boolean) => {
        if(callback){
          callback(result);
        }
      }
    );
  }

  s_searchUsers(searchRequest:SearchUserRequest, callback?){
    console.log("Good s_searchUsers().");
    if(!SearchUserRequest){
      if(callback){
        callback(null);
      }
      return;
    }

    this.httpUtil.s_call(
      "admin search users",  // objName
      this.appConstants.BASE_URL + "adminService/searchUsers", //urlStr,  "/adminService/searchUsers"
      "post", //method,
      searchRequest, //requestObj,
      null, //keyStr,
      null, //groupKeyStr,
      null, //ttl,
      (response:SearchUserResponse) => {
        if(callback){
          callback(response);
        }
      }
    );
  }

  // Get userInfo by id, for updating profile;
  // "/getUserInfo/:userId"
  s_getUserInfoById(userId:number, callback?){
    if(!userId || userId<=0){
      if(callback){
        callback(null);
      }
      return;
    }

    this.httpUtil.s_call(
      "get user info",  // objName
      this.appConstants.BASE_URL + "adminService/getUserInfo/" + userId, //urlStr,
      "get", //method,
      null, //requestObj,
      null, //keyStr,
      null, //groupKeyStr,
      null, //ttl,
      (userInfo:UserInfo) => {
        if(userInfo){
          userInfo = this.utils.replaceIconUrl(userInfo);
        }
        if(callback){
          callback(userInfo);
        }
      }
    );
  }

  s_logoutUserById(userId:number, callback?){
    if(!userId || userId<=0){
      if(callback){
        callback(null);
      }
      return;
    }

    // "/adminService/logoutUser/:userId"
    this.httpUtil.s_call(
      "admin logout user",  // objName
      this.appConstants.BASE_URL + "adminService/logoutUser/" + userId, //urlStr,
      "post", //method,
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
  }

  s_lockUnlockUserById(userId:number, locked:boolean, callback?){
    if(!userId || userId<=0){
      if(callback){
        callback(null);
      }
      return;
    }

    // "/adminService/lockUnLockUser/:userId/:locked"
    this.httpUtil.s_call(
      "admin lock or unlock user",  // objName
      this.appConstants.BASE_URL + "adminService/lockUnLockUser/" + userId + "/" + locked, //urlStr,
      "post", //method,
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
  }

  s_deleteUserById(userId:number, callback?){
    if(!userId || userId<=0){
      if(callback){
        callback(null);
      }
      return;
    }

    // "/adminDeleteUser/:userId"
    this.httpUtil.s_call(
      "admin delete user",  // objName
      this.appConstants.BASE_URL + "adminService/adminDeleteUser/" + userId, //urlStr,
      "post", //method,
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
  }

  // "/adminService/deleteUsersByIds"
  s_deleteUsersByIds(userIds:number[], callback?){
    if(!userIds || userIds.length===0){
      if(callback){
        callback(null);
      }
      return;
    }

    this.httpUtil.s_call(
      "admin delete users by ids",  // objName
      this.appConstants.BASE_URL + "adminService/deleteUsersByIds", //urlStr,
      "post", //method,
      userIds, //requestObj,
      null, //keyStr,
      null, //groupKeyStr,
      null, //ttl,
      (result:boolean) => {
        if(callback){
          callback(result);
        }
      }
    );
  }
}
