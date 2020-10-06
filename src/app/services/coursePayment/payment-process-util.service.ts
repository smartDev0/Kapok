import { Injectable } from '@angular/core';
import {ToastUtil} from '../toast-util.service';
import {TranslateUtil} from '../translate-util.service';
import {AlertController, NavController} from '@ionic/angular';
import {AppConstants} from '../app-constants.service';
import {GeneralResponse} from '../../models/transfer/GeneralResponse';
import {CourseRegistration} from '../../models/CourseRegistration';
import {CourseRegistrationInvoice} from '../../models/payment/coursePayment/CourseRegistrationInvoice';
import {Provider} from '../../models/Provider';
import {ProvidersService} from "../providers-service.service";
import {AppSession} from "../app-session.service";
import {CoursePaymentService} from "./course-payment-service.service";
import {Utils} from '../utils.service';
import {NavigationExtras, Router} from "@angular/router";
import {ScheduleService} from '../schedule.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentProcessUtil {

  constructor(private appConstants: AppConstants, private providersService:ProvidersService,
              public appSession: AppSession, public alertCtrl:AlertController, private coursePaymentService:CoursePaymentService,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private utils:Utils, public router:Router, private scheduleService:ScheduleService) {

  }

  checkAnyPayCourse(registration:CourseRegistration, navCtrl:NavController, payOfflineOnly:boolean){
    this.l_checkProviderAndRegister(registration, navCtrl, payOfflineOnly);
  }

  l_checkProviderAndRegister(registration:CourseRegistration, navCtrl:NavController, payOfflineOnly:boolean){
    if(!registration || !registration.providerId){
      return false;
    }
    let providerId = registration.providerId;
    this.providersService.s_getProviderById(providerId, (provider:Provider) => {
      if(!provider){
        return false;
      }
      this.l_goConfirmAndPay(this.appSession.l_getUserId(), registration, navCtrl, payOfflineOnly);
    });

  }

  l_goConfirmAndPay(userId:number, registration:CourseRegistration, navCtrl:NavController, payOfflineOnly:boolean){
    if(!registration){
      this.toastUtil.showToast("Null registration!");
      return;
    }

    if(!registration.providerId){
      this.toastUtil.showToast("Undefined provider!");
      return;
    }

    if(registration.fromSchedule===true){
      this.scheduleService.registerScheduleCourseRegistration(userId, registration, (response:GeneralResponse) => {
        console.log("Registration for schedule or recurrence.");
        this.processRegistrationResponse(payOfflineOnly, registration, response);
      });
    }else{
      this.providersService.s_registerSkiRegistration(userId, registration, (response:GeneralResponse) => {
        console.log("Registration for schedule or course.");
        this.processRegistrationResponse(payOfflineOnly, registration, response);
      });
    }
  }

  processRegistrationResponse(payOfflineOnly:boolean, registration:CourseRegistration, response:GeneralResponse){
    if(!response){
      return null;
    }
    if(response.code!==0 && response.message){
      this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey(response.message), null);
      this.coursePaymentService.updateCourseRegistrationLock(false);
      return;
    }

    let invoice:CourseRegistrationInvoice = response.resultObject;
    if(invoice){
      this.coursePaymentService.invoice = invoice;
      if(invoice.statusId!==this.appConstants.PAYMENT_FULLY_ID && invoice.statusId!==this.appConstants.PAYMENT_WAIVED_ID &&
        invoice.statusId!==this.appConstants.PAYMENT_PAID_OFFLINE_ID && invoice.statusId!==this.appConstants.PAYMENT_PAID_ONLINE_ID){
        // this.toastUtil.showToastForTime("Payment created, please do the payment.", 5000);

        if(payOfflineOnly){
          this.utils.showOkAlert(this.alertCtrl, "Registration succeed.", "Please check your email for your registration details.");
          if(this.appSession.l_hasCurrentProviderAccount(registration.providerId)){
            let navigationExtras: NavigationExtras = {
              state: {
                registrationId:invoice.registrationId,
                providerId:registration.providerId,
                showBackBtn: -1,
              }
            };
            this.router.navigate(['ski-course-registration-details'], navigationExtras);
          }else{
            this.router.navigate([this.appConstants.ROOT_PAGE]);
          }
        }else{
          let navigationExtras: NavigationExtras = {
            state: {
              providerId: registration.providerId,
            }
          };
          this.router.navigate(['course-payment-details'], navigationExtras);
        }
      }else if(invoice.statusId===this.appConstants.PAYMENT_WAIVED_ID){
        this.toastUtil.showToast("Payment waived. Please check you confirmation email.", 5000);
        if(this.appSession.l_hasCurrentProviderAccount(registration.providerId)){
          // navCtrl.setRoot("SkiCourseRegistrationDetailsPage", {registrationId:this.coursePaymentService.invoice.registrationId, providerId:registration.providerId});
        }else{
          this.router.navigate([this.appConstants.ROOT_PAGE]);
        }
      }else{
        this.toastUtil.showToast("Register lesson failed. Please choose another time and try again.");
      }
    }else{
      this.toastUtil.showToast("Register lesson failed. No invoice created! Please choose another time and try again.");
    }
  }

  isCourseRequirePayment(statusId:number){
    if( statusId===this.appConstants.PAYMENT_FULLY_ID ||
        statusId===this.appConstants.PAYMENT_PRE_APPROVED ||
        statusId===this.appConstants.PAYMENT_WAIVED_ID ||
        statusId===this.appConstants.PAYMENT_PAID_OFFLINE_ID ||
        statusId===this.appConstants.PAYMENT_PAID_ONLINE_ID){
      return false;
    }else{
      return true;
    }
  }
}
