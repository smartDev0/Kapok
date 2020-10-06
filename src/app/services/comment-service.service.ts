import { Injectable } from '@angular/core';
import {AppConstants} from './app-constants.service';
import {CommentWithDetails} from '../models/CommentWithDetails';
import {HttpUtil} from './http-util.service';
import {ACLService} from './aclservice.service';
import {GeneralPaginationRequest} from '../models/transfer/GeneralPaginationRequest';
import {GeneralPaginationResponse} from '../models/transfer/GeneralPaginationResponse';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private appConstants:AppConstants, private aclService:ACLService,
              private httpUtil:HttpUtil) {

  }

  s_createCommentLink(userId:number, comment:CommentWithDetails, callback:any){
    if(!userId || userId<=0 || !comment || (!comment.fromUserId && !comment.fromUserEmail)){
      if(callback){
        callback(null);
      }
    }
    console.log("createCommentLink.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "createCommentLink/" + userId;
      console.log("url is now: " + url);
      this.httpUtil.s_call(
          "createCommentLink",  // objName
          url, //urlStr,
          "post", //method,
          comment, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (commentLink:string) => {
            if(callback){
              callback(commentLink);
            }
          }
      );
    });
  }

  s_getRecentCommentsForUserId(userId:number, startTime:any, callback:any){
    if(!userId || userId<=0){
      if(callback){
        callback(null);
      }
    }
    console.log("getRecentCommentsForUserId.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      let url = serviceUrl + "getRecentCommentsForUserId/" + userId;
      console.log("url is now: " + url);
      this.httpUtil.s_call(
          "getRecentCommentsForUserId",  // objName
          url, //urlStr,
          "post", //method,
          startTime, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (eventComments:CommentWithDetails[]) => {
            if(callback){
              callback(eventComments);
            }
          }
      );
    });
  }

  s_getCommentsByEntityTypeAndId(entityType:number, entityId:number, commentRequest:GeneralPaginationRequest, callback) {
    if(!entityType || !entityId || !commentRequest){
      if(callback){
        callback(commentRequest);
      }
      return;
    }

    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "get event comments",  // objName
          serviceUrl + "getCommentsByEntityTypeAndId/" + entityType + "/" + entityId, //urlStr,
          "put", //method,
          commentRequest, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (pageResponse:GeneralPaginationResponse) => {
            console.log("Got eventComments.");
            if(!pageResponse){
              commentRequest.noMoreResult = true;
              if(callback){
                callback(commentRequest);
              }
              return;
            }

            let eventComments:CommentWithDetails[] = pageResponse.pageResults;
            if(eventComments && eventComments.length>0){
              commentRequest.start = pageResponse.start + eventComments.length;
              commentRequest.results = eventComments;
            }else{
              commentRequest.noMoreResult = true;
            }
            if(callback){
              callback(commentRequest);
            }
          }
      );
    });
  }

  s_addCommentToEntity(userId:number, comment:CommentWithDetails, callback?) {
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "add event comment",  // objName
          serviceUrl + "addComments/" + userId, //urlStr,
          "post", //method,
          comment, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (resultComment: CommentWithDetails) => {
            // this.utils.l_updateCache(this.cacheKeys.CACHE_EVENT_COMMENTS);
            if(callback){
              callback(resultComment);
            }
          }
      );
    });
  }


  // Delete comment;
  // var url = BASE_URL + "deleteCommentById/" + commentId;
  s_deleteComment(commentId:number, callback?) {
    if(!commentId){
      return;
    }
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "delete comment",  // objName
          serviceUrl + "deleteCommentById/" + commentId, //urlStr,
          "put", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (result:boolean) => {
            console.log("comment deleted. id: " + commentId);
            // this.utils.l_updateCache(this.cacheKeys.CACHE_EVENT_COMMENTS);
            if(callback){
              callback(result);
            }
          }
      );
    });
  }
}
