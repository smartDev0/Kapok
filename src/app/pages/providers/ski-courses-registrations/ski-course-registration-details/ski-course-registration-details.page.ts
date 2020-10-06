import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, ModalController, NavController,} from '@ionic/angular';
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AppConstants} from "../../../../services/app-constants.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {Provider} from "../../../../models/Provider";
import {CourseRegistration} from "../../../../models/CourseRegistration";
import {UserInfo} from "../../../../models/UserInfo";
import {UserService} from "../../../../services/user-service.service";
import {CancelRegistrationAction} from "../../../../models/payment/CancelRegistrationAction";
import {StudentUtil} from "../../../../services/student-util.service";
import {CallbackValuesService} from "../../../../services/callback-values.service";
import {Subscription} from "rxjs";
import {Course} from '../../../../models/Course';
import {CourseCalculationDetailsPage} from '../../../course-payment-details/course-calculation-details/course-calculation-details.page';
import {CoursePaymentService} from '../../../../services/coursePayment/course-payment-service.service';
import {CourseRegistrationInvoice} from '../../../../models/payment/coursePayment/CourseRegistrationInvoice';
import {TripServiceService} from '../../../../services/trip-service.service';
import {Trip} from '../../../../models/trip/Trip';
import {SessionTime} from "../../../../models/SessionTime";
import {EmailNotificationPage} from "../../email-notification/email-notification.page";
import {InstructorWithDetails} from "../../../../models/InstructorWithDetails";

@Component({
  selector: 'app-ski-course-registration-details',
  templateUrl: './ski-course-registration-details.page.html',
  styleUrls: ['./ski-course-registration-details.page.scss'],

  providers: [
    StudentUtil,
  ],
})
export class SkiCourseRegistrationDetailsPage extends BasicUserIdPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  // private sessionTimeModal:any;
  private emailModal:any;

  userId:number;
  showBackBtn:number = 1;
  providerId:number = null;
  provider:Provider = null;
  registrationId = null;
  registration:CourseRegistration;

  expendedInstructors:boolean;

  callback:any = null;
  disableModifyButtons:boolean = true;
  private subscription:Subscription;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public studentUtil:StudentUtil,
              private alertCtrl:AlertController, private userService:UserService, private actionsheetCtrl:ActionSheetController,
              private callbackValues:CallbackValuesService, private ionRouterOutlet:IonRouterOutlet, private tripService:TripServiceService,
              private coursePaymentService:CoursePaymentService, private modalController:ModalController, private modalCtrl:ModalController,
              ) {
    super(appSession, router, appConstants);
    this.l_checkUserId(false);

    this.userId = this.appSession.l_getUserId();

    if(this.userId){
        this.route.queryParams.subscribe(params => {
        console.log("Good queryParams.");
        if (this.router.getCurrentNavigation().extras.state) {
          this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
          this.registrationId = this.router.getCurrentNavigation().extras.state.registrationId;
          this.showBackBtn = this.router.getCurrentNavigation().extras.state.showBackBtn;
          if(!this.showBackBtn){
            this.showBackBtn = 1;
          }
        }
      });
    }
  }

  ngOnInit() {
    if(!this.providerId){
      this.providerId = parseInt(this.route.snapshot.paramMap.get('providerId'));
      this.registrationId = parseInt(this.route.snapshot.paramMap.get('registrationId'));
      this.showBackBtn = 0;
    }
  }

  ionViewWillEnter() {
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
        this.provider = provider;
      });
    }
    this.appSession.checkProviderContext(false, this.providerId);
    this.updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updatePageContent(){
    this.providerService.s_getCourseRegistrationById(this.appSession.l_getUserId(), this.registrationId, (registration:CourseRegistration) => {
      if(registration){
        this.registration = registration;
        this.providerId = this.registration.providerId;

        this.getCourseRegistrationExtraInstructors();
      }else{
        this.providerId = null;
        this.toastUtil.showToastTranslate("Can not find the lesson registration!");
        this.router.navigate([this.appConstants.ROOT_PAGE]);
      }
    });
  }

  getCourseRegistrationExtraInstructors(){
    if(!this.registration || !this.registrationId || this.registrationId<=0){
      return;
    }
    this.providerService.getInstructorsForCourseRegistrationId(this.registrationId, (instructors:InstructorWithDetails[]) => {
      this.registration.instructors = instructors;
    });
  }

  onViewCourse(courseId:number){
    console.log("Good onViewCourse, courseId: " + courseId);
    if(!courseId){
      return;
    }
    let navigationExtras: NavigationExtras = {
      state: {
        courseId:courseId, providerId:this.providerId
      }
    };
    this.providerService.s_getCoursesDetailsById(courseId, (course:Course) => {
      this.router.navigate(['ski-course-details'], navigationExtras);
    });
  }

  async onViewAmountDetails(invoiceId:number){
    console.log("Good onViewAmountDetails().");

    // if(!this.userId){
    //   this.toastUtil.showToast("Please login first.");
    //   return;
    // }

    this.coursePaymentService.s_getCourseInvoiceById(this.userId, invoiceId, (invoice:CourseRegistrationInvoice) => {
      if(!invoice){
        this.toastUtil.showToast("Can not find the invoice for id: " + invoiceId);
        return;
      }
      this.showInvoiceDetails(invoice);
    });
  }

  async showInvoiceDetails(invoice:CourseRegistrationInvoice){
    const modal = await this.modalController.create({
      component: CourseCalculationDetailsPage,
      componentProps: {invCal:invoice.invoiceCalculation},
    });
    await modal.present();
  }

  onAssignCourse(){
    console.log("Good onAssignCourse().");
    let componentName = 'SkiCourseRegistrationDetailsPage' + this.utils.getTime();
    let navigationExtras: NavigationExtras = {
      state: {
        CALLBACK_HOOKED_COMPONENT: componentName,
        fromCommand:this.appConstants.PAGE_FOR_CHOOSE, providerId:this.providerId
      }
    };
    this.router.navigate(['ski-courses', this.utils.getTime()], navigationExtras);

    this.subscription = this.callbackValues.callbackDataSubject.subscribe((callbackValue) => {
      if(!callbackValue || !callbackValue.target || callbackValue.target!==componentName || !callbackValue.values){
        return;
      }
      let courseId:number = callbackValue.values['courseId'];
      if(courseId){
        this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Registration startTime and andTime ' +
          'will be updated according to selected course if it has one and only one session. Continue?'), null, null,
          this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('Yes'),
          (data) => {
            this.providerService.s_assignRegistrationToCourse(this.appSession.l_getUserId(), courseId, this.registration.id, () => {
              this.updatePageContent();
            });
          });
    }}
    );
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  onEdit() {
    if(this.registration && this.registration.courseId){
      this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey('Lesson already assigned.'),
        this.translateUtil.translateKey('You can only delete this registration and try register another one.'));
      return;
    }
    this.toastUtil.showToastTranslate("Edit lesson registration is not supported yet.");

    if(this.registration && this.registration){
      let navigationExtras: NavigationExtras = {
        state: {
          registrationRequest:this.registration
        }
      };
      this.router.navigate(['ski-course-registration-edit'], navigationExtras);
    }
  }

  onDelete(){
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Delete Registration?'), null, null,
      this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('Delete'),
      (data) => {
        this.l_delete();
      });
  }

  l_delete(){
    this.providerService.s_deleteSkiCoruseRegistration(this.appSession.l_getUserId(), this.registrationId, true, (result:boolean) => {
      if(result){
        this.toastUtil.showToastTranslate("registration deleted.");
      }
      this.onClose();
    });
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack() && (!this.registration || !this.utils.isRegistrationPaid(this.registration.statusId))){
      if(this.registration && this.registration.id && this.registration.tripId){
        this.onViewTripEvents(this.registration.tripId);
      }else{
        this.navCtrl.pop();
      }
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onViewTripEvents(tripId:number){
    console.log("Good onViewTripEvents().");
    if(tripId && tripId>0){
      this.tripService.s_getTripDetailsById(tripId, false, this.userId, (trip:Trip) => {
        if(trip){
          let navigationExtras: NavigationExtras = {
            state: {
              providerId:this.providerId,
              tripHillId:trip.tripHillId,
            }
          };
          this.router.navigate(['trips', this.providerId, trip.tripHillId], navigationExtras);
        }else{
          this.navCtrl.pop();
        }
      });
    }else{
      this.navCtrl.pop();
    }
  }

  onInstructorDetails(instructorId:number){
    console.log("Good onInstructorDetails. instructor: " + instructorId);
    if(!instructorId || instructorId<0){
      return;
    }
    this.providerService.s_getUserBriefByInstructorId(this.appSession.l_getUserId(), instructorId, (userBrief:UserInfo) => {
      if(userBrief){
        console.log("Got userBrief for instructor, userName: " + userBrief.userName);
        this.l_showPopup(userBrief, userBrief?userBrief.skiLevel:null, userBrief?userBrief.boardLevel:null);
      }
    });
  }

  onRegisterDetails(regUserId:number){
    console.log("Good onRegisterDetails. regist: " + regUserId);
    if(!regUserId || regUserId<=0){
      return;
    }
    this.userService.s_getUserPreviewById(regUserId, this.appSession.l_getUserId(), (userBrief:UserInfo) => {
      if(userBrief){
        console.log("Got userBrief for member, userName: " + userBrief.userName);
        this.l_showPopup(userBrief, null, null);
      }
    });
  }

  l_showPopup(userBrief:UserInfo, instructorSkiLevel, instructorSnowboardLevel){
    let contentStr =
      // "UserName: " + userBrief.userName + "<br>" +
      "Name: " + (userBrief.name?userBrief.name:"") + "<br>" +
      "Email: " + userBrief.email + "<br>" +
      "PhoneNumber: " + (userBrief.phoneNumber?userBrief.phoneNumber:"") + "<br>" +
      "WeChatId: " + (userBrief.weChatNum?userBrief.weChatNum:"") + "<br>";
    if(instructorSkiLevel && instructorSkiLevel>0){
      contentStr = contentStr + "CSIA L" + instructorSkiLevel + "<br>";
    }
    if(instructorSnowboardLevel && instructorSnowboardLevel>0){
      contentStr = contentStr + "CASI L" + instructorSnowboardLevel + "<br>";
    }

    this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey('User Brief'),
      this.translateUtil.translateKey(contentStr));
  }

  async onComment(){
    console.log("Good onComment().");
    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Add Comment'),
      inputs: [
        {
          name: 'comment',
          label: this.translateUtil.translateKey('content'),
          type: 'text',
          placeholder: 'Placeholder 1'
        },
      ],
      buttons: [
        {
          text: this.translateUtil.translateKey('CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey('Add'),
          handler: data => {
            if(data && data[0]){
              console.log("Comment now. comment: " + data[0]);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  onCancelRegistration(){
    console.log("Good onCancelRegistration().");
    let cancelAction = new CancelRegistrationAction();
    cancelAction.registrationId = this.registrationId;
    cancelAction.userId = this.appSession.l_getUserId();
    cancelAction.providerId = this.providerId;
    let navigationExtras: NavigationExtras = {
      state: {
        cancelAction: cancelAction
      }
    };
    this.router.navigate(['cancel-registration-payment'], navigationExtras);
  }

  onSetOfflinePaid(){
    console.log("Good onSetOfflinePaid().");
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to set paid offline for this registration?'),
      null, null, this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('Yes'),
      (data) => {
        this.providerService.s_setCourseRegistrationOfflinePaid(this.appSession.l_getUserId(), this.registrationId, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("Coruse registration has been set offline paid.");
          }else{
            this.toastUtil.showToast("Failed setting coruse registration to be offline paid.");
          }
          this.updatePageContent();
          if(this.callback){
            this.callback();
          }
        });
      });
  }

  backToTripRegistration(){
    if(this.registration && this.registration.tripRegistrationId){
      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.providerId,
          tripRegistrationId: this.registration.tripRegistrationId,
        }
      };
      this.router.navigate(['trip-registration-details'], navigationExtras);
    }else{
      this.onClose();
    }
  }

  onEditSession(sessionTime:SessionTime){
    console.log("Good onEditSession.");

    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId,
        sessionTime:sessionTime
      }
    };
    this.router.navigate(['session-time'], navigationExtras);
  }

  onAddSession(){
    console.log("Good onAddSession.");

    let sessionTime = new SessionTime();
    sessionTime.courseRegistrationId = this.registration.id;
    sessionTime.instructorId = this.registration.instructorId;
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId,
        sessionTime:sessionTime
      }
    };
    this.router.navigate(['session-time'], navigationExtras);
  }

  onDeleteSessionTime(sessionTime:SessionTime){
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to delete this session?'),
      this.utils.formatDate(sessionTime.startTime) + " to " + this.utils.formatDate(sessionTime.endTime), null,
      this.translateUtil.translateKey('No'), null,
      this.translateUtil.translateKey('Yes'),
      (data) => {
        this.l_deleteSessionTime(sessionTime);
      });
  }

  l_deleteSessionTime(sessionTime:SessionTime){
    console.log("Delete sessionTime by id: " + sessionTime.id);
    this.providerService.s_removeSessionTime(this.appSession.l_getUserId(), sessionTime.id, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Session removed.");
      }
      this.updatePageContent();
    });
  }

  async onSendEmail(){
    console.log("Good onSendEmail.");

    if (this.emailModal) {
      this.emailModal.dismiss();
    }

    this.emailModal = await this.modalCtrl.create({
      component: EmailNotificationPage,
      componentProps: {courseRegistrationId:this.registration.id, providerId:this.providerId},
    });
    await this.emailModal.present();
    const { data } = await this.emailModal.onDidDismiss();
  }


  onToggleInstructors(){
    console.log("Good onToggleCourseInstructors().");
    this.expendedInstructors = !this.expendedInstructors;
  }

  onDeleteInstructor(instructor){
    console.log("Good onDeleteCourseInstructor(instructor).");
    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to remove this instructor from registration?", null, null, "Cancel", null, "Remove", () => {
      if(!instructor || !instructor.id || !this.registration.instructors){
        return;
      }
      for(let i=0; i<this.registration.instructors.length; i++){
        let tempInst = this.registration.instructors[i];
        if(tempInst.id===instructor.id){
          this.registration.instructors.splice(i, 1);
        }
      }
      this.providerService.deleteCourseRegistrationInstructor(this.userId, this.registrationId, instructor.id, (result:boolean) => {
        if(result){
          this.toastUtil.showToast("Registration instructor deleted.");
        }else{
          this.toastUtil.showToast("Delete registration instructor failed!");
        }
      });
    });
  }

  onAddInstructor(){
    console.log("Good onAddCourseInstructor.");
    this.providerService.s_getAllProviderInstructorWithDetailsForProvider(this.providerId, true, (instructors:InstructorWithDetails[]) => {
      if(!instructors || instructors.length===0){
        return;
      }
      this.showInstructorsSelection(instructors);
    });
  }


  async showInstructorsSelection(instructors:InstructorWithDetails[]){
    let inputs:any[] = [];
    for(let instructor of instructors){
      inputs.push({
        type: 'checkbox',
        label: instructor.name,
        value: instructor,
        checked: false
      });
    }

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey("Choose learn type"),
      inputs: inputs,
      buttons: [
        {
          text: this.translateUtil.translateKey("CANCEL"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey("CHOOSE"),
          handler: data => {
            console.log("Selected Choose. instructors: " + data);
            if(!this.registration.instructors){
              this.registration.instructors = [];
            }
            for(let instructor of data){
              if(this.registration.instructors.indexOf(instructor)<0){
                this.registration.instructors.push(instructor);
              }
            }
            if(this.registration.instructors.length>0){
              this.expendedInstructors = true;

              let instructorIds:number[] = [];
              for(let inst of this.registration.instructors){
                instructorIds.push(inst.id);
              }
              this.providerService.saveCourseRegistrationInstructors(this.userId, this.registrationId, instructorIds, (result:boolean) => {
                if(result){
                  this.toastUtil.showToast("Saved course instructors successfully.");
                }else{
                  this.toastUtil.showToast("Save course instructors failed!");
                }
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  onGoHome(){
    console.log("Going home page.");
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  async openMenu() {
    let buttons:any = [];

    buttons.push(
      {
        text: this.translateUtil.translateKey('Comments'),
        handler: () => {
          console.log('Comments clicked');
          let navigationExtras: NavigationExtras = {
            state: {
              providerId:this.providerId, entityTypeId:this.appConstants.COMMENT_TYPE_COURSE_REGISTRATION, entityId: this.registration.id
            }
          };
          this.router.navigate(['comments'], navigationExtras);
        },
      });

    let instructorId = this.appSession.l_getInstructorId(this.providerId);
    if(this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin() ||
      this.appSession.l_getUserId()===this.registration.userId || instructorId === this.registration.instructorId){
      if(this.registration && this.registration.tripRegistrationId>0){
        buttons.push(
          {
            text: this.translateUtil.translateKey('Back to trip registration'),
            handler: () => {
              console.log('Back to trip registration');
              this.backToTripRegistration();
            },
          }
        );
      }
      if(this.registration && this.registration.statusId!==this.appConstants.PAYMENT_CANCELLED_ID){
        buttons.push(
          {
            text: this.translateUtil.translateKey('Cancel Registration'),
            handler: () => {
              console.log('Cancel Registration');
              this.onCancelRegistration();
            },
          }
        );
      }
      if(this.registration && this.registration.statusId===this.appConstants.PAYMENT_CANCELLED_ID){
        buttons.push(
          {
            text: this.translateUtil.translateKey('Delete'),
            handler: () => {
              console.log('Delete clicked');
              this.onDelete();
            },
          }
        );
      }
    }

    if(this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin() ||
      instructorId === this.registration.instructorId) {
      buttons.push(
        {
          text: this.translateUtil.translateKey('Send Email'),
          handler: () => {
            console.log('Send Email');
            this.onSendEmail();
          },
        },
        {
          text: this.translateUtil.translateKey('Offline Paid'),
          handler: () => {
            console.log('Offline Paid clicked');
            this.onSetOfflinePaid();
          },
        }
      );
    }

    buttons.push(
      {
        text: this.translateUtil.translateKey('CLOSE'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('CLOSE clicked');
          this.onClose();
        },
      }
    );
    buttons.push(
      {
        text: this.translateUtil.translateKey('Home'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('Home clicked');
          this.onGoHome();
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

