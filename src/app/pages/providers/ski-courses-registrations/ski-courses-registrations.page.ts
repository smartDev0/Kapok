import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, ModalController, NavController} from '@ionic/angular';
import {AppSession} from "../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {AppConstants} from "../../../services/app-constants.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {CourseRegistration} from "../../../models/CourseRegistration";
import {Utils} from "../../../services/utils.service";
import {TripRegistration} from '../../../models/trip/TripRegistration';
import {TripServiceService} from '../../../services/trip-service.service';
import * as moment from 'moment';
import {SearchUserComponent} from "../search-user/search-user.component";
import {UserInfo} from "../../../models/UserInfo";

@Component({
  selector: 'app-ski-courses-registrations',
  templateUrl: './ski-courses-registrations.page.html',
  styleUrls: ['./ski-courses-registrations.page.scss'],
})
export class SkiCoursesRegistrationsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private actionSheet:any;

  /**
   *  Segments;
   *   1: summary, 2: weekly, 3: monthly, 4: specialDays;
   **/
  public readonly seg_course:string = "Course";
  public readonly seg_trip:string = "Trip";
  public appType:string = this.seg_course;
  public currentSegment:string;
  public futureOnly:boolean = true;

  /**
   * CourseRegistrations;
   **/
  fromCommand:number = null;    // PAGE_FOR_PROVIDER or PAGE_FOR_MEMBER from AppConstants;
  userId:number = null;
  providerId:number = null;
  instructorId:number = null;

  public showSearchBar:boolean = false;
  public keyIndex:number = 0;
  public searchKey:string = null;

  courseRegistrations:CourseRegistration[] = null;
  callback:any = null;
  disableModifyButtons:boolean = true;

  showAllDetails:boolean = false;

  public readonly SORT_BY_COURSE_NAME = 1;
  public readonly SORT_BY_COURSE_TIME = 2;
  public readonly SORT_BY_COURSE_INSTRUCTOR_NAME = 3;
  sortOption:number = this.SORT_BY_COURSE_NAME;

  /**
   * TripRegistrations;
   **/
  tripRegistrations:TripRegistration[] = null;


  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, private tripService:TripServiceService,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils, public alertCtrl:AlertController, private modalController:ModalController,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.appType = this.seg_course;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.fromCommand = this.router.getCurrentNavigation().extras.state.fromCommand;
        this.instructorId = this.router.getCurrentNavigation().extras.state.instructorId;

        let tempType = this.router.getCurrentNavigation().extras.state.appType;
        if(tempType){
          this.appType = tempType;
        }
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.searchKey = null;

    if(!this.fromCommand){
      console.log("fromCommand is null!");
      return;
    }
    this.userId = this.appSession.l_getUserId();

    this.updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    this.searchKey = null;
    this.currentSegment = this.appType;

    console.log("updatePageContent, appType: " + this.appType);
    if(this.appType===this.seg_course){
      console.log("Loading course registrations.");
      if(this.fromCommand===this.appConstants.PAGE_FOR_PROVIDER && this.providerId>0){
        this.providersService.s_getCourseRegistrationsForProviderId(this.providerId, null, false, this.futureOnly, (registrations:CourseRegistration[]) => {
          this.sortRegistrations(registrations);
          this.courseRegistrations = registrations;
        });
      }else if(this.fromCommand===this.appConstants.PAGE_FOR_INSTRUCTOR && this.instructorId>0){
        this.providersService.s_getRegistrationsForInstructorId(this.instructorId, this.futureOnly, (registrations:CourseRegistration[]) => {
          this.sortRegistrations(registrations);
          this.courseRegistrations = registrations;
        });
      }else if(this.fromCommand===this.appConstants.PAGE_FOR_MEMBER){
        this.providersService.s_getRegistrationsForUserId(this.providerId, this.userId, this.futureOnly, (registrations:CourseRegistration[]) => {
          this.sortRegistrations(registrations);
          this.courseRegistrations = registrations;
        });
      }else{
        console.log("Unknown fromCommand!");
        return;
      }
    }else if(this.appType===this.seg_trip){
      console.log("Loading trip registrations.");
      if(this.fromCommand===this.appConstants.PAGE_FOR_MEMBER){
        this.tripService.s_getTripRegistrationsForUserId(this.userId, this.futureOnly, (tripRegistrations:TripRegistration[])=>{
          this.tripRegistrations = tripRegistrations;
        });
      }else if(this.fromCommand===this.appConstants.PAGE_FOR_PROVIDER && this.providerId>0){
        this.tripService.s_getTripRegistrationsForProviderId(this.userId, this.providerId, this.futureOnly, (tripRegistrations:TripRegistration[])=>{
          this.tripRegistrations = tripRegistrations;
        });
      }else{
        console.log("Unknown fromCommand!");
        return;
      }

    }else{
      console.log("Unknown appType!");
    }
  }

  segmentChanged(){
    this.currentSegment = this.appType;
    this.searchKey = null;
    this.updatePageContent();

    console.log("Segment hanged to " + this.appType);
  }

  sortRegistrations(registrations:CourseRegistration[]){
    if(!registrations || registrations.length<=1){
      return;
    }
    registrations.sort((t1,t2) => {
      if(t1.createdDate>t2.createdDate){
        return 1;
      }else{
        return -1;
      }
    });
  }

  getAllTitle(){
    if(this.fromCommand===this.appConstants.PAGE_FOR_PROVIDER){
      return "All ";
    }
    return "";
  }

  hasShownCourse():boolean{
    if(this.courseRegistrations && this.courseRegistrations.length>0){
      for(let course of this.courseRegistrations){
        if(!course.hide){
          return true;
        }
      }
    }
    return false;
  }

  onViewCourseRegistrationDetails(registration:CourseRegistration){
    console.log("Good onViewDetails, courseId: " + registration.id);
    if(!registration || !registration.id || !registration.providerId){
      return;
    }
    let navigationExtras: NavigationExtras = {
      state: {
        registrationId:registration.id, providerId:registration.providerId
      }
    };
    this.router.navigate(['ski-course-registration-details', registration.providerId+"_"+registration.id], navigationExtras);
  }

  onViewTripRegistrationDetails(registration:TripRegistration){
    console.log("Good onViewRegDetails, registration.id: " + registration.id);
    if(!registration || !registration.id || !registration.providerId){
      return;
    }

    let valid = this.onValidate(registration);
    if(!valid){
      return;
    }

    let navigationExtras: NavigationExtras = {
      state: {
        providerId:registration.providerId,
        tripRegistrationId: registration.id,
      }
    };
    this.router.navigate(['trip-registration-details'], navigationExtras);
  }

  onValidate(registration:TripRegistration){
    console.log("Good onValidate().");

    if(!registration || !registration.id){
      return false;
    }

    if(!this.userId){
      this.toastUtil.showToast("Please login first.");
      return false;
    }

    if(!this.appSession.l_hasAboveInstructorAccess(this.providerId) &&
      (!registration.userId || !this.userId || registration.userId!==this.userId)){
      this.toastUtil.showToast("User can only view own registration.");
      return false;
    }

    return true;
  }

  toggleSearchBar(){
    this.showSearchBar = !this.showSearchBar;
    this.focusButton();
    //this.checkSearchBarTimeout();;
  }

  onClearSearch(){
    this.getItems(null);
    this.showSearchBar = false;
  }

  focusButton(){
    if(this.showSearchBar && this.search){
      setTimeout(() => {
        this.search.setFocus();
      }, 500);
    }
  }

  checkSearchBarTimeout(){
    this.keyIndex = this.keyIndex +1;
    setTimeout(
        (keyIndex) => {
          if(keyIndex===this.keyIndex){
            this.showSearchBar = false;
          }
        },
        this.appConstants.SEARCH_BAR_SHOW_DELAY,
        this.keyIndex
    );
  }

  getItems(ev: any) {
    if(this.appType===this.seg_course){
      this.getItemsCourses(ev);
    }else if(this.appType===this.seg_trip){
      this.getItemsTrips(ev);
    }else{
      console.log("Unknown segment option!");
    }
  }

  getItemsCourses(ev: any) {
    if(!this.courseRegistrations){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;

      for(let registration of this.courseRegistrations) {
        if(registration.title && registration.title.toLowerCase().indexOf(val.toLowerCase()) > -1){
          registration.hide = false;
          continue;
        }
        if(registration.instructorName && registration.instructorName.toLowerCase().indexOf(val.toLowerCase()) > -1){
          registration.hide = false;
          continue;
        }
        if(registration.registerName && registration.registerName.toLowerCase().indexOf(val.toLowerCase()) > -1){
          registration.hide = false;
          continue;
        }
        if(registration.tripHillName && registration.tripHillName.toLowerCase().indexOf(val.toLowerCase()) > -1){
          registration.hide = false;
          continue;
        }
        if(registration.courseName && registration.courseName.toLowerCase().indexOf(val.toLowerCase()) > -1){
          registration.hide = false;
          continue;
        }
        registration.hide = true;
      }
    }else{
      this.searchKey = null;
      for(let registration of this.courseRegistrations) {
        registration.hide = false;
      }
    }
    //this.checkSearchBarTimeout();;
  }

  getItemsTrips(ev: any) {
    if(!this.tripRegistrations){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;

      for(let registration of this.tripRegistrations) {
        if(registration.tripTitle && registration.tripTitle.toLowerCase().indexOf(val.toLowerCase()) > -1){
          registration.hide = false;
          continue;
        }
        if(registration.tripLocation && registration.tripLocation.toLowerCase().indexOf(val.toLowerCase()) > -1){
          registration.hide = false;
          continue;
        }
        if(registration.registrantName && registration.registrantName.toLowerCase().indexOf(val.toLowerCase()) > -1){
          registration.hide = false;
          continue;
        }
        if(registration.firstName && registration.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1){
          registration.hide = false;
          continue;
        }
        if(registration.lastName && registration.lastName.toLowerCase().indexOf(val.toLowerCase()) > -1){
          registration.hide = false;
          continue;
        }
        registration.hide = true;
      }
    }else{
      this.searchKey = null;
      for(let registration of this.tripRegistrations) {
        registration.hide = false;
      }
    }
    //this.checkSearchBarTimeout();;
  }

  onClose(){
    this.navCtrl.pop();
  }

  sortByTime(){
    console.log("Good sortCourseByTime.");
    this.courseRegistrations.sort((t1,t2) => {
      let startT1 = this.getFirstStartTime(t1);
      let startT2 = this.getFirstStartTime(t2);
      if(!startT1){
        return 1;
      }else if(!startT2){
        return -1;
      }else{
        if(moment(startT1).isAfter(moment(startT2))){
          return 1;
        }else{
          return -1;
        }
      }
    });
  }

  getFirstStartTime(registration:CourseRegistration){
    if(registration || !registration.sessionTimes || registration.sessionTimes.length===0){
      return null;
    }

    let firstSessionTime = null;
    if(registration.sessionTimes && registration.sessionTimes.length>0){
      for(let sessionTime of registration.sessionTimes){
        if(!firstSessionTime || moment(sessionTime.startTime).isBefore(moment(firstSessionTime))){
          firstSessionTime = sessionTime.startTime;
        }
      }
    }
    return firstSessionTime;
  }

  sortByInstructorName(){
    console.log("Good sortByInstructorName.");
    this.courseRegistrations.sort((t1,t2) => {
      let nameT1 = (t1.instructorName?t1.instructorName.toLowerCase():"");
      let nameT2 = (t2.instructorName?t2.instructorName.toLowerCase():"");
      if(!nameT1 || nameT1>nameT2){
        return 1;
      }else{
        return -1;
      }
    });
  }

  sortCourseRegistrations(){
    if(this.sortOption===this.SORT_BY_COURSE_TIME){
      this.sortByTime();
    }else if(this.sortOption===this.SORT_BY_COURSE_NAME){
      this.sortByInstructorName();
    }else{
      console.log("Unknown sort option!");
    }
  }

  async changeSortCourseOption(){
    console.log("Good changeSortCourseOption().");
    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Sort by'),
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: this.translateUtil.translateKey('Lesson name'),
          value: this.SORT_BY_COURSE_NAME,
          checked: false
        },
        {
          name: 'radio2',
          type: 'radio',
          label: this.translateUtil.translateKey('Lesson time'),
          value: this.SORT_BY_COURSE_TIME,
        },
        {
          name: 'radio3',
          type: 'radio',
          label: this.translateUtil.translateKey('Instructor'),
          value: this.SORT_BY_COURSE_INSTRUCTOR_NAME,
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
          text: this.translateUtil.translateKey('Sort'),
          handler: (data) => {
            console.log('Confirm Ok');
            console.log("Show clicked. data: " + data);
            this.sortOption = data;
            this.sortCourseRegistrations();
          }
        }
      ]
    });
    await alert.present();
  }

  onCreateReport(){
    console.log("Good onCreateReport().");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: this.providerId
      }
    };
    this.router.navigate(['registration-report'], navigationExtras);
  }

  async searchCoursesByUser(){
    console.log("Good searchCoursesByUser()");
    const modal = await this.modalController.create({
      component: SearchUserComponent,
      componentProps: { }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if(data){
      let selectedUser:UserInfo = data;
      if(selectedUser){
        console.log("selectedUser.userName: " + selectedUser.userName);
        this.searchCourseRegistrationsByUser(selectedUser);
      }
    }
  }

  searchCourseRegistrationsByUser(userInfo:UserInfo){
    if(!userInfo){
      return;
    }
    this.courseRegistrations = [];
    this.providersService.s_getRegistrationsForUserId(this.providerId, userInfo.id, false, (regs:CourseRegistration[]) => {
      this.courseRegistrations = regs;
    });
  }

  async searchCoursesByEmail(){
    console.log("Good searchCoursesByEmail().");

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Search course registrations for user email'),
      inputs: [
        {
          label: this.translateUtil.translateKey('Email'),
          name: "email",
          type: 'email',
          placeholder: 'email',
          value: null,
        },
      ],
      buttons: [
        {
          text: this.translateUtil.translateKey('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey('Search'),
          handler: (data) => {
            if(data && data.email){
              let email = data.email;
              this.searchCourseRegistrationsForEmail(email);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  searchCourseRegistrationsForEmail(email:string){
    if(!email){
      return;
    }
    this.providersService.searchCourseRegistrationsForEmail(this.providerId, email, true, (regs:CourseRegistration[]) => {
      this.courseRegistrations = regs;
    });
  }

  getCourseRegistrationsButtons(){
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Sort'),
        handler: () => {
          console.log('Sort clicked');
          this.changeSortCourseOption();
        },
      }
    );

    if(this.appSession.l_isSiteAdmin() || this.appSession.l_isAdministrator(this.providerId)){
      buttons.push(
        {
          text: this.translateUtil.translateKey('Search by user'),
          handler: () => {
            console.log('searchCoursesByUser clicked');
            this.searchCoursesByUser();
          },
        }
      );
      buttons.push(
        {
          text: this.translateUtil.translateKey('Search by email'),
          handler: () => {
            console.log('searchCoursesByEmail clicked');
            this.searchCoursesByEmail();
          },
        }
      );
      buttons.push(
        {
          text: this.translateUtil.translateKey('Registration Report'),
          handler: () => {
            console.log('Registration Report clicked');
            this.onCreateReport();
          },
        }
      );
    }
    return buttons;
  }

  getTripRegistrationsButtons(){
    let buttons:any = [];

    return buttons;
  }

  async openMenu() {
    let buttons:any = [];

    if(this.appType===this.seg_course){
      buttons = this.getCourseRegistrationsButtons();
    }else{
      buttons = this.getTripRegistrationsButtons();
    }
    // // for futureOnly;
    // if(this.futureOnly){
    //   buttons.push(
    //     {
    //       text: this.translateUtil.translateKey('Show Past'),
    //       handler: () => {
    //         console.log('Show Past');
    //         this.futureOnly = false;
    //         this.updatePageContent();
    //       },
    //     }
    //   );
    // }else{
    //   buttons.push(
    //     {
    //       text: this.translateUtil.translateKey('Future Only'),
    //       handler: () => {
    //         console.log('Show futureOnly');
    //         this.futureOnly = true;
    //         this.updatePageContent();
    //       },
    //     }
    //   );
    // }
    buttons.push(
      {
        text: this.translateUtil.translateKey('CLOSE'),
        handler: () => {
          console.log('CLOSE clicked');
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
