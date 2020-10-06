import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../../BasicUserIdPage';
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController, Platform} from '@ionic/angular';
import {NgForm} from '@angular/forms';
import {Provider} from '../../../../models/Provider';
import {AppSession} from '../../../../services/app-session.service';
import {AppConstants} from '../../../../services/app-constants.service';
import {ToastUtil} from '../../../../services/toast-util.service';
import {ProvidersService} from '../../../../services/providers-service.service';
import {Utils} from '../../../../services/utils.service';
import {TranslateUtil} from '../../../../services/translate-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DateTimeUtils} from '../../../../services/date-time-utils.service';
import {CodeTableService} from '../../../../services/code-table-service.service';
import {CourseUtil} from '../../../../services/course-util.service';
import {Schedule} from '../../../../models/schedule/Schedule';
import {ScheduleService} from '../../../../services/schedule.service';
import {LearnType} from '../../../../models/code/LearnType';
import {ProviderCourseTypeWithDetails} from '../../../../models/ProviderCourseTypeWithDetails';
import {TripHill} from '../../../../models/TripHill';
import {Recurrence} from "../../../../models/schedule/Recurrence";
import {RecurrenceType} from "../../../../models/code/RecurrenceType";
import {TimeSlot} from "../../../../models/schedule/TimeSlot";
import {ScheduleType} from "../../../../models/code/ScheduleType";
import {Course} from "../../../../models/Course";
import * as moment from 'moment';

@Component({
  selector: 'app-schedule-edit',
  templateUrl: './schedule-edit.page.html',
  styleUrls: ['./schedule-edit.page.scss'],
})
export class ScheduleEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;
  private submitted:boolean = false;
  private confirmedLeave:boolean = false;

  userId:number;
  instructorId:number;
  providerId:number;
  provider:Provider;
  scheduleId:number;
  schedule:Schedule;

  providerLearnTypes:LearnType[];
  providerCourseTypes:ProviderCourseTypeWithDetails[];
  providerTripHills:TripHill[];

  myCourses:Course[];

  scheduleTypes:ScheduleType[];
  recurrenceTypes:RecurrenceType[];
  tempId = -1;

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public platform:Platform,
              private actionsheetCtrl:ActionSheetController, public dateTimeUtils:DateTimeUtils, private scheduleService:ScheduleService,
              private codeTableService:CodeTableService, private courseUtil:CourseUtil, private ionRouterOutlet:IonRouterOutlet,
              private alertCtrl:AlertController,) {
    super(appSession, router, appConstants);
    // super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();
    this.codeTableService.getRecurrenceTypes((recurrenceTypes:RecurrenceType[]) => {
      this.recurrenceTypes = recurrenceTypes;
    });
    this.codeTableService.getScheduleTypes((scheduleTypes:ScheduleType[]) => {
      this.scheduleTypes = scheduleTypes;
    });

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if(this.router.getCurrentNavigation()&& this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.scheduleId = this.router.getCurrentNavigation().extras.state.scheduleId;
        this.schedule = this.router.getCurrentNavigation().extras.state.schedule;
        if(this.schedule && !this.schedule.scheduleTypeId){
          this.schedule.scheduleTypeId = this.appConstants.SCHEDULE_TYPE_TIME;
        }

        this.instructorId = this.appSession.l_getInstructorId(this.providerId);
      }
    });
  }

  ngOnInit() {
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
      this.codeTableService.getLearnType((learnTypes:LearnType[]) => {
        this.providerLearnTypes = learnTypes;
      });
      this.providerService.s_getProviderCourseTypesByProviderId(this.providerId, true, (pcTypes:ProviderCourseTypeWithDetails[]) => {
        this.providerCourseTypes = pcTypes;

        let groupType = this.codeTableService.getCourseTypeWithName("group");
        if(groupType){
          // remove group courseType;
          let tempPcTypes = [];
          for(let pcType of this.providerCourseTypes){
            if(pcType.courseTypeCodeId!==groupType.id){
              tempPcTypes.push(pcType);
            }
          }
          this.providerCourseTypes = tempPcTypes;
        }
      });
      this.providerService.s_getTripHillsForProviderId(this.userId, this.providerId, (tripHills:TripHill[] ) => {
        this.providerTripHills = tripHills;
      });
    }
    if(this.schedule){
      if(this.schedule.id>0){
        this.scheduleId = this.schedule.id;
      }
      this.processRecurrencesTypes();
    }else{
      if(this.scheduleId){
        this.scheduleService.getScheduleWithDetailsById(this.scheduleId, (schedule:Schedule) => {
          this.schedule = schedule;
          this.processRecurrencesTypes();
        });
      }
    }
  }

  onViewTimeSlot(recurrence:Recurrence, timeSlot:TimeSlot){
    console.log("Good onViewTimeSlot(timeSlot).");
    if(!recurrence || !timeSlot){
      return;
    }
    if(!recurrence.selectedTimeSlot){
      recurrence.selectedTimeSlot = timeSlot;
    }else{
      recurrence.selectedTimeSlot = null;
    }
  }

  // moment('7:00 am', ['h:m a', 'H:m']); // Wed Dec 30 2015 07:00:00 GMT-0600 (CST)
  // moment('17:00', ['h:m a', 'H:m']);   // Wed Dec 30 2015 17:00:00 GMT-0600 (CST)
  // moment('17:00 am', ['h:m a', 'H:m']);// Wed Dec 30 2015 17:00:00 GMT-0600 (CST)
  // moment('17:00 pm', ['h:m a', 'H:m']);// Wed Dec 30 2015 17:00:00 GMT-0600 (CST)
  processTimeSlot(){
    if(this.schedule && this.schedule.recurrences){
      for(let recurrence of this.schedule.recurrences){
        if(recurrence.timeSlots && recurrence.timeSlots.length>0){
          for(let timeSlot of recurrence.timeSlots){
            timeSlot.startTime = moment(timeSlot.startTime, ['h:m a', 'H:m']).toISOString();
            timeSlot.endTime = moment(timeSlot.endTime, ['h:m a', 'H:m']).toISOString();
          }
        }
      }
    }
  }

  processRecurrencesTypes(){
    this.processTimeSlot();

    if(!this.schedule || !this.recurrenceTypes || !this.schedule.recurrences){
      return;
    }
    for(let recType of this.recurrenceTypes){
      recType.recurrences = [];
      for(let recurrence of this.schedule.recurrences){
        if(recurrence.recurrenceTypeId===recType.id){
          recType.recurrences.push(recurrence);
        }
      }
    }
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  l_scrollToId(id:string):boolean{
    let element = document.getElementById(id);
    if(!element){
      return false;
    }
    let yOffset = document.getElementById(id).offsetTop;
    console.log("scrollX: " + yOffset);
    this.content.scrollToPoint(0, yOffset, 100);
    return true;
  }

  onToggleRecurrence(recurrenceType:RecurrenceType){
    if(!recurrenceType){
      return;
    }
    recurrenceType.expended = !recurrenceType.expended;
    if(!recurrenceType.recurrences){
      recurrenceType.recurrences = [];
      let recurrence = new Recurrence();
      recurrence.recurrenceTypeId = recurrenceType.id;
    }
  }

  onAddRecurrence(recurrenceType:RecurrenceType){
    console.log("Good onAddRecurrence.");
    let recurrence = new Recurrence();
    recurrence.scheduleId = this.schedule.id;
    recurrence.recurrenceTypeId = recurrenceType.id;
    recurrence.tempId = this.tempId--;

    if(!recurrenceType.recurrences){
      recurrenceType.recurrences = [];
    }
    recurrenceType.recurrences.push(recurrence);
    recurrenceType.selectedRecurrence = recurrence;

    if(!this.schedule.recurrences){
      this.schedule.recurrences = [];
    }
    this.schedule.recurrences.push(recurrence);
  }

  onDeleteRecurrence(recurrenceType:RecurrenceType, recurrence:Recurrence){
    if(!recurrence){
      return;
    }

    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete this recurrence?", null, null, "Cancel", null, "Delete",
      () => {
        console.log("Good onDeleteRecurrence.");
        if(recurrenceType && recurrenceType.recurrences){
          for(let i=0; i<recurrenceType.recurrences.length; i++){
            let tempRecur = recurrenceType.recurrences[i];
            if(tempRecur.id===recurrence.id || tempRecur.tempId===recurrence.tempId){
              recurrenceType.recurrences.splice(i, 1);
            }
          }
        }
        recurrenceType.selectedRecurrence = null;

        if(this.schedule && this.schedule.recurrences){
          for(let i=0; i<this.schedule.recurrences.length; i++){
            let tempRecur = this.schedule.recurrences[i];
            if(tempRecur.id===recurrence.id || tempRecur.tempId===recurrence.tempId){
              this.schedule.recurrences.splice(i, 1);
            }
          }
        }
        if(recurrence.id>0){
          this.scheduleService.deleteRecurrence(recurrence.id, (result:boolean) => {
            if(result){
              this.toastUtil.showToast("Recurrence deleted.");
            }else{
              this.toastUtil.showToast("Delete Recurrence failed.");
            }
          });
        }
        recurrenceType.selectedRecurrence = null;
      });
  }

  onViewRecurrence(recType:RecurrenceType, recurrence:Recurrence){
    console.log("Good onViewDetailsRecurrence.");

    if(!recType || !recurrence){
      return;
    }
    if(!recType.selectedRecurrence){
      recType.selectedRecurrence = recurrence;
    }else{
      recType.selectedRecurrence = null;
    }
  }

  deleteDeadline(recurrence:Recurrence){
    if(!recurrence){
      return;
    }
    recurrence.deadline = null;
  }

  onDeleteTimeSlot(recurrence:Recurrence, timeSlot:TimeSlot){
    console.log("Good onDeleteTimeSlot.");
    if(!recurrence || !timeSlot){
      return;
    }
    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete this time slot?", null, null, "Cancel", null, "Delete",
      () => {
        if(recurrence.timeSlots){
          for(let i=0; i<recurrence.timeSlots.length; i++){
            let tempTimeSlot = recurrence.timeSlots[i];
            if(tempTimeSlot.id===timeSlot.id || tempTimeSlot.tempId===timeSlot.tempId){
              recurrence.timeSlots.splice(i, 1);
            }
          }
        }
        recurrence.selectedTimeSlot = null;

        if(timeSlot.id>0){
          this.scheduleService.deleteTimeSlot(timeSlot.id, (result:boolean) => {
            if(result){
              this.toastUtil.showToast("TimeSlot deleted.");
            }else{
              this.toastUtil.showToast("Delete TimeSlot failed.");
            }
          });
        }
      });
  }

  onAddTimeSlot(recurrence:Recurrence){
    console.log("Good recurrence:Recurrence.");
    if(!recurrence){
      return;
    }
    if(!recurrence.timeSlots){
      recurrence.timeSlots = [];
    }
    let timeSlot = new TimeSlot();
    timeSlot.tempId = this.tempId--;
    timeSlot.recurrenceId = recurrence.id;
    timeSlot.minutesSlot = 60;
    timeSlot.minutesSpaceBefore = 0;
    timeSlot.minutesSpaceAfter = 0;
    recurrence.timeSlots.push(timeSlot);
    recurrence.selectedTimeSlot = timeSlot;
  }

  onDeleteLearnType(learnType:LearnType){
    console.log("Good onDeleteLearnType(learnType).");
    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete this learn type?", null, null, "Cancel", null, "Delete",
      () => {
        if(!this.schedule.id || this.schedule.id<=0 || !learnType || learnType.id || learnType.id<0) {
          this.schedule.learnTypes = this.utils.removeFromArray(learnType, this.schedule.learnTypes);
          return;
        }

        this.scheduleService.deleteScheduleLearnType(this.schedule.id, learnType.id, (result:boolean) => {
          if(result){
            this.schedule.learnTypes.splice(this.schedule.learnTypes.indexOf(learnType), 1);
            this.toastUtil.showToast("Deleted schedule learn type successfully.");
          }else{
            this.toastUtil.showToast("Delete schedule learn type failed.");
          }
        });
      });
  }

  async onAddLearnType(){
    console.log("Good onAddLearnType.");
    if(!this.providerLearnTypes){
      return;
    }
    let inputs:any[] = [];
    for(let learnType of this.providerLearnTypes){
      // if not exist in existing availableTripHills;
      let notExist = true;
      if(this.schedule.learnTypes){
        for(let existLearnType of this.schedule.learnTypes){
          if(existLearnType.id===learnType.id){
            notExist = false;
            break;
          }
        }
      }
      if(notExist){
        inputs.push({
          type: 'checkbox',
          label: learnType.name,
          value: learnType,
          checked: false
        });
      }
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
            console.log("Selected Choose. learnTypes: " + data);
            if(!this.schedule.learnTypes){
              this.schedule.learnTypes = [];
            }
            for(let learnType of data){
              if(this.schedule.learnTypes.indexOf(learnType)<0){
                this.schedule.learnTypes.push(learnType);
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  onDeleteProviderCourseType(pcType:ProviderCourseTypeWithDetails){
    console.log("Good onDeleteProviderCourseType(pcType).");
    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete this program type?", null, null, "Cancel", null, "Delete",
      () => {
        if(!this.schedule.id || this.schedule.id<=0 || !pcType || pcType.id || pcType.id<0) {
          this.schedule.providerCourseTypes = this.utils.removeFromArray(pcType, this.schedule.providerCourseTypes);
          return;
        }

        this.scheduleService.deleteScheduleProviderCourseType(this.schedule.id, pcType.id, (result:boolean) => {
          if(result){
            this.schedule.providerCourseTypes.splice(this.schedule.providerCourseTypes.indexOf(pcType), 1);
            this.toastUtil.showToast("Deleted schedule program type successfully.");
          }else{
            this.toastUtil.showToast("Delete schedule program type failed.");
          }
        });
      });
  }

  async onAddProviderCourseType(){
    console.log("Good onAddProviderCourseType.");
    if(!this.providerCourseTypes){
      return;
    }
    let inputs:any[] = [];
    for(let pcType of this.providerCourseTypes){
      // if not exist in existing availableTripHills;
      let notExist = true;
      if(this.schedule.providerCourseTypes){
        for(let existPcType of this.schedule.providerCourseTypes){
          if(existPcType.id===pcType.id){
            notExist = false;
            break;
          }
        }
      }
      if(notExist){
        inputs.push({
          type: 'checkbox',
          label: pcType.name,
          value: pcType,
          checked: false
        });
      }
    }

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey("Choose program type"),
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
            console.log("Selected Choose. pcTypes: " + data);
            if(!data){
              return;
            }
            if(!this.schedule.providerCourseTypes){
              this.schedule.providerCourseTypes = [];
            }
            for(let pcType of data){
              if(this.schedule.providerCourseTypes.indexOf(pcType)<0){
                this.schedule.providerCourseTypes.push(pcType);
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  onDeleteTripHill(tripHill:TripHill){
    console.log("Good onDeleteTripHill(tripHill).");
    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete this trip hill?", null, null, "Cancel", null, "Delete",
      () => {
        if(!this.schedule.id || this.schedule.id<=0 || !tripHill || tripHill.id || tripHill.id<0) {
          this.schedule.tripHills = this.utils.removeFromArray(tripHill, this.schedule.tripHills);
          return;
        }

        this.scheduleService.deleteScheduleTripHill(this.schedule.id, tripHill.id, (result:boolean) => {
          if(result){
            this.schedule.tripHills.splice(this.schedule.tripHills.indexOf(tripHill), 1);
            this.toastUtil.showToast("Deleted schedule trip hill successfully.");
          }else{
            this.toastUtil.showToast("Delete schedule trip hill failed.");
          }
        });
      });
  }

  async onAddTripHill(){
    console.log("Good onAddTripHill.");
    if(!this.providerTripHills){
      return;
    }
    let inputs:any[] = [];
    for(let tripHill of this.providerTripHills){
      // if not exist in existing availableTripHills;
      let notExist = true;
      if(this.schedule.tripHills){
        for(let existTripHill of this.schedule.tripHills){
          if(existTripHill.id===tripHill.id){
            notExist = false;
            break;
          }
        }
      }
      if(notExist){
        inputs.push({
          type: 'checkbox',
          label: tripHill.locationStr,
          value: tripHill,
          checked: false
        });
      }
    }

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey("Choose trip hill"),
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
            console.log("Selected Choose. pcTypes: " + data);
            if(!this.schedule.tripHills){
              this.schedule.tripHills = [];
            }
            for(let tripHill of data){
              if(this.schedule.tripHills.indexOf(tripHill)<0){
                this.schedule.tripHills.push(tripHill);
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  onDeleteCourse(course:Course){
    console.log("Gooc onDeleteCourse.");
    if(!course){
      return;
    }
    this.scheduleService.deleteScheduleCourse(this.scheduleId, course.id, (result:boolean) => {
      if(!this.schedule.id || this.schedule.id<=0 || !course || course.id || course.id<0) {
        this.schedule.courses = this.utils.removeFromArray(course, this.schedule.courses);
        return;
      }

      if(result){
        this.schedule.courses.splice(this.schedule.courses.indexOf(course), 1);
        this.toastUtil.showToast("Schedule course deleted.");
      }else{
        this.toastUtil.showToast("Delete course failed.");
      }
    });
  }

  async onAddCourse(){
    console.log("Good onAddCourse.");
    if(!this.myCourses){
      this.providerService.s_getCoursesForInstructorId(this.providerId, this.instructorId, this.appConstants.COURSE_CREATED_FROM_INSTRUCTOR, true, null, (courses:Course[]) => {
        this.myCourses = courses;
        this.showCoursesPopup();
      });
    }else{
      this.showCoursesPopup();
    }
  }

  async showCoursesPopup(){
    let inputs:any[] = [];
    if(!this.myCourses || this.myCourses.length===0){
      return;
    }

    for(let course of this.myCourses){
      // if not exist in existing availableTripHills;
      let notExist = true;
      if(this.schedule.courses){
        for(let existCourse of this.schedule.tripHills){
          if(existCourse.id===course.id){
            notExist = false;
            break;
          }
        }
      }
      if(notExist){
        inputs.push({
          type: 'checkbox',
          label: course.name,
          value: course,
          checked: false
        });
      }
    }

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey("Choose course"),
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
            console.log("Selected Choose. course: " + data);
            if(!this.schedule.courses){
              this.schedule.courses = [];
            }
            for(let course of data){
              if(this.schedule.courses.indexOf(course)<0){
                this.schedule.courses.push(course);
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  deleteOnDate(recurrence:Recurrence){
    if(recurrence){
      recurrence.onDate = null;
    }
  }

  saveSchedule(formRef:NgForm) {
    console.log("save called good.");
    this.submitted = true;

    if(!this.appSession.l_getUserInfo() && !this.appSession.l_isInstructor(this.providerId)){
      this.toastUtil.showToastTranslate("Instructor only!");
      return;
    }

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
      return;
    }

    if(!this.schedule.scheduleTypeId || this.schedule.scheduleTypeId<=0){
      // by default use time schedule:
      this.schedule.scheduleTypeId = this.appConstants.SCHEDULE_TYPE_TIME;
      // this.toastUtil.showToast("Schedule type can not be empty!");
      // return;
    }

    if(!this.schedule.userId){
      this.schedule.userId = this.userId;
    }
    if(!this.schedule.providerId){
      this.schedule.providerId = this.providerId;
    }
    if(!this.schedule.instructorId){
      this.schedule.instructorId = this.instructorId;
    }

    if(!this.schedule.learnTypes || this.schedule.learnTypes.length===0){
      this.toastUtil.showToast("Learn types can not be empty!");
      return;
    }
    if(!this.schedule.providerCourseTypes || this.schedule.providerCourseTypes.length===0){
      this.toastUtil.showToast("Program types can not be empty!");
      return;
    }
    if(!this.schedule.tripHills || this.schedule.tripHills.length===0){
      this.toastUtil.showToast("Trip hill can not be empty!");
      return;
    }

    if(this.schedule.recurrences && this.schedule.recurrences.length>0){
      for(let recurrence of this.schedule.recurrences){
        if(!recurrence.validFrom && recurrence.recurrenceTypeId!==this.appConstants.RECURRENCE_TYPE_ONDATE){
          this.toastUtil.showToast("Recurrence " + recurrence.title + " valid from can not be empty.");
          return;
        }
        if(!recurrence.validTo && recurrence.recurrenceTypeId!==this.appConstants.RECURRENCE_TYPE_ONDATE){
          this.toastUtil.showToast("Recurrence " + recurrence.title + " valid to can not be empty.");
          return;
        }
        if(!recurrence.onDate){
          this.toastUtil.showToast("Recurrence " + recurrence.title + " on (start) date can not be empty.");
          return;
        }
        if(moment(recurrence.validFrom).isAfter(moment(recurrence.validTo))){
          this.toastUtil.showToast("Recurrence valid from can not be after valid to!");
          return;
        }
        if(moment(recurrence.validTo).isBefore(moment(new Date()))){
          this.toastUtil.showToast("Recurrence valid to is in the past!");
          return;
        }
        if(recurrence.recurrenceTypeId===this.appConstants.RECURRENCE_TYPE_MONTHLY &&
          (!recurrence.fromDayOfMonth || !recurrence.toDayOfMonth ||
            recurrence.fromDayOfMonth<0 || recurrence.toDayOfMonth<0 ||
            recurrence.fromDayOfMonth>31 || recurrence.toDayOfMonth>31)){
          this.toastUtil.showToast("Monthly recurrence " + recurrence.title + " from Day Of Month and to day of month must between 1 and 31");
          return;
        }
        if(recurrence.recurrenceTypeId===this.appConstants.RECURRENCE_TYPE_YEARLY &&
          (!recurrence.fromDayOfYear || !recurrence.toDayOfYear ||
            recurrence.fromDayOfYear<1 || recurrence.toDayOfYear<1 ||
            recurrence.fromDayOfYear>366 || recurrence.toDayOfYear>366)){
          this.toastUtil.showToast("Yearly recurrence " + recurrence.title + " from day of year and to day of year must between 1 and 366");
          return;
        }
        if(!recurrence.timeSlots || recurrence.timeSlots.length===0){
          this.toastUtil.showToast("Recurrence " + recurrence.title + " time slots can not be empty.", null);
          return;
        }
        for(let timeslot of recurrence.timeSlots){
          if(moment(timeslot.startTime).isAfter(moment(timeslot.endTime))){
            this.toastUtil.showToastLongTime("Timeslot start time can not be after endTime!");
            return;
          }
          if(timeslot.minutesSlot < timeslot.minutesSpaceBefore + timeslot.minutesSpaceAfter){
            this.toastUtil.showToastLongTime("Timeslot expand minutes can not be less than before space minutes plus after space minutes!");
            return;
          }
          if(timeslot.minutesSlot < 0 || timeslot.minutesSpaceBefore <0 || timeslot.minutesSpaceAfter <0){
            this.toastUtil.showToastLongTime("Timeslot expand minutes, before space minutes or after space minutes can not be negative.");
            return;
          }
        }
      }
    }

    this.scheduleService.createOrUpdateSchedule(this.userId, this.schedule, (savedSchedule:Schedule) => {
      if(savedSchedule){
        this.toastUtil.showToast("Saved schedule successfully.");
        this.schedule = savedSchedule;
      }else{
        this.toastUtil.showToast("Save schedule failed.");
      }
      this.onClose();
    });
  }

  ionViewCanLeave(){
    if (this.formRef.dirty && !this.confirmedLeave) {
      this.onCancelPage();
      return false;
    }else{
      return true;
    }
  }

  onCancelPage(){
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null, this.translateUtil.translateKey('CANCEL'), null,
        this.translateUtil.translateKey('DISCARD'),
        (data) => {
          this.confirmedLeave = true;
          this.navCtrl.pop();
        });
    }else{
      this.navCtrl.pop();
    }
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  onSave(){
    console.log('To submit form.');
    if(!this.formRef){
      console.log("Can not find formRef!");
    }else{
      this.formRef.ngSubmit.emit("ngSubmit");
      console.log('Save clicked finished.');
    }
  }

  onDeleteSchedule(){
    console.log("Good onDeleteSchedule.");
    if(!this.schedule.id){
      this.schedule = null;
      this.onClose();
      return;
    }

    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete this schedule?", "All recurrences and " +
      "recurrences will be deleted too.", null, "Cancel", null, "Delete", () => {
      this.scheduleService.deleteSchedule(this.schedule.id, (result:boolean) => {
        if(result){
          this.toastUtil.showToast("Schedule deleted successfully.");
        }else{
          this.toastUtil.showToast("Delete schedule failed.");
        }
        this.onClose();
      });
    });
  }

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            this.onSave();
          }
        },
        {
          text: this.translateUtil.translateKey('Delete'),
          handler: () => {
            this.onDeleteSchedule();
          }
        },
        {
          text: this.translateUtil.translateKey('Cancel'),
          handler: () => {
            this.onCancelPage();
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
