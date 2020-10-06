import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../../BasicUserIdPage';
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, ModalController, NavController} from '@ionic/angular';
import {AppSession} from '../../../../services/app-session.service';
import {AppConstants} from '../../../../services/app-constants.service';
import {ToastUtil} from '../../../../services/toast-util.service';
import {ProvidersService} from '../../../../services/providers-service.service';
import {Utils} from '../../../../services/utils.service';
import {TranslateUtil} from '../../../../services/translate-util.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {ScheduleService} from '../../../../services/schedule.service';
import {RecurrenceInstance} from '../../../../models/schedule/RecurrenceInstance';
import {Schedule} from '../../../../models/schedule/Schedule';
import {Recurrence} from '../../../../models/schedule/Recurrence';
import {ChooseRecurrenceRequest} from '../../../../models/transfer/ChooseRecurrenceRequest';
import {SessionTime} from '../../../../models/SessionTime';
import {HourTripHill} from "../../../../models/HourTripHill";
import * as moment from "moment";
import {ProviderCourseTypeWithDetails} from '../../../../models/ProviderCourseTypeWithDetails';
import {LearnType} from '../../../../models/code/LearnType';
import {TripHill} from '../../../../models/TripHill';
import {CourseRegistration} from '../../../../models/CourseRegistration';
import {GuestCheckoutPage} from '../../guest-checkout/guest-checkout.page';
import {InstructorWithDetails} from '../../../../models/InstructorWithDetails';
import {TimeSlot} from "../../../../models/schedule/TimeSlot";
import {DateTimeUtils} from "../../../../services/date-time-utils.service";

@Component({
  selector: 'app-schedule-book',
  templateUrl: './schedule-book.page.html',
  styleUrls: ['./schedule-book.page.scss'],
})
export class ScheduleBookPage extends BasicUserIdPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  providerId:number = null;
  userId:number = null;
  isViewCourseForTime:boolean = false;
  availableHourHills:HourTripHill[] = [];
  selectedHourHills:HourTripHill[] = [];

  onDate:any;
  queryRequest:ChooseRecurrenceRequest;
  searchUserId:number;
  searchInstructorId:number;
  searchInstructor:InstructorWithDetails;

  // search result:
  recurrence:Recurrence;
  schedule:Schedule;
  recurrenceInstance:RecurrenceInstance;  // auto select first non-blocked recurrence;
  recurrenceInstancesBlocked:RecurrenceInstance[]; // auto select first blocked recurrence;
  existingSessionTimes:SessionTime[];

  selectedProgramType:ProviderCourseTypeWithDetails;
  selectedTripHill:TripHill;
  selectedLearnType:LearnType;

  instructor:InstructorWithDetails;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, private dateTimeUtil:DateTimeUtils,
              private actionsheetCtrl:ActionSheetController, private ionRouterOutlet:IonRouterOutlet,
              private scheduleService:ScheduleService, private alertCtrl:AlertController, private modalController:ModalController,) {
    super(appSession, router, appConstants);

    this.userId = this.appSession.l_getUserId();
    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.searchUserId = this.router.getCurrentNavigation().extras.state.searchUserId;
        this.searchInstructorId = this.router.getCurrentNavigation().extras.state.searchInstructorId;
        this.onDate = this.router.getCurrentNavigation().extras.state.onDate;
      }
      if(this.searchInstructorId>0){
        this.providerService.s_getSkiInstructorDetailsById(this.searchInstructorId, (instructor:InstructorWithDetails) => {
          if(!instructor){
            this.toastUtil.showToastTranslate("Can not find the instructor!");
            this.router.navigate([this.appConstants.ROOT_PAGE]);
            return;
          }
          this.instructor = instructor;
        });
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(!this.providerId) {
      this.toastUtil.showToastTranslate("Empty provider!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    if(!this.searchUserId){
      this.toastUtil.showToastTranslate("Empty search user!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    if(!this.searchInstructorId){
      this.toastUtil.showToastTranslate("Empty search instructor!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    this.updatePageContent();
  }

  ionViewDidEnter() {
  }

  ionViewCanLeave() {
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  ngOnDestroy(){
  }

  updatePageContent(){
    if(this.appSession.l_getUserId() && this.appSession.l_hasAboveInstructorAccess(this.providerId)){
      this.isViewCourseForTime = true;
    }
    
    this.onSearch();
  }

  showToolBar(){
    if(this.schedule && this.schedule.providerCourseTypes && this.schedule.providerCourseTypes.length>0){
      return true;
    }
    if(this.schedule && this.schedule.learnTypes && this.schedule.learnTypes.length>0){
      return true;
    }
    if(this.schedule && this.schedule.tripHills && this.schedule.tripHills.length>0){
      return true;
    }

    return false;
  }

  onSearch(){
    this.reset();
    this.selectedHourHills = [];
    this.availableHourHills = [];

    console.log("Good onSearch().");
    if(!this.providerId || this.providerId<=0){
      console.log("School empty!.");
      return;
    }
    if(!this.searchUserId || this.searchUserId<=0){
      console.log("Can not find search user.");
      return;
    }
    if(!this.onDate){
      console.log("Choose on date first.");
      return;
    }
    this.queryRequest = new ChooseRecurrenceRequest();
    this.queryRequest.providerId = this.providerId;
    this.queryRequest.fromUserId = this.userId;
    this.queryRequest.chosenDate = this.onDate;
    this.queryRequest.chosenUserId = this.searchUserId;
    this.queryRequest.withBlocked = true;
    this.scheduleService.queryInstructorSchedule(this.userId, this.queryRequest, (insts:RecurrenceInstance[]) => {
      if(!insts || insts.length===0){
        return;
      }
      for(let inst of insts){
        let valid:boolean = this.validRecurrenceInstance(inst);
        if(!valid){
          continue;
        }

        if(inst.blocked===true || inst.clonedRecurrence.blocked===true){
          if(!this.recurrenceInstancesBlocked){
            this.recurrenceInstancesBlocked = [];
          }
          this.recurrenceInstancesBlocked.push(inst);
        }else{
          if(!this.recurrenceInstance || this.comparePriority(inst, this.recurrenceInstance)>0){
            this.recurrenceInstance = inst;
          }
        }
      }

      if(this.recurrenceInstance){
        this.recurrence = this.recurrenceInstance.clonedRecurrence;
        this.schedule = this.recurrenceInstance.clonedSchedule;
        if(this.schedule){
          if(this.schedule.providerCourseTypes && this.schedule.providerCourseTypes.length>0){
            for(let pcType of this.schedule.providerCourseTypes){
              if(pcType.courseTypeCodeId === this.appConstants.CODE_COURSE_GROUP){
                this.schedule.providerCourseTypes.splice(this.schedule.providerCourseTypes.indexOf(pcType), 1);
              }
            }
          }

          if(this.schedule.tripHills && this.schedule.tripHills.length===1){
            this.selectedTripHill = this.schedule.tripHills[0];
          }
          if(this.schedule.learnTypes && this.schedule.learnTypes.length===1){
            this.selectedLearnType = this.schedule.learnTypes[0];
          }
          if(this.schedule.providerCourseTypes && this.schedule.providerCourseTypes.length===1){
            this.selectedProgramType = this.schedule.providerCourseTypes[0];
          }
        }

        this.providerService.s_getSessionsForInstructorOnDate(this.providerId, this.searchInstructorId, this.onDate, (sessionTimes:SessionTime[]) => {
          this.existingSessionTimes = sessionTimes;
          this.availableHourHills = this.getAvailableHoursFromInstructor();
        });
      }
      // this.availableHourHills = this.getAvailableHoursFromInstructor();
    });
  }

  public validRecurrenceInstance(inst:RecurrenceInstance):boolean{
    if(!inst){
      return false;
    }
    if(!inst.clonedSchedule || !inst.clonedSchedule.enabled){
      return false;
    }
    if(!inst.clonedRecurrence){
      return false;
    }else if(inst.clonedRecurrence.recurrenceTypeId!==this.appConstants.RECURRENCE_TYPE_ONDATE){
      if(!inst.clonedRecurrence.validFrom || !inst.clonedRecurrence.validTo || moment(inst.clonedRecurrence.validFrom).isAfter(moment(inst.clonedRecurrence.validTo))){
        return false;
      }
    }
    if(!inst.clonedRecurrence.timeSlots){
      return false;
    }
    for(let i=0; i<inst.clonedRecurrence.timeSlots.length; i++){
      let timeSlot = inst.clonedRecurrence.timeSlots[i];
      if(!timeSlot.startTime || !timeSlot.endTime) {
        inst.clonedRecurrence.timeSlots.splice(i, 1);
      }else{
        let startTime = moment(timeSlot.startTime, "HH:mm:ss a");
        let endTime = moment(timeSlot.endTime, "HH:mm:ss a");
        let isAfter:boolean = startTime.isAfter(endTime);
        if(isAfter){
          inst.clonedRecurrence.timeSlots.splice(i, 1);
        }
      }
    }
    if(inst.clonedRecurrence.timeSlots.length===0){
      return false;
    }
    return true;
  }

  // return value for priorities:
  // <0 when inst1 lower priority inst2; ==0 when inst1 equals to inst2; >0 when inst1 higher priority than inst2;
  public comparePriority(inst1:RecurrenceInstance, inst2:RecurrenceInstance):number{
    if(!inst1 || !inst1.clonedRecurrence || !inst1.clonedRecurrence.recurrenceTypeId){
      if(!inst2 || !inst2.clonedRecurrence || !inst2.clonedRecurrence.recurrenceTypeId){
        return 0;
      }
      return -1;
    }
    if(!inst2 || !inst2.clonedRecurrence || !inst2.clonedRecurrence.recurrenceTypeId){
      return 1;
    }
    if(inst1.clonedRecurrence.recurrenceTypeId < inst2.clonedRecurrence.recurrenceTypeId){
      return 1;
    }else if(inst1.clonedRecurrence.recurrenceTypeId > inst2.clonedRecurrence.recurrenceTypeId){
      return -1;
    }else{
      return 0;
    }
  }

  /** (highest)singleDay->yearly->monthly->weekly->daily. **/
  public getAvailableHoursFromInstructor():HourTripHill[]{

    if(!this.recurrence || !this.recurrence.timeSlots || this.recurrence.timeSlots.length===0){
      return null;
    }

    let blockedTimeSlots:TimeSlot[] = [];
    for(let blockedRecurrInst of this.recurrenceInstancesBlocked){
      if(blockedRecurrInst.clonedSchedule && blockedRecurrInst.clonedSchedule.enabled &&
        blockedRecurrInst.clonedRecurrence && blockedRecurrInst.clonedRecurrence.enabled &&
        blockedRecurrInst.clonedRecurrence.timeSlots && blockedRecurrInst.clonedRecurrence.timeSlots.length>0){
        blockedTimeSlots = blockedTimeSlots.concat(blockedRecurrInst.clonedRecurrence.timeSlots);
      }
    }

    console.log("this.recurrence.timeSlots.length: " + this.recurrence.timeSlots.length);
    console.log("this.existingSessionTimes.length: " + this.existingSessionTimes.length);
    console.log("blockedTimeSlots.length: " + blockedTimeSlots.length);

    let timeSlots = this.recurrence.timeSlots;
    timeSlots.sort((n1,n2)=> {
      let startTime1 = moment(n1.startTime, ['h:m a', 'H:m']);
      let startTime2 = moment(n2.startTime, ['h:m a', 'H:m']);
      let startHour1 = startTime1.get("hour");
      let startMinute1 = startTime1.get("minute");
      let startHour2 = startTime2.get("hour");
      let startMinute2 = startTime2.get("minute");
      if(startHour1===startHour2){
        if(startMinute1<startMinute2){
          return -1;
        }else{
          return 1;
        }
      }else if(startHour1<startHour2){
        return -1;
      }else{
        return 1;
      }
    });

    let sequence = 1;
    let hourTripHills:HourTripHill[] = [];
    for(let timeSlot of timeSlots){
      if(!timeSlot.startTime || !timeSlot.endTime){
        continue;
      }
      let startTime = moment(timeSlot.startTime, ['h:m a', 'H:m']);
      let endTime = moment(timeSlot.endTime, ['h:m a', 'H:m']);
      if(startTime.dayOfYear()!==endTime.dayOfYear()){
        continue;
      }

      let startHour = startTime.get("hour");
      let startMinute = startTime.get("minute");
      let endHour = endTime.get("hour");
      let endMinute = endTime.get("minute");

      while(startHour<endHour){
        if(startHour===(endHour-1) && startMinute>endMinute){
          break;
        }

        let hourTipHill = new HourTripHill();
        hourTipHill.sequence = sequence++;
        hourTipHill.deadLine = this.recurrence.deadline;
        hourTipHill.deadlineHoursBefore = this.recurrence.deadlineHoursBefore;
        hourTipHill.registerCode = this.recurrence.registerCode;
        hourTipHill.blocked = false;

        let minutesSlot = timeSlot.minutesSlot;
        let minutesBefore = timeSlot.minutesSpaceBefore;
        let minutesAfter = timeSlot.minutesSpaceAfter;
        if(minutesSlot>0 && minutesBefore>=0 && minutesAfter>=0 && minutesSlot > (minutesBefore + minutesAfter)){
          let startIncMinutes = startMinute + minutesBefore;
          hourTipHill.startHour = startHour + Math.floor((startMinute + startIncMinutes) / 60);
          hourTipHill.startMinute = (startMinute + startIncMinutes) % 60;

          let slotIncMinutes = startMinute + minutesSlot;
          let endIncMinutes = slotIncMinutes - minutesAfter;
          hourTipHill.endHour = startHour + Math.floor((startMinute + endIncMinutes) / 60);
          hourTipHill.endMinute = (startMinute + endIncMinutes) % 60;

        }else{
          hourTipHill.startHour = startHour;
          hourTipHill.startMinute = startMinute;
          hourTipHill.endHour = startHour+1;
          hourTipHill.endMinute = startMinute;
        }

        // check if blocked;
        if(blockedTimeSlots && blockedTimeSlots.length>0){
          for(let blockTimeSlot of blockedTimeSlots){
            let checkStartTime = moment({hour: startHour, minute: startMinute});
            let checkEndTime = moment({hour: startHour+1, minute: startMinute});

            let blockedStartTime = moment(blockTimeSlot.startTime, ['h:m a', 'H:m']);
            let blockedEndTime = moment(blockTimeSlot.endTime, ['h:m a', 'H:m']);

            if(checkStartTime.isBefore(blockedEndTime) && checkEndTime.isAfter(blockedStartTime)){
              hourTipHill.blocked = true;
            }
          }
        }

        if(this.existingSessionTimes.length>0){
          let hourTimeStart = moment(this.recurrenceInstance.day).set({hour:startHour,minute:startMinute,second:0,millisecond:0}).toDate();
          let hourTimeEnd = moment(this.recurrenceInstance.day).set({hour:startHour+1,minute:startMinute,second:0,millisecond:0}).toDate();
          for(let sessionTime of this.existingSessionTimes){
            if(hourTimeStart < moment(sessionTime.endTime).toDate() && hourTimeEnd > moment(sessionTime.startTime).toDate() ){
              // console.log("sessionTime reserved hour: " + hourTimeStart + " to " + hourTimeEnd);
              hourTipHill.occupied = true;
              hourTipHill.courseId = sessionTime.courseId;
              hourTipHill.sessionTimeId = sessionTime.id;
              break;
            }
          }
        }

        hourTripHills.push(hourTipHill);

        if(minutesSlot>0){
          let hourInc = Math.floor(minutesSlot / 60);
          let minsInc = minutesSlot % 60;
          if(hourInc<0){
            hourInc = 0;
          }
          if(minsInc<0){
            minsInc = 0;
          }
          startHour = startHour + hourInc + Math.floor((startMinute + minsInc)/60);
          startMinute = (startMinute + minsInc) % 60;
        }else{
          startHour = startHour + 1;
          startMinute = startMinute + 0;
        }
      }
    }

    this.sortHourTripHill(hourTripHills);
    return hourTripHills;
  }

  sortHourTripHill(hourTripHills:HourTripHill[]){
    if(hourTripHills){
      hourTripHills.sort((n1,n2)=> {
        if(n1.sequence<n2.sequence){
          return -1;
        }else{
          return 1;
        }
      });
    }
  }

  checkColor(hourHill:HourTripHill):string{
    if(!hourHill){
      return "primary";
    }
    if(hourHill.occupied){
      if(this.isViewCourseForTime){
        return "lightOrange";
      }else{
        return "primary";
      }
    }else if(hourHill.checked){
      return "success";
    }
    return "primary";
  }

  appendZero(t:number):string{
    if(!t || t<0){
      return "00";
    }
    let he:string = "" + t;
    if(he.length===1){
      he = "0" + he;
    }
    return he;
  }

  reset(){
    this.recurrence = null;
    this.schedule = null;
    this.recurrenceInstance = null;
    this.existingSessionTimes = [];
    this.recurrenceInstancesBlocked = [];

    this.selectedProgramType = null;
    this.selectedTripHill = null;
    this.selectedLearnType = null;
  }

  onDateChanged(){
    console.log("Good onDateChanged().");
    this.reset();
    this.updatePageContent();
  }

  onPCTypeChanged(){
    console.log("Good onPCTypeChanged().");
  }

  onLearnTypeChanged(){
    console.log("Good onLearnTypeChanged().");
  }

  onTripHillChanged(){
    console.log("onTripHillChanged.");
  }

  async onClickTimeSlot(hourHill:HourTripHill){
    console.log("Good onClickTimeSlot.");
    if(hourHill){
      if(hourHill.occupied){
        console.log("show sessionTime for hourHill. sessionTimeId: " + hourHill.sessionTimeId);
        if(hourHill.sessionTimeId>0){
          this.providerService.getSessionTimeWithDetails(hourHill.sessionTimeId,(sessionTime:SessionTime) => {
            if(sessionTime){
              let navigationExtras: NavigationExtras = {
                state: {
                  providerId:this.providerId,
                  sessionTime:sessionTime
                }
              };
              this.router.navigate(['session-time'], navigationExtras);
            }
          });
        }
        return;
      }else{
        if(hourHill.checked){
          hourHill.checked = false;
          this.selectedHourHills = this.utils.removeFromArray(hourHill, this.selectedHourHills);
        }else{

          // check if passed deadLine;
          let deadLineTime = null;
          let currentTime = moment();
          if(hourHill.deadLine){
            deadLineTime = moment(hourHill.deadLine);
          }else{
            if(hourHill.startHour!=null && hourHill.startMinute!=null){
              deadLineTime = moment(this.onDate).set('hour', hourHill.startHour).set('minute', hourHill.startMinute);
              deadLineTime.set({hour:hourHill.startHour,minute:0,second:0,millisecond:0});

              if(hourHill.deadlineHoursBefore) {
                deadLineTime = deadLineTime.add(-hourHill.deadlineHoursBefore, 'hours');
              }else{
                deadLineTime = deadLineTime.add(this.appConstants.DEADLINE_BEFORE_START_TIME, 'hours');
              }
            }
          }
          if(!deadLineTime || deadLineTime==null){
            this.toastUtil.showToastTranslate("Empty deadline.");
            return;
          }
          if(deadLineTime.isBefore(currentTime)){
            this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey("Deadline passed"), this.utils.formatDate(deadLineTime));
            return;
          }

          // check registerCode;
          if(hourHill.registerCode){
            let regCode:string = null;
            const alert = await this.alertCtrl.create({
              header: this.translateUtil.translateKey('Registration Code'),
              subHeader: this.translateUtil.translateKey("This schedule need code to register."),
              inputs: [
                {
                  name: 'code',
                  label: this.translateUtil.translateKey('Register Code'),
                  type: 'text',
                  placeholder: ''
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
                  text: this.translateUtil.translateKey('Enter'),
                  handler: data => {
                    regCode = data['code'];
                    if (regCode && regCode === hourHill.registerCode) {
                      // this.onRegister(hourHill);
                      hourHill.checked = true;
                      if (!this.utils.checkInArray(hourHill, this.selectedHourHills)) {
                        this.selectedHourHills.push(hourHill);
                      }
                    } else {
                      this.toastUtil.showToastTranslate("Wrong code, please try again.");
                    }
                  }
                }
              ]
            });
            await alert.present();
          }else{
            // this.onRegister(hourHill);
            hourHill.checked = true;
            if(!this.utils.checkInArray(hourHill, this.selectedHourHills)){
              this.selectedHourHills.push(hourHill);
            }
          }
        }
      }
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

  checkInSequence():boolean{
    if(!this.selectedHourHills || this.selectedHourHills.length===0){
      return true;
    }

    this.sortHourTripHill(this.selectedHourHills);

    let seq = -1;
    for(let hourHill of this.selectedHourHills){
      if(seq<0){
        seq = hourHill.sequence;
      }else{
        if(seq+1!==hourHill.sequence){
          return false;
        }
        seq = hourHill.sequence;
      }
    }

    return true;
  }

  disableBook(){
    if(!this.selectedHourHills || this.selectedHourHills.length===0){
      return true;
    }
    return false;
  }

  onBook(){
    console.log("Good onBook.");
    if(!this.selectedHourHills || this.selectedHourHills.length===0){
      return;
    }
    if(!this.checkInSequence()){
      this.utils.showOkAlert(this.alertCtrl, "Selected time slots must be adjacent.", null);
      return;
    }
    if(!this.selectedProgramType){
      this.toastUtil.showToast("Please select program type.");
      return;
    }
    if(!this.selectedLearnType){
      this.toastUtil.showToast("Please select learn type.");
      return;
    }
    if(!this.selectedTripHill){
      this.toastUtil.showToast("Please select hill.");
      return;
    }
    console.log("Good to registration.");
    this.l_toConfirm();
  }

  l_prepareRegistration():CourseRegistration{
    if(!this.checkInSequence()){
      return;
    }
    if(!this.selectedHourHills || this.selectedHourHills.length===0){
      this.toastUtil.showToast("Please select time slots first.");
      return;
    }

    let startHourHill:HourTripHill = this.selectedHourHills[0];
    let endHourHill:HourTripHill = this.selectedHourHills[this.selectedHourHills.length-1];

    let title = null;
    let name = null;
    if(this.appSession.l_getUserInfo()){
      title = "Registration for " + this.appSession.l_getUserInfo().name;
      name = this.appSession.l_getUserInfo().name;
    }else{
      title = "Registration for guest";
    }

    // let startHour:string = this.appendZero(startHourHill.startHour);
    // let startMinute:string = this.appendZero(startHourHill.startMinute);
    //
    // let endHour:string = this.appendZero(endHourHill.endHour);
    // let endMinute:string = this.appendZero(endHourHill.endMinute);

    // console.log("Register Choose. hour: " + startHour);
    let startTime = moment(this.onDate).set({hour:startHourHill.startHour,minute:startHourHill.startMinute,second:0,millisecond:0}).toDate();
    let endTime = moment(this.onDate).set({hour:endHourHill.endHour,minute:endHourHill.endMinute,second:0,millisecond:0}).toDate();
    // let startTime = this.utils.formatDateLong(moment(this.utils.formatDateShort(this.onDate), startHour, startMinute).toDate());sdf;
    // let endTime = this.utils.formatDateLong(moment(this.utils.formatDateShort(this.onDate), endHour, endMinute).toDate());
    // create registration;
    let registrationRequest = new CourseRegistration();
    registrationRequest.title = title;
    registrationRequest.learnTypeId = this.selectedLearnType.id;
    registrationRequest.providerCourseTypeId = this.selectedProgramType.id;
    registrationRequest.providerCourseType = this.selectedProgramType;
    registrationRequest.tripHillId = this.selectedTripHill.id;
    registrationRequest.providerId = this.providerId;
    registrationRequest.instructorId = this.searchInstructorId;
    registrationRequest.userId = this.appSession.l_getUserId();
    registrationRequest.tripHillName = this.selectedTripHill.locationStr;
    registrationRequest.registerName = name;
    registrationRequest.instructorName = (this.searchInstructor==null?null:this.searchInstructor.name);
    registrationRequest.tripRegistrationId = null;
    registrationRequest.tripId = null;
    registrationRequest.fromSchedule = true;
    registrationRequest.comments = "From schedule: " + this.schedule.title + ", recurrence: " + this.recurrence.title;
    registrationRequest.recurrenceId = this.recurrence.id;

    let sessionTimes:SessionTime[] = [];
    for(let hourTripHill of this.selectedHourHills){
      let sessionTime = new SessionTime();
      sessionTime.startTime = moment(this.onDate).set({hour:hourTripHill.startHour,minute:hourTripHill.startMinute,second:0,millisecond:0}).toDate();
      sessionTime.endTime = moment(this.onDate).set({hour:hourTripHill.endHour,minute:hourTripHill.endMinute,second:0,millisecond:0}).toDate();
      sessionTime.name = "Session on scheduled " + this.utils.formatDate(sessionTime.startTime);
      sessionTime.description = "Booked from schedule " + this.schedule.title;
      sessionTime.tripHillId = this.selectedTripHill.id;
      sessionTime.instructorId = this.searchInstructorId;
      sessionTime.recurrenceId = this.recurrence.id;
      sessionTimes.push(sessionTime);
    }
    registrationRequest.sessionTimes = sessionTimes;

    return registrationRequest;
  }

  async l_guestCheckOut(){
    if(!this.selectedHourHills || this.selectedHourHills.length===0){
      this.toastUtil.showToastTranslate("Please select time slots first.");
      return;
    }

    let hourHill = this.selectedHourHills[0];
    let registration:CourseRegistration = this.l_prepareRegistration();

    const modal = await this.modalController.create({
      component: GuestCheckoutPage,
      componentProps: { registration: registration }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if(data){
      let guestRegistration:CourseRegistration = data;
      if(!guestRegistration || !guestRegistration.email){
        this.toastUtil.showToast("Guest course registration contact email can not be empty!");
        return;
      }
      let navigationExtras: NavigationExtras = {
        state: {
          providerId: this.providerId,
          registration: guestRegistration,
          availableCourseTypes:null,
        }
      };
      this.router.navigate(['ski-course-registration-confirm', this.utils.getTime()], navigationExtras);
    }
  }

  async l_toConfirm(){
    if(!this.appSession.l_getUserId()){
      const alert = await this.alertCtrl.create({
        header: this.translateUtil.translateKey('Checkout Options'),
        // message: 'Message <strong>text</strong>!!!',
        buttons: [
          {
            text: this.translateUtil.translateKey('Guest Checkout'),
            handler: () => {
              this.l_guestCheckOut();
            }
          },
          {
            text: this.translateUtil.translateKey('Sign Up or Login (search again after login)'),
            handler: () => {
              console.log('Login Okay');
              let navigationExtras: NavigationExtras = {
                state: {
                  // for registering membership;
                  providerId:this.providerId,
                  memberRegistration:true,
                }
              };
              this.router.navigate(['login'], navigationExtras);
            }
          },
          {
            text: this.translateUtil.translateKey('Cancel'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      await alert.present();
      return;
    }else{
      if(!this.selectedHourHills || this.selectedHourHills.length===0){
        this.toastUtil.showToastTranslate("Please select time slots first.");
        return;
      }
      let hourHill = this.selectedHourHills[0];
      let reg = this.l_prepareRegistration();
      let availTypes:ProviderCourseTypeWithDetails[] = [];
      availTypes.push(reg.providerCourseType);

      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.providerId, registration:reg, availableCourseTypes:availTypes,
        }
      };
      this.router.navigate(['ski-course-registration-confirm'], navigationExtras);

      this.selectedHourHills = [];
    }
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  goHome(){
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  // async openMenu() {
  //   let buttons:any = [];
  //
  //   buttons.push(
  //     {
  //       text: this.translateUtil.translateKey('Home'),
  //       // role: 'cancel', // will always sort to be on the bottom
  //       handler: () => {
  //         console.log('Home clicked');
  //         this.goHome();
  //       },
  //     }
  //   );
  //   buttons.push(
  //     {
  //       text: this.translateUtil.translateKey('CLOSE'),
  //       // role: 'cancel', // will always sort to be on the bottom
  //       handler: () => {
  //         console.log('CLOSE clicked');
  //         this.onClose();
  //       },
  //     }
  //   );
  //
  //   this.actionSheet = await this.actionsheetCtrl.create({
  //     cssClass: 'action-sheets-basic-page',
  //     buttons: buttons
  //   });
  //   this.actionSheet.present();
  // }

}
