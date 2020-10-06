import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonContent, IonRouterOutlet,
  ModalController,
  NavController,
  Platform
} from "@ionic/angular";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {AppSession} from "../../../../../services/app-session.service";
import {ProvidersService} from "../../../../../services/providers-service.service";
import {AppConstants} from "../../../../../services/app-constants.service";
import {TranslateUtil} from "../../../../../services/translate-util.service";
import {ToastUtil} from "../../../../../services/toast-util.service";
import {Utils} from "../../../../../services/utils.service";
import {SessionTime} from "../../../../../models/SessionTime";
import {BasicUserIdPage} from "../../../../BasicUserIdPage";
import * as moment from 'moment';
import {TripHill} from "../../../../../models/TripHill";
import {InstructorWithDetails} from "../../../../../models/InstructorWithDetails";
import {Subscription} from "rxjs";
import {CallbackValuesService} from "../../../../../services/callback-values.service";
import {NgForm} from "@angular/forms";
import {GeneralResponse} from '../../../../../models/transfer/GeneralResponse';

@Component({
  selector: 'app-session-time',
  templateUrl: './session-time.page.html',
  styleUrls: ['./session-time.page.scss'],

  providers: [
    SocialSharing,
  ],
})
export class SessionTimePage extends BasicUserIdPage implements OnDestroy {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  userId:number;
  submitted:boolean;
  endTimeError:string;

  targetDate:any;
  startTime:any;
  endTime:any;
  description:string;
  descriptionError:string;

  providerId:number;
  tripHills:TripHill[];

  sessionTime: SessionTime;
  expendedInstructors:boolean;
  providerInstructors:InstructorWithDetails[];

  canEdit:boolean = false;
  private subscription:Subscription;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public platform:Platform,
              private socialSharing: SocialSharing, private actionsheetCtrl:ActionSheetController, private callbackValues:CallbackValuesService,
              private alertCtrl:AlertController, private ionRouterOutlet:IonRouterOutlet,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.sessionTime = this.router.getCurrentNavigation().extras.state.sessionTime;

        this.providerService.s_getSkiInstructorsForProviderId(this.providerId, null, null, true, (insts:InstructorWithDetails[]) => {
          this.providerInstructors = insts;
        });

        if(this.sessionTime.id>0){
          this.providerService.getSessionTimeWithDetails(this.sessionTime.id, (sessionTime:SessionTime) => {
            if(sessionTime){
              this.sessionTime = sessionTime;
            }
          });
        }
      }
    });
  }

  ionViewWillEnter() {
    console.log("Good ionViewWillEnter.");
    if(!this.sessionTime){
      this.toastUtil.showToast("SessionTime is empty! ");
      this.onClose();
      return;
    }
    if(!this.sessionTime.courseId && !this.sessionTime.courseRegistrationId){
      this.toastUtil.showToast("CourseId and courseRegistrationId can not be both empty!");
      this.onClose();
      return;
    }
    if(this.sessionTime.courseId && this.sessionTime.courseRegistrationId){
      this.toastUtil.showToast("CourseId and courseRegistrationId can not be both non-empty!");
      this.onClose();
      return;
    }

    if(!this.providerId){
      this.toastUtil.showToast("providerId can not be empty!");
      this.onClose();
      return;
    }

    if(this.sessionTime.startTime && this.sessionTime.endTime){
      this.targetDate = this.utils.formatDateShort(this.sessionTime.startTime);
      this.startTime = this.utils.formatTimeOfDate(this.sessionTime.startTime);
      this.endTime = this.utils.formatTimeOfDate(this.sessionTime.endTime);
    }

    if(this.providerId){
      this.providerService.s_getTripHillsForProviderId(this.appSession.l_getUserId(), this.providerId, (hills:TripHill[]) => {
        this.tripHills = hills;
      });
    }

    if(this.appSession.l_isInstructor(this.providerId) || this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin()){
      this.canEdit = true;
    }else{
      this.canEdit = false;
    }

    this.updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    if(this.sessionTime){
      if(this.sessionTime.instructorId && this.sessionTime.instructorId>0){
        this.providerService.s_getSkiInstructorDetailsById(this.sessionTime.instructorId, (instructor:InstructorWithDetails) => {
          if(instructor){
            this.sessionTime.instructor = instructor;
          }
        });
      }else{
        this.sessionTime.instructor = null;
      }
    }
  }


  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  tripHillChanged(){
    if(!this.sessionTime){
      return;
    }
    if(!this.sessionTime.tripHillId){
      this.sessionTime.tripHillName = null;
    }else{
      for(let tripHill of this.tripHills){
        if(tripHill.id===this.sessionTime.tripHillId){
          this.sessionTime.tripHillName = tripHill.locationStr;
          return;
        }
      }
    }
  }

  async onChooseInstructor(){
    console.log("Good onChooseInstructor().");

    let inputs:any[] = [];
    for(let instructor of this.providerInstructors){
      inputs.push({
        type: 'radio',
        label: instructor.name,
        value: instructor,
        checked: false
      });
    }

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey("Choose session instructor"),
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
            if(data){
              let instructor:InstructorWithDetails = data;
              this.sessionTime.instructorId = instructor.id;
              this.providerService.s_setSessionTimeInstructorId(this.appSession.l_getUserId(), this.sessionTime.id, instructor.id, (result:boolean) =>{
                if(result){
                  this.toastUtil.showToastTranslate("Set instructor successfully.");
                }else{
                  this.toastUtil.showToastTranslate("Failed set instructor.");
                }
                this.updatePageContent();
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  onDeleteInstructor(){
    console.log("Good onDeleteInstructor().");
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to delete this instructor?'), null,
      null, this.translateUtil.translateKey('Cancel'), null, this.translateUtil.translateKey('Delete'),
      (data) => {
        this.sessionTime.instructorId = null;
        this.providerService.s_setSessionTimeInstructorId(this.appSession.l_getUserId(), this.sessionTime.id, -1, (result:boolean) =>{
          if(result){
            this.toastUtil.showToastTranslate("Delete instructor successfully.");
          }else{
            this.toastUtil.showToastTranslate("Failed deleting instructor.");
          }
          this.updatePageContent();
        });
      }
    );
  }


  onToggleExtraInstructors(){
    console.log("Good onToggleCourseInstructors().");
    this.expendedInstructors = !this.expendedInstructors;
  }

  onDeleteExtraInstructor(instructor){
    console.log("Good onDeleteCourseInstructor(instructor).");
    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to remove this instructor from sessionTime?", null, null, "Cancel", null, "Remove", () => {
      if(!instructor || !instructor.id || !this.sessionTime.instructors){
        return;
      }
      for(let i=0; i<this.sessionTime.instructors.length; i++){
        let tempInst = this.sessionTime.instructors[i];
        if(tempInst.id===instructor.id){
          this.sessionTime.instructors.splice(i, 1);
        }
      }
      this.providerService.deleteSessionTimeExtraInstructor(this.userId, this.sessionTime.id, instructor.id, (result:boolean) => {
        if(result){
          this.toastUtil.showToast("sessionTime instructor deleted.");
        }else{
          this.toastUtil.showToast("Delete sessionTime instructor failed!");
        }
      });
    });
  }

  onAddExtraInstructor(){
    console.log("Good onAddCourseInstructor.");

    this.showExtraInstructorsSelection(this.providerInstructors);
  }


  async showExtraInstructorsSelection(instructors:InstructorWithDetails[]){
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
            if(!this.sessionTime.instructors){
              this.sessionTime.instructors = [];
            }
            for(let instructor of data){
              if(this.sessionTime.instructors.indexOf(instructor)<0){
                this.sessionTime.instructors.push(instructor);
              }
            }
            if(this.sessionTime.instructors.length>0){
              this.expendedInstructors = true;

              let instructorIds:number[] = [];
              for(let inst of this.sessionTime.instructors){
                instructorIds.push(inst.id);
              }
              this.providerService.saveSessionTimeExtraInstructorIds(this.userId, this.sessionTime.id, instructorIds, (result:boolean) => {
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



  onSaveSessionTime(){
    this.submitted = true;

    if(!this.sessionTime.courseId && !this.sessionTime.courseRegistrationId){
      this.toastUtil.showToast("CourseId and courseRegistrationId can not be both null!");
      return;
    }
    if(this.sessionTime.courseId && this.sessionTime.courseRegistrationId){
      this.toastUtil.showToast("CourseId and courseRegistrationId can not be both have value!");
      return;
    }
    // if(!this.sessionTime.instructorId){
    //   this.toastUtil.showToast("SessionTime must has assigned instructor!");
    //   return;
    // }

    if(this.sessionTime.description && this.sessionTime.description.length>1000){
      this.descriptionError = this.translateUtil.translateKey("Description maximum 1000 characters.");
    }else{
      this.descriptionError = null;
    }

    if(this.targetDate && this.startTime && this.endTime){
      this.targetDate = this.utils.formatDateShort(this.targetDate);
      this.startTime = this.utils.formatTimeOfDate(this.startTime);
      this.endTime = this.utils.formatTimeOfDate(this.endTime);

      this.sessionTime.startTime = this.utils.combineTime(this.targetDate, this.startTime);
      this.sessionTime.endTime = this.utils.combineTime(this.targetDate, this.endTime);

      if(this.sessionTime.startTime && this.sessionTime.endTime && moment(this.sessionTime.startTime).isAfter(moment(this.sessionTime.endTime))){
        this.endTimeError = "Start time must before end time.";
        return;
      }

      let error = this.utils.validateStartEndTime(this.sessionTime.startTime, this.sessionTime.endTime);
      if(error){
        this.toastUtil.showToastTranslate(error);
        return;
      }
    }

    this.providerService.saveSessionTime(this.appSession.l_getUserId(), this.sessionTime, (genResponse:GeneralResponse) => {
      if(genResponse){
        if(genResponse.code===0){
          this.toastUtil.showToast("SesstionTime saved successfully. ");
          this.sessionTime = genResponse.resultObject;

          this.updatePageContent();
          this.onClose();
        }else if(genResponse.code===-100){
          let alertStr = "<ul>";
          for(let conflictSessionTime of genResponse.resultObject){
            alertStr = alertStr + "<li>" + this.utils.formatDate(conflictSessionTime.startTime) + " to " + this.utils.formatTimeOfDate(conflictSessionTime.endTime);
          }
          this.utils.showOkAlert(this.alertCtrl, "Conflict instructor time:", alertStr);

        }else if(genResponse.code===-200){
          let alertStr = "<ul>";
          for(let sessionTime of genResponse.resultObject){
            alertStr = alertStr + "<li>" + this.utils.formatDate(sessionTime.startTime) + " to " + this.utils.formatTimeOfDate(sessionTime.endTime);
          }
          this.utils.showOkAlert(this.alertCtrl, "Conflict existing session time:", alertStr);
        }else{
          this.toastUtil.showToast("Unknown answer for saving session time.");
        }
      }else{
        this.toastUtil.showToast("Got no answer for saving session time.");
      }
    });
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onViewCourse(courseId:number){
    console.log("Good onViewCourse().");
    let navigationExtras: NavigationExtras = {
      state: {
        courseId:courseId,
        providerId:this.providerId
      }
    };
    this.router.navigate(['ski-course-details'], navigationExtras);
  }


  onViewCourseRegistration(courseRegistrationId:number){
    console.log("Good onViewCourseRegistration().");
    let navigationExtras: NavigationExtras = {
      state: {
        registrationId: courseRegistrationId, providerId:this.providerId
      }
    };
    this.router.navigate(['ski-course-registration-details'], navigationExtras);
  }

  onDeleteSessionTime(){
    console.log("Good deleteSessionTime.");
    this.utils.showAlertConfirm(this.alertCtrl, "Delete this sessionTime?", null, null, "Cancel", null, "Delete", () => {
      this.providerService.deleteSessionTime(this.userId, this.sessionTime.id, (result:boolean) => {
        if(result){
          this.toastUtil.showToast("SessionTime deleted.");
          this.onClose();
        }else{
          this.toastUtil.showToast("Delete SessionTime failed!");
        }
      });
    });
  }

  async openMenu() {
    let buttons:any = [];
    if(this.canEdit){
      buttons.push(
        {
          text: this.translateUtil.translateKey('Save'),
          // role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('onSelect clicked');
            if(!this.formRef){
              console.log("Can not find formRef!");
            }else{
              this.submitted = true;
              this.formRef.ngSubmit.emit("ngSubmit");
              console.log('Save clicked finished.');
            }
          },
        }
      );

      buttons.push(
        {
          text: this.translateUtil.translateKey('Delete'),
          // role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Delete clicked');
            this.onDeleteSessionTime();
          },
        }
      );
    }

    buttons.push(
      {
        text: this.translateUtil.translateKey('Close'),
        handler: () => {
          console.log('Close clicked');
          this.onClose();
        }
      },
    );

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
