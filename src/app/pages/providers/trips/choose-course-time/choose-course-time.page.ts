import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet, LoadingController,
  ModalController,
  NavController,
  PickerController
} from '@ionic/angular';
import {AppSession} from "../../../../services/app-session.service";
import {TripServiceService} from "../../../../services/trip-service.service";
import {Utils} from "../../../../services/utils.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {ToastUtil} from "../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {TripRegistration} from "../../../../models/trip/TripRegistration";
import {Course} from "../../../../models/Course";
import {Trip} from '../../../../models/trip/Trip';
import * as moment from 'moment';
import {CallbackValue} from '../../../../models/transfer/CallbackValue';
import {CallbackValuesService} from '../../../../services/callback-values.service';
import {StudentUtil} from '../../../../services/student-util.service';
import {ProviderCourseTypeWithDetails} from "../../../../models/ProviderCourseTypeWithDetails";
import {ProvidersService} from "../../../../services/providers-service.service";
import {NameValue} from '../../../../models/NameValue';
import {CodeTableService} from '../../../../services/code-table-service.service';
import {LearnType} from '../../../../models/code/LearnType';
import {CourseRegistration} from '../../../../models/CourseRegistration';
import {Provider} from "../../../../models/Provider";
import {ChooseRecurrenceRequest} from "../../../../models/transfer/ChooseRecurrenceRequest";
import {RecurrenceInstance} from "../../../../models/schedule/RecurrenceInstance";
import {ScheduleService} from "../../../../services/schedule.service";

@Component({
  selector: 'app-choose-course-time',
  templateUrl: './choose-course-time.page.html',
  styleUrls: ['./choose-course-time.page.scss'],
})
export class ChooseCourseTimePage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  public submitted:boolean = false;

  provider:Provider;
  userId:number;
  trip:Trip;
  providerCourseType:ProviderCourseTypeWithDetails;
  tripRegistration:TripRegistration;
  tripCourses:Course[];

  candidateInstances:RecurrenceInstance[];

  public multiColumnOptions:NameValue[][];
  public selectedTypeName:string;
  public selectedPartOfDay:string;
  public isGroupPcType:boolean;

  public readonly MORNING = "Morning";
  public readonly AFTERNOON = "Afternoon";

  loading:any = null;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil, private loadingCtrl:LoadingController,
              public utils:Utils, public translateUtil:TranslateUtil, private tripService:TripServiceService,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public studentUtil:StudentUtil,
              private actionsheetCtrl:ActionSheetController, private callbackValues:CallbackValuesService,
              private alertCtrl:AlertController, private ionRouterOutlet:IonRouterOutlet, private modalController:ModalController,
              private providerService:ProvidersService, public pickerCtrl: PickerController, private codeTableService:CodeTableService,
              private scheduleService:ScheduleService) {
    super(appSession, router, appConstants);

    this.userId = this.appSession.l_getUserId();
    this.initPickList();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.provider = this.router.getCurrentNavigation().extras.state.provider;
        this.trip = this.router.getCurrentNavigation().extras.state.trip;
        this.providerCourseType = this.router.getCurrentNavigation().extras.state.providerCourseType;

        if(!this.provider || !this.provider.id){
          this.toastUtil.showToastTranslate("Empty providerId!");
          this.router.navigate([this.appConstants.ROOT_PAGE]);
          return;
        }

        if(!this.trip || !this.trip.id){
          this.toastUtil.showToastTranslate("Empty trip!");
          this.router.navigate([this.appConstants.ROOT_PAGE]);
          return;
        }

        if(!this.providerCourseType){
          this.toastUtil.showToastTranslate("Empty providerCourseType!");
          this.router.navigate([this.appConstants.ROOT_PAGE]);
          return;
        }else{
          this.isGroupPcType = (this.providerCourseType.courseTypeCodeId===this.appConstants.CODE_COURSE_GROUP);
        }
      }
    });

  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.showLoading();
    if(this.trip && this.trip.time && this.trip.tripHillId){

      if(this.isGroupPcType){
        this.tripService.s_getTripHillDayCourses(this.provider.id, this.trip.time, this.trip.tripHillId, this.providerCourseType.id, (courses:Course[]) => {
          this.tripCourses = courses;
          this.filterCourses();
          this.dismissLoading();
        });
      }else{
        this.onSearch();
      }
    }else{
      console.log("Empty trip.time or trip.tripHillId!");
    }
  }

  ionViewWillLeave() {
    this.dismissLoading();
  }

  ionViewCanLeave(){
  }

  onSearch(){
    console.log("Good onSearch().");

    let queryRequest:ChooseRecurrenceRequest = new ChooseRecurrenceRequest();
    queryRequest.providerId = this.provider.id;
    queryRequest.fromUserId = this.userId;
    queryRequest.chosenDate = this.utils.formatDateShort(this.trip.time);
    queryRequest.chosenUserId = null;
    this.scheduleService.queryInstructorSchedule(this.userId, queryRequest, (insts:RecurrenceInstance[]) => {
      this.candidateInstances = insts;
      this.dismissLoading();
    });
  }

  async showLoading(){
    if(!this.loading) {
      this.loading = await this.loadingCtrl.create({
        message: 'Loading...',
        spinner: 'crescent',
        duration: 2000
      });
    }
    await this.loading.present();
  }

  dismissLoading(){
    setTimeout(
      () => {
        if(this.loading){
          this.loading.dismiss();
        }
        this.loading = null;
      },
      500
    );
  }

  filterCourses(){
    if(this.tripCourses){
      for(let course of this.tripCourses){
        course.sessionTimesStr = this.utils.getSessionTimesString(course.sessionTimes);
      }
    }
  }

  public initPickList(){
    if(this.multiColumnOptions && this.multiColumnOptions.length>1){
      return;
    }

    this.multiColumnOptions = [];

    this.multiColumnOptions[0] = [];
    this.codeTableService.getLearnType((learnTypes:LearnType[]) => {
      if(learnTypes && learnTypes.length>0){
        let nameValue1 = new NameValue();
        nameValue1.id = -1;
        nameValue1.name = "*";
        nameValue1.value = -1;
        this.multiColumnOptions[0].push(nameValue1);

        for(let learnType of learnTypes){
          nameValue1 = new NameValue();
          nameValue1.id = learnType.id;
          nameValue1.name = learnType.name;
          nameValue1.value = learnType.id;
          this.multiColumnOptions[0].push(nameValue1);
        }
      }
    });

    this.multiColumnOptions[1] = [];
    let nameValue2 = new NameValue();
    nameValue2.id = -1;
    nameValue2.name = "*";
    this.multiColumnOptions[1].push(nameValue2);
    nameValue2 = new NameValue();
    nameValue2.id = 1;
    nameValue2.name = this.MORNING;
    this.multiColumnOptions[1].push(nameValue2);
    nameValue2 = new NameValue();
    nameValue2.id = 2;
    nameValue2.name = this.AFTERNOON;
    this.multiColumnOptions[1].push(nameValue2);
  }

  async openPicker(numColumns = 1, numOptions = 5, columnOptions = this.multiColumnOptions){
    const picker = await this.pickerCtrl.create({
      columns: this.getColumns(numColumns, numOptions, columnOptions),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (value) => {
            console.log(`Got Value ${value}`);
            this.filterPickList(value);
          }
        }
      ]
    });
    await picker.present();
  }

  getColumns(numColumns, numOptions, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }
    return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions) {
    if(columnIndex>=columnOptions.length){
      return;
    }

    let options = [];
    for (let i = 0; i < numOptions; i++) {
      if(i>=columnOptions[columnIndex].length){
        break;
      }
      if(columnOptions[columnIndex][i % numOptions]){
        options.push({
          text: columnOptions[columnIndex][i % numOptions].name,
          value: columnOptions[columnIndex][i % numOptions]
        });
      }else{
        console.log("columnIndex: " + columnIndex + ", i: " + i + " is null!");
        console.log("i % numOptions is: " + (i % numOptions));
        console.log("skip.");
      }
    }
    return options;
  }

  filterPickList(values:any[]) {
    if (!values || values.length < 2) {
      return;
    }
    let typeValue:any = values['col-0'];
    let dayValue:any = values['col-1'];
    if(typeValue && typeValue.value){
      this.selectedTypeName = typeValue.value.name;
    }else{
      this.selectedTypeName = null;
    }
    if(dayValue && dayValue.value){
      this.selectedPartOfDay = dayValue.value.name;
    }else{
      this.selectedPartOfDay = null;
    }

    if(!this.tripCourses || this.tripCourses.length===0){
      return;
    }
    for(let course of this.tripCourses){
      course.hidePickList = false;
      course.checked = false;

      if(typeValue && typeValue.value && typeValue.value.id>0){
        if(course.learnTypeId !== typeValue.value.id){
          course.hidePickList = true;
          continue;
        }
      }

      // 1. filter by course.courseTime;
      if(course.courseTime){
        let noon = this.utils.getNoonOfDay(course.courseTime);
        if(dayValue && dayValue.value && dayValue.value.name===this.MORNING && course.courseTime){
          let cst = moment(course.courseTime);
          if(cst.isAfter(moment(noon).add(-1, 'minute'))){
            course.hidePickList = true;
            continue;
          }
        }
        if(dayValue && dayValue.value && dayValue.value.name===this.AFTERNOON){
          let cst = moment(course.courseTime);
          if(cst.isBefore(moment(noon).add(1, 'minute'))){
            course.hidePickList = true;
            continue;
          }
        }
      }

      // 2. filter by course.sessionTimes;{
      if(course.sessionTimes && course.sessionTimes.length>0){
        let checkedSessionTime = false;
        let hideCourse = true;
        for(let sessionTime of course.sessionTimes){
          let noon = this.utils.getNoonOfDay(sessionTime.startTime);
          if(sessionTime.startTime){
            checkedSessionTime = true;
            let stStart = moment(sessionTime.startTime);
            if(dayValue && dayValue.value && dayValue.value.name===this.MORNING && stStart.isBefore(moment(noon).add(-1, 'minute'))){
              hideCourse = false;
            }
            if(dayValue && dayValue.value && dayValue.value.name===this.AFTERNOON && stStart.isAfter(moment(noon))){
              hideCourse = false;
            }
          }
          if(sessionTime.endTime){
            checkedSessionTime = true;
            let stEnd = moment(sessionTime.endTime);
            if(dayValue && dayValue.value && dayValue.value.name===this.MORNING && stEnd.isBefore(moment(noon).add(-1, 'minute'))){
              hideCourse = false;
            }
            if(dayValue && dayValue.value && dayValue.value.name===this.AFTERNOON && stEnd.isAfter(moment(noon))){
              hideCourse = false;
            }
          }
        }
        if(checkedSessionTime){
          course.hidePickList = hideCourse;
        }
      }
    }
  }

  onBookSchedule(recurrenceInstance:RecurrenceInstance){
    console.log("Good onBookSchedule(recurrenceInstance).");
    if(!recurrenceInstance.clonedSchedule || !recurrenceInstance.clonedSchedule.userId || !recurrenceInstance.clonedSchedule.instructorId){
      console.log("Empty userId or instructorId!");
    }
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.provider.id,
        searchUserId: recurrenceInstance.clonedSchedule.userId,
        searchInstructorId: recurrenceInstance.clonedSchedule.instructorId,
        onDate: this.utils.formatDateShort(this.utils.formatDateShort(recurrenceInstance.day)),
      }
    };
    this.router.navigate(['schedule-book'], navigationExtras);
  }

  onBookCourse(course:Course){
    console.log("Good onBookCourse.");
    if (course.createdTypeId!==this.appConstants.COURSE_CREATED_FROM_INSTRUCTOR) {
      // this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey("Not a instructor's course, can not register."), null);
      // return;
    }

    if (!course.open) {
      this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey("Lesson closed, can not register."), null);
      return;
    }

    //check deadline;
    if (course.deadLine) {
      if (moment(course.deadLine).isBefore(new Date())) {
        this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey("Register deadline passed, can not register."), null);
        return;
      }
    }

    this.providerService.s_checkCourseStudentSpace(course.id, (roomCount:number) => {
      if(roomCount===0){
        let alert = this.alertCtrl.create();
        this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey("This lesson has been fully booked."),
          this.translateUtil.translateKey("Please choose another lesson and continue."));
      }else{
        this.proceedRegisterCourse(course);
      }
    });
  }

  async proceedRegisterCourse(course:Course) {
    if (course.registerCode) {
      let regCode: string = null;

      const alert = await this.alertCtrl.create({
        header: this.translateUtil.translateKey("Register Code"),
        inputs: [
          {
            name: 'code',
            type: 'text',
            placeholder: ''
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          },
          {
            text: 'Ok',
            handler: (data) => {
              console.log('Confirm Ok');
              regCode = data["code"];
              if (regCode && regCode === course.registerCode) {
                this.doRegisterCourse(course);
              } else {
                this.toastUtil.showToast("Wrong code, please try again.");
                return;
              }
            }
          }
        ]
      });
      await alert.present();

    }else{
      this.doRegisterCourse(course);
    }
  }

  l_prepareRegistration(course:Course):CourseRegistration{
    // create registration;
    let startTime = null;
    let endTime = null;
    if(course.sessionTimes && course.sessionTimes.length===1){
      startTime = course.sessionTimes[0].startTime;
      endTime = course.sessionTimes[0].endTime;
    }
    let userInfo = this.appSession.l_getUserInfo();
    let userName = "Guest";
    let name = "GuestName";
    if(userInfo){
      if(userInfo.userName){
        userName = userInfo.userName;
      }
      if(userInfo.name){
        name = userInfo.name;
      }
    }

    let contactName = null;
    if(this.tripRegistration){
      contactName = (this.tripRegistration.firstName?this.tripRegistration.firstName:"") +
      ((this.tripRegistration.firstName&&this.tripRegistration.lastName)?" ":"") +
      (this.tripRegistration.lastName?this.tripRegistration.lastName:"");
    }else if(this.userId>0){
      contactName = name;
    }

    if(contactName){
      console.log("contactName.trim().length" + contactName.trim().length);
      if(contactName.trim().length===0){
        contactName = null;
      }
    }

    let registrationRequest = new CourseRegistration();
    registrationRequest.title = userName + " registration for lesson " + course.name;
    registrationRequest.providerId = this.provider.id;
    registrationRequest.instructorId = null;
    registrationRequest.providerCourseTypeId = course.providerCourseTypeId;
    registrationRequest.providerCourseTypeName = course.providerCourseTypeName;
    registrationRequest.learnTypeId = course.learnTypeId;
    registrationRequest.learnTypeName = course.learnTypeName;
    registrationRequest.userId = this.appSession.l_getUserId();
    registrationRequest.courseId = course.id;
    registrationRequest.courseName = course.name;
    registrationRequest.tripHillId = course.tripHillId;
    registrationRequest.tripHillName = course.tripHillName;
    registrationRequest.registerName = name;
    registrationRequest.instructorName = null;
    registrationRequest.consentMandatory = course.consentMandatory;
    registrationRequest.contactName = contactName;
    registrationRequest.tripId = this.trip.id;

    if(!registrationRequest.email && this.tripRegistration){
      registrationRequest.tripRegistrationId = this.tripRegistration.id;
      registrationRequest.email = this.tripRegistration.email;
      registrationRequest.phoneNumber = this.tripRegistration.phoneNumber;
      registrationRequest.weChatNum = this.tripRegistration.weChatId;
    }else if(!registrationRequest.email && this.userId>0){
      if(userInfo){
        registrationRequest.email = userInfo.email;
        registrationRequest.phoneNumber = userInfo.phoneNumber;
        registrationRequest.weChatNum = userInfo.weChatNum;
      }
    }

    return registrationRequest;
  }

  private doRegisterCourse(course:Course){
    let courseRegistration = this.l_prepareRegistration(course);
    let pcTypes:ProviderCourseTypeWithDetails[] = [];
    pcTypes.push(this.providerCourseType);
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.provider.id, registration:courseRegistration, availableCourseTypes:pcTypes, course:course
      }
    };
    this.router.navigate(['ski-course-registration-confirm'], navigationExtras);
  }

  onClose(){
    if(this.tripRegistration && this.tripRegistration.id){
      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.provider.id,
          tripRegistrationId: this.tripRegistration.id,
        }
      };
      this.router.navigate(['trip-registration-details'], navigationExtras);
    }else{
      if(this.ionRouterOutlet.canGoBack()){
        this.navCtrl.pop();
      }else{
        this.router.navigate([this.appConstants.ROOT_PAGE]);
      }
    }
  }
}
