import { Injectable } from '@angular/core';
import {HttpUtil} from '../http-util.service';
import {ACLService} from '../aclservice.service';
import {AppConstants} from '../app-constants.service';
import {VerifyPreApprovedPaymentRequest} from '../../models/transfer/VerifyPreApprovedPaymentRequest';
import {PaymentAction} from '../../models/payment/PaymentAction';
import {CourseRegistrationInvoice} from '../../models/payment/coursePayment/CourseRegistrationInvoice';
import {BehaviorSubject, Subscription} from 'rxjs';
import {UserInfo} from '../../models/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class CoursePaymentService {
  public invoice:CourseRegistrationInvoice;

  private courseRegistrationLock$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private appConstants:AppConstants, private aclService:ACLService,
              private httpUtil:HttpUtil) {

  }

  public updateCourseRegistrationLock(status:boolean){
    this.courseRegistrationLock$.next(status);
  }

  public subscribeCourseRegistrationLock(callback){
    this.courseRegistrationLock$.subscribe((status:boolean) => {
      if(callback){
        callback(status);
      }
    });
  }

  // This method can be used for client check invoice paying status;
  s_getCourseInvoiceById(userId:number, invoiceId, callback?){
    if(!userId || !invoiceId){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getCourseInvoiceById.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "getCourseInvoiceById",  // objName
          serviceUrl + "getCourseInvoiceById/" + userId + "/" + invoiceId, //urlStr,
          "get", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (invoice:CourseRegistrationInvoice) => {
            if(callback){
              callback(invoice);
            }
          }
      );
    });
  }

  s_cancelPaymentByClient(providerId:number, userId:number, invoiceId:number, callback?){
    if(!invoiceId){
      return;
    }
    console.log("cancelPaymentByClient.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "cancelPaymentByClient",  // objName
          serviceUrl + "cancelPaymentByClient/" + providerId + "/" + userId, //urlStr,
          "post", //method,
          invoiceId, //requestObj,
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

  s_verifyPreApprovedPayment(verifyRequest:VerifyPreApprovedPaymentRequest, callback?){
    if(!verifyRequest){
      return;
    }
    console.log("verifyPreApprovedPayment.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "verifyPreApprovedPayment",  // objName
          serviceUrl + "verifyPreApprovedPayment",
          "post", //method,
          verifyRequest, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (prePayId:number) => {
            if(callback){
              callback(prePayId);
            }
          }
      );
    });
  }

  // "/courseCheckOut/:userId"
  s_courseCheckOut(providerId:number, userId:number, paymentAction:PaymentAction, callback?){
    if(!paymentAction){
      return;
    }
    console.log("courseCheckOut.");
    this.aclService.s_getAppVersionServiceURL(this.appConstants.appVersion, (serviceUrl:string) => {
      this.httpUtil.s_call(
          "courseCheckOut",  // objName
          serviceUrl + "courseCheckOut/" + providerId + "/" + userId, //urlStr,
          "post", //method,
          paymentAction, //requestObj,
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
