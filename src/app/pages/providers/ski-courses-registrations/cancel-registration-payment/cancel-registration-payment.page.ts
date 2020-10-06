import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController} from "@ionic/angular";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AppSession} from "../../../../services/app-session.service";
import {StudentUtil} from "../../../../services/student-util.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {Utils} from "../../../../services/utils.service";
import {CancelRegistrationAction} from "../../../../models/payment/CancelRegistrationAction";
import {Provider} from "../../../../models/Provider";
import {CourseRegistration} from "../../../../models/CourseRegistration";
import {CoursePaymentService} from "../../../../services/coursePayment/course-payment-service.service";
import * as moment from 'moment';
import {ACLService} from "../../../../services/aclservice.service";
import {SessionTime} from "../../../../models/SessionTime";

@Component({
  selector: 'app-cancel-registration-payment',
  templateUrl: './cancel-registration-payment.page.html',
  styleUrls: ['./cancel-registration-payment.page.scss'],

  providers: [
    StudentUtil,
  ],
})
export class CancelRegistrationPaymentPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  press:string;
  cancelAction:CancelRegistrationAction;

  providerId:number;
  registrationId:number;
  provider:Provider;
  registration:CourseRegistration;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public studentUtil:StudentUtil,
              private alertCtrl:AlertController, private actionsheetCtrl:ActionSheetController, private aclService:ACLService,
              private coursePaymentService:CoursePaymentService, private ionRouterOutlet:IonRouterOutlet,) {
    super(appSession, router, appConstants);
    this.l_checkUserId(false);

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if(this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.cancelAction = this.router.getCurrentNavigation().extras.state.cancelAction;
      }
    });
  }

  ngOnInit() {
    this.press = this.route.snapshot.paramMap.get('press');
  }

  ionViewWillEnter() {
    if(this.press && this.press.toLowerCase()!==":press".toLowerCase()){
      console.log("Processing press.");
      // decrypt press;
      this.aclService.s_getJSONFromPress(this.press, (json:string) => {
        if(!json){
          this.toastUtil.showToastTranslate("Can not process press parameter!");
          return;
        }else{
          this.cancelAction = JSON.parse(json);
          this.updatePageContent();
        }
      });
    }else{
      super.l_checkUserId(false);
      this.updatePageContent();
    }
  }


  updatePageContent(){
    if(!this.cancelAction || !this.cancelAction.providerId || !this.cancelAction.registrationId){
      this.toastUtil.showToastTranslate("Empty cancel action!");
      return;
    }else{
      this.providerId = this.cancelAction.providerId;
      this.registrationId = this.cancelAction.registrationId;
    }

    this.providerService.s_getCourseRegistrationById(this.cancelAction.userId, this.registrationId, (registration:CourseRegistration) => {
      this.registration = registration;

      this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
        this.provider = provider;
      });
    });
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  onCancelCourseRegistration(){
    if(!this.registration || !this.provider){
      return false;
    }
    if(this.registration.statusId===this.appConstants.PAYMENT_CANCELLED_ID){
      this.toastUtil.showToastTranslate("Registration already cancelled!");
      return false;
    }

    // check cancel condition: 12 hours before startTime, provider allow cancellation;
    // allowCancelCourseRegistration, allowCancelHoursBeforeStartTime;
    if(!this.provider.allowCancelCourseRegistration){
      this.toastUtil.showToastTranslate("Course Registration is not allowed by school!");
      return;
    }

    let firstSessionTime = null;
    if(this.registration.sessionTimes && this.registration.sessionTimes.length>0){
      for(let sessionTime of this.registration.sessionTimes){
        if(!firstSessionTime || moment(sessionTime.startTime).isBefore(moment(firstSessionTime))){
          firstSessionTime = sessionTime.startTime;
        }
      }
    }
    if(this.provider.allowCancelHoursBeforeStartTime && this.provider.allowCancelHoursBeforeStartTime>0 && firstSessionTime){
      if (moment(new Date()).add(this.provider.allowCancelHoursBeforeStartTime, 'hours').isAfter(moment(firstSessionTime))) {
        this.toastUtil.showToast(this.translateUtil.translateKey("Course Registration can only be cancelled ") + this.provider.allowCancelHoursBeforeStartTime +
          this.translateUtil.translateKey(" hours before start time: ") + firstSessionTime);
        return;
      }
    }

    console.log("Good onCancelCourseRegistration().");
    this.providerService.s_cancelRegistrationByClient(this.cancelAction, (result:number) => {
      let message = null;
      if(result>0){
        message = this.translateUtil.translateKey("Registration cancelled successfully.");
      }else if(result===0){
        message = this.translateUtil.translateKey("Lesson already cancelled!");
      }else{
        message = this.translateUtil.translateKey("Failed cancelling lesson!");
      }

      this.utils.showOkAlert(this.alertCtrl, message, null);

      this.updatePageContent();
      this.onClose();
    });
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  onViewCourseDetails(){
    // ski-course-details
    if(!this.registration.courseId){
      return;
    }

    let navigationExtras: NavigationExtras = {
      state: {
        courseId:this.registration.courseId, providerId:this.providerId
      }
    };
    this.router.navigate(['ski-course-details'], navigationExtras);
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Cancel Registration'),
        handler: () => {
          console.log('Cancel lesson clicked');
          this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to cancel this registration?'),
            null, null, this.translateUtil.translateKey('No'), null, this.translateUtil.translateKey('Yes'),
            (data) => {
              this.onCancelCourseRegistration();
            });
        },
      }
    );
    buttons.push(
      {
        text: this.translateUtil.translateKey('Close'),
        handler: () => {
          console.log('Close clicked');
          this.onClose();
        },
      }
    );

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
