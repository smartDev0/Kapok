import { Injectable } from '@angular/core';
import {TranslateUtil} from './translate-util.service';
import {Utils} from './utils.service';
import {AppConstants} from './app-constants.service';
import {UserInfo} from '../models/UserInfo';
import {AlbumImage} from '../models/AlbumImage';
import {ProviderMemberWithDetails} from '../models/ProviderMemberWithDetails';
import {Feedback} from '../models/Feedback';
import {ConfigureForClient} from '../models/transfer/ConfigureForClient';
import {HttpUtil} from "./http-util.service";
import {ACLService} from "./aclservice.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // PageContent;
  // public readonly helpContentName_cn:string = "HelpContent_cn";
  public readonly helpContentName_en:string = "HelpContent_en";
  public readonly termsContentName:string = "TermsContent";

  constructor(private appConstants:AppConstants, public utils:Utils, public translateUtil:TranslateUtil,
              private httpUtil:HttpUtil, private aclService:ACLService,) {

  }

  // "/getUserBioByUserId/:userId"
  s_getUserBioByUserId(userId:number, callback?){
    if(!userId || userId<=0){
      if(callback){
        callback(null);
        return;
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getUserBioByUserId/" + userId;
      this.httpUtil.s_call(
          "getUserBioByUserId",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          url, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (bioText:string) => {
            if(callback){
              callback(bioText);
            }
          }
      );
    });
  }


  // Get userInfo by id, for updating profile;
  // "/getUserInfo/:userId"
  s_getUserInfoById(userId:number, callback?){
    if(!userId || userId<=0){
      if(callback){
        callback(null);
        return;
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getUserInfo/" + userId;
      this.httpUtil.s_call(
          "get user info",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          url, //keyStr,
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
    });
  }

  s_getAlbumImagesForUserId = function(userId, callback?) {
    if(!userId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "getAlbumImagesForUserId",  // objName
          serviceUrl + "getAlbumImagesForUserId/" + userId, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (albumImages:AlbumImage[]) => {
            if(callback){
              callback(albumImages);
            }
          }
      );
    });
  };

  // "/getMemberForProviderIdAndUserId/:providerId/:userId"
  s_getMemberForProviderIdAndUserId(providerId:number, userId:number, callback?){
    if(!userId || userId<=0 || !providerId || providerId<=0){
      if(callback){
        callback(null);
        return;
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getMemberForProviderIdAndUserId/" + providerId + "/" + userId;
      this.httpUtil.s_call(
          "getMemberForProviderIdAndUserId",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          url, //keyStr,
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

  // This call will check if user is blocked;
  // "/userPreviewById/:userId/:callerUserId"
  s_getUserPreviewById(userId:number, callerUserId:number, callback?){
    if(!userId || userId<=0 || !callerUserId || callerUserId<=0){
      if(callback){
        callback(null);
        return;
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "userPreviewById/" + userId + "/" + callerUserId;
      this.httpUtil.s_call(
          "get user preview",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          url, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (user:UserInfo) => {
            if(user){
              user = this.utils.replaceIconUrl(user);
            }
            if(callback){
              callback(user);
            }
          }
      );
    });
  }

  // Check if userName used;
  // "/checkUserName/:userName"
  s_checkUserName(userName:string, callback?){
    if(!userName){
      if(callback){
        callback(null);
        return;
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "checkUserName",  // objName
          serviceUrl + "checkUserName/" + userName, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (exists:boolean) => {
            if(callback){
              callback(exists);
            }
          }
      );
    });
  }

  // "/checkEmail/:email"
  s_checkEmail(email:string, callback?){
    if(!email){
      if(callback){
        callback(null);
        return;
      }
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "checkEmail",  // objName
          serviceUrl + "checkEmail/" + email, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (exists:boolean) => {
            if(callback){
              callback(exists);
            }
          }
      );
    });
  }

  s_searchUserbyUserName(userName:string, requesterId:number, callback?){
    if(!userName || userName.trim()===""){
      callback(null);
    }
    // userName = _.replace(userName, /[&\/\\#,+()$~%.'":*?<>{}]/g,'_');

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "search user by username",  // objName
          serviceUrl + "userByUserName/" + userName + "/" + requesterId, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (userList:UserInfo[]) => {
            if(userList){
              for(let user of userList){
                this.utils.replaceIconUrl(user);
              }
            }
            if(callback){
              callback(userList);
            }
          }
      );
    });
  }

  s_sendFeedBack(feedback:Feedback, callback?) {
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "send feedback",  // objName
          serviceUrl + "feedback", //urlStr,
          "post", //method,
          feedback, //requestObj,
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

  // This method should be used by AppSession only!!
  s_saveUser(user:UserInfo, callback?) {
    if(!user || !user.id){
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "save user",  // objName
          serviceUrl + "updateUser", //urlStr,
          "put", //method,
          user, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (resultUser:UserInfo) => {
            this.utils.replaceIconUrl(resultUser);
            if(callback){
              callback(resultUser);
            }
          }
      );
    });
  }

  // "/updateEmail/:userId"
  s_updateEmail(userId:number, newEmail:string, callback?) {
    if(!userId || !newEmail){
      if(callback){
        callback(false);
        return;
      }
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "save user",  // objName
          serviceUrl + "updateEmail/" + userId, //urlStr,
          "put", //method,
          newEmail, //requestObj,
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

  s_getPageContent(name:string, callback?) {
    if(!name){
      if(callback){
        callback(null);
      }
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getPageContentByName/" + name;
      this.httpUtil.s_call(
          "get page content",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          url, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (content:string) => {
            callback(content);
          }
      );
    });
  }

  s_getClientConfigure(callback?) {
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getClientConfigure";
      this.httpUtil.s_call(
          "getClientConfigure",  // objName
          url, //urlStr,
          "get", //method,
          null, //requestObj,
          url, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (config:ConfigureForClient) => {
            callback(config);
          }
      );
    });
  }
}
