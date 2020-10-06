import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {GeneralPaginationRequest} from "../../../models/transfer/GeneralPaginationRequest";
import {Course} from "../../../models/Course";
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet, LoadingController,
  NavController, PickerController,
  Platform,
} from '@ionic/angular';
import {TranslateUtil} from "../../../services/translate-util.service";
import {AppConstants} from "../../../services/app-constants.service";
import {Utils} from "../../../services/utils.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AppSession} from "../../../services/app-session.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {ProviderContext} from "../../../models/transfer/ProviderContext";
import {GeneralPaginationResponse} from "../../../models/transfer/GeneralPaginationResponse";
import * as moment from 'moment';
import {CallbackValuesService} from "../../../services/callback-values.service";
import {CallbackValue} from "../../../models/transfer/CallbackValue";
import {Provider} from '../../../models/Provider';
import {ProviderCourseTypeWithDetails} from '../../../models/ProviderCourseTypeWithDetails';
import {InstructorWithDetails} from '../../../models/InstructorWithDetails';
import {LearnType} from "../../../models/code/LearnType";
import {CodeTableService} from "../../../services/code-table-service.service";
import {AgeRangeOption} from "../../../models/courseOptions/AgeRangeOption";

@Component({
  selector: 'app-ski-courses',
  templateUrl: './ski-courses.page.html',
  styleUrls: ['./ski-courses.page.scss'],

  providers: [
    SocialSharing,
  ],
})
export class SkiCoursesPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private actionSheet:any;
  public loading:any = null;

  public readonly L_CAMP = this.translateUtil.translateKey("Camp");
  public readonly L_AVAILABLE = this.translateUtil.translateKey("Available");
  public readonly L_LEARNING = this.translateUtil.translateKey("Learning");
  public readonly L_TEACHING = this.translateUtil.translateKey("Teaching");
  public readonly L_ALL = this.translateUtil.translateKey("All");
  public readonly L_REQUESTS = this.translateUtil.translateKey("Requests");

  public readonly SORT_BY_COURSE_NAME = 1;
  public readonly SORT_BY_COURSE_TIME = 2;
  public readonly SORT_BY_COURSE_INSTRUCTOR_NAME = 3;

  // For tripEvent course type; If courseTypeId is not null, then only display courses for this courseType;
  courseTypeId:number = null;

  // These ids are for create skiCourse relationship to SkiEvent or SkiProvider;
  fromCommand:number = null;
  providerId:number = null;
  provider:Provider = null;
  instructorId:number = null;
  memberId:number = null;
  mountainId:number = null;
  disableModifyButtons:boolean = true;
  courses:Course[] = null;
  searchRequest:GeneralPaginationRequest = null;
  forChoose:boolean = false;
  appType:string;
  futureOnly:boolean = true;
  sortOption:number = this.SORT_BY_COURSE_NAME;

  private keyIndex:number = 0;
  public showSearchBar:boolean = false;
  public searchKey:string = null;
  public searchKeys:string[] = null;

  public searchTagKey:string;
  public searchTagKeys:string[] = null;

  // advanced search filter;
  public showAdvancedFilters:boolean = false;
  public searchLearnTypeId:number = null;
  public searchProviderCourseTypeId:number = null;
  public searchDate:any = null;
  providerCourseTypes:ProviderCourseTypeWithDetails[];
  learnTypes:LearnType[];
  userId = null;

  CALLBACK_HOOKED_COMPONENT:string;
  public showTrip = true;

  public optionsList:string[] = [];

  public pcTypes:ProviderCourseTypeWithDetails[];
  public instructors:InstructorWithDetails[];
  public multiColumnOptions:any[][];
  public selectedPcTypeName:string;
  public selectedInstructorName:string;
  public privateOnly:boolean = false;

  public startTime:any = null;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providersService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public platform:Platform,
              private socialSharing: SocialSharing, private actionsheetCtrl:ActionSheetController, private codeTableService:CodeTableService,
              private alertCtrl:AlertController, public callbackValuesService:CallbackValuesService,
              private ionRouterOutlet:IonRouterOutlet, public pickerCtrl: PickerController, private loadingCtrl:LoadingController,) {
    super(appSession, router, appConstants);
    console.log("Good constructor().");
    this.startTime = new Date();
    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.fromCommand = this.router.getCurrentNavigation().extras.state.fromCommand;
        this.mountainId = this.router.getCurrentNavigation().extras.state.mountainId;
        this.instructorId = this.router.getCurrentNavigation().extras.state.instructorId;
        this.CALLBACK_HOOKED_COMPONENT = this.router.getCurrentNavigation().extras.state.CALLBACK_HOOKED_COMPONENT;

        this.courseTypeId = this.router.getCurrentNavigation().extras.state.courseTypeId;
        this.privateOnly = this.router.getCurrentNavigation().extras.state.privateOnly;

        this.initPickList();
      }
    });

    this.codeTableService.getLearnType((types:LearnType[]) => {
      this.learnTypes = types;
    });
  }

  ngOnInit() {
    console.log("Good ngOnInit().");
    if(!this.providerId){
      this.providerId = parseInt(this.route.snapshot.paramMap.get('providerId'));
      this.mountainId = parseInt(this.route.snapshot.paramMap.get('mountainId'));
      this.instructorId = parseInt(this.route.snapshot.paramMap.get('instructorId'));
      this.fromCommand = parseInt(this.route.snapshot.paramMap.get('fromCommand'));

      this.courseTypeId = parseInt(this.route.snapshot.paramMap.get('courseTypeId'));
      this.initPickList();
      return;
    }
  }

  ionViewWillEnter() {
    console.log("Good ionViewWillEnter().");
    this.searchKey = null;
    this.searchKeys = null;
    this.showLoading();
    this.l_preparePage();
  }

  ionViewDidEnter(){
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
    this.dismissLoading();
  }

  toggleAdvancedFilter(){
    console.log("Good onAdvancedFilter().");
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  onClearSearchDate(){
    this.searchDate = null;
  }

  onReset(){
    this.searchLearnTypeId = null;
    this.searchProviderCourseTypeId = null;
    this.searchDate = null;
    // this.onApplyFilters();
  }

  onToggleSessionTimes(course:Course){
    console.log("Good onToggleSessionTimes.");
    if(!course){
      return;
    }
    course.sessionTimesExpended = !course.sessionTimesExpended;
  }

  onApplyFilters(){
    console.log("Good onApplyFilters().");
    this.toggleAdvancedFilter();

    let totalShowCount = 0;
    for(let course of this.courses){
      course.filterHide = false;
      if(this.searchLearnTypeId && course.learnTypeId && course.learnTypeId!==this.searchLearnTypeId){
        course.filterHide = true;
        continue;
      }
      if(this.searchProviderCourseTypeId && course.providerCourseTypeId && course.providerCourseTypeId!==this.searchProviderCourseTypeId){
        course.filterHide = true;
        continue;
      }
      if(this.searchDate){
        if(course.sessionTimes && course.sessionTimes.length>0){
          let hasSameDay = false;
          for(let sessionTime of course.sessionTimes){
            if(this.utils.isSameDay(sessionTime.endTime, this.searchDate)){
              hasSameDay = true;
              break;
            }
          }
          if(!hasSameDay){
            course.filterHide = true;
            continue;
          }
        }
      }
      totalShowCount++;
    }
    this.toastUtil.showToastForTime("Found " + totalShowCount + " item(s).", 1000);
  }

  async showLoading(){
    console.log("showLoading called.");
    this.dismissLoading();

    if(!this.loading) {
      this.loading = await this.loadingCtrl.create({
        message: 'Loading, please wait...',
        spinner: 'crescent',
        // duration: 20000
      });
    }
    await this.loading.present();
  }

  dismissLoading(){
    console.log("dismissLoading called.");
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

  public initPickList(){
    if(this.multiColumnOptions && this.multiColumnOptions.length>1){
      return;
    }

    this.multiColumnOptions = [];
    if(this.providerId>0){
      this.providersService.s_getProviderCourseTypesByProviderId(this.providerId, true, (pcTypes:ProviderCourseTypeWithDetails[]) => {
        this.pcTypes = pcTypes;
        let pcType = new ProviderCourseTypeWithDetails();
        pcType.id = -1;
        pcType.name = "*";
        this.multiColumnOptions[0] = [];
        this.multiColumnOptions[0].push(pcType);
        this.multiColumnOptions[0] = this.multiColumnOptions[0].concat(this.pcTypes);
      });
      this.providersService.s_getSkiInstructorsForProviderId(this.providerId, null, null, true, (instructors:InstructorWithDetails[]) => {
        this.instructors = instructors;
        let ist = new InstructorWithDetails();
        ist.id = -1;
        ist.name = "*";
        this.multiColumnOptions[1] = [];
        this.multiColumnOptions[1].push(ist);
        this.multiColumnOptions[1] = this.multiColumnOptions[1].concat(this.instructors);
      });
    }
  }

  public initOptionList(){
    this.optionsList = [];

    this.optionsList.push(this.L_CAMP);
    this.optionsList.push(this.L_AVAILABLE);

    if(this.appSession.l_hasCurrentProviderAccount(this.providerId)){
      this.optionsList.push(this.L_LEARNING);
    }

    if(this.instructorId){
      this.optionsList.push(this.L_TEACHING);
    }

    if(this.appSession.l_isSiteAdmin() || this.appSession.l_isAdministrator(this.providerId)){
      this.optionsList.push(this.L_ALL);
    }

    if(this.appSession.l_isSiteAdmin() || this.appSession.l_isAdministrator(this.providerId)){
      this.optionsList.push(this.L_REQUESTS);
    }
  }

  public mappingSegment(command:number):string{
    if(command===this.appConstants.PAGE_FOR_MEMBER){
      return this.L_LEARNING;
    }else if(command===this.appConstants.PAGE_FOR_INSTRUCTOR){
      return this.L_TEACHING;
    }else if(command===this.appConstants.PAGE_FOR_AVAILABLE){
      return this.L_AVAILABLE;
    }else if(command===this.appConstants.PAGE_FOR_PROVIDER){
      return this.L_ALL;
    }else if(command===this.appConstants.PAGE_FOR_PROGRAM_REQUESTS){
      return this.L_REQUESTS;
    }else if(command===this.appConstants.PAGE_FOR_CAMP){
      return this.L_CAMP;
    }else{
      return this.L_AVAILABLE;
    }
  }

  public reverseMappingSegment(appType:string):number{
    if(appType===this.L_LEARNING){
      return this.appConstants.PAGE_FOR_MEMBER;
    }else if(appType===this.L_TEACHING){
      return this.appConstants.PAGE_FOR_INSTRUCTOR;
    }else if(appType===this.L_AVAILABLE){
      return this.appConstants.PAGE_FOR_AVAILABLE;
    }else if(appType===this.L_ALL){
      return this.appConstants.PAGE_FOR_PROVIDER;
    }else if(appType===this.L_REQUESTS){
      return this.appConstants.PAGE_FOR_PROGRAM_REQUESTS;
    }else if(appType===this.L_CAMP){
      return this.appConstants.PAGE_FOR_CAMP;
    }else{
      return this.appConstants.PAGE_FOR_AVAILABLE;
    }
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
    if (!values || values.length===0) {
      this.toastUtil.showToastForTime("Found " + 0 + " item(s).", 1000);
      return;
    }
    let pcTypeValue:any = values['col-0'];
    let instValue:any = values['col-1'];
    if(pcTypeValue){
      this.selectedPcTypeName = pcTypeValue.value.name;
    }else{
      this.selectedPcTypeName = null;
    }
    if(instValue){
      this.selectedInstructorName = instValue.value.name;
    }else{
      this.selectedInstructorName = null;
    }

    let count = 0;
    for(let course of this.courses){
      if(pcTypeValue && pcTypeValue.value && pcTypeValue.value.id>0){
        if(course.providerCourseTypeId !== pcTypeValue.value.id){
          course.hidePickList = true;
          continue;
        }
      }
      if(instValue && instValue.value && instValue.value.id>0){
        if(course.instructorId !== instValue.value.id){
          course.hidePickList = true;
          continue;
        }
      }

      count = count + 1;
      course.hidePickList = false;
    }

    if(this.fromCommand===this.appConstants.PAGE_FOR_AVAILABLE){
      this.categoryCoursesByType();
    }

    this.toastUtil.showToastForTime("Found " + count + " item(s).", 1000);
    this.onScrollUp();
  }

  private l_preparePage(){
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.providersService.s_getProviderById(this.providerId, (provider:Provider) => {
        this.provider = provider;
        if(!this.provider){
          this.toastUtil.showToast("Can not find provider!");
          this.onClose();
        }

        if(this.provider.enableTripEvent){
          this.showTrip = true;
        }else{
          this.showTrip = false;
        }

        this.initOptionList();
        this.updatePageContent(true);
      });
    }

    if(!this.fromCommand){
      console.log("fromCommand is null!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    this.appType = this.mappingSegment(this.fromCommand);
    console.log("mapped appType: " + this.appType);

    console.log("Good l_preparePage.");
    if((!this.appSession.l_getUserInfo()) &&
      (this.fromCommand!==this.appConstants.PAGE_FOR_AVAILABLE && this.fromCommand!==this.appConstants.PAGE_FOR_CHOOSE)){
      this.router.navigate(['login']);
      return;
    }

    this.appSession.checkProviderContext(false, this.providerId, (context:ProviderContext) => {
      if(context){
        this.memberId = this.appSession.l_getMemberId(this.providerId);
      }
    });

    this.searchRequest = new GeneralPaginationRequest(0, 50);
  }

  updatePageContent(refresh:boolean){
    console.log("TimeTrack: updatePageContent start at: " + this.utils.getSecondsDifference(this.startTime, new Date()));
    if(refresh){
      this.courses = [];
      this.searchRequest = new GeneralPaginationRequest(0, 50);
    }
    this.forChoose = false;
    if(this.fromCommand===this.appConstants.PAGE_FOR_PROVIDER && this.providerId>0){
      // this.l_searchCoursesForSkiProviderIdPagination();
      this.providersService.s_getAllCoursesForProviderId(this.providerId, this.futureOnly, this.courseTypeId, (courses:Course[]) => {
        this.courses = courses;
        this.sortSessions();
        this.sortCourses();
        this.showCourseCountMessage();
        this.dismissLoading();
        if(!courses){
          return;
        }
      });
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_INSTRUCTOR && this.instructorId>0){
      // this.l_searchCoursesForInstructorIdPagination();
      this.providersService.s_getCoursesForInstructorId(this.providerId, this.instructorId, null, this.futureOnly, this.courseTypeId, (courses:Course[]) => {
        this.courses = courses;
        this.sortSessions();
        this.sortCourses();
        this.showCourseCountMessage();
        this.dismissLoading();
        if(!courses){
          return;
        }
      });
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_MEMBER && this.appSession.l_getUserId()>0){
      this.providersService.s_getCoursesForUserId(this.providerId, this.appSession.l_getUserId(), this.courseTypeId, this.futureOnly, (courses:Course[]) => {
        this.courses = courses;
        this.sortSessions();
        this.sortCourses();
        this.showCourseCountMessage();
        this.dismissLoading();
        if(!courses){
          return;
        }
      });
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_AVAILABLE){
      // Open to deeplink sharing;
      let openOnly:boolean = true;

      // for mountain programs page, if not showing private courses:
      if(!this.instructorId && !this.provider.showPrivateCourses){
        this.courseTypeId = this.appConstants.CODE_COURSE_GROUP;
        this.privateOnly = false;
      }else{
        // let request parameter decided what to show;
      }

      this.providersService.s_getAvailableCourses(this.futureOnly, openOnly, this.providerId, this.mountainId, this.instructorId, this.courseTypeId, this.privateOnly, (courses:Course[]) => {
        console.log("TimeTrack: s_getAvailableCourses returned at: " + this.utils.getSecondsDifference(this.startTime, new Date()));
        this.courses = courses;
        this.sortSessions();
        this.sortCourses();
        this.showCourseCountMessage();
        this.dismissLoading();

        console.log("TimeTrack: s_getAvailableCourses finished processing list at: " + this.utils.getSecondsDifference(this.startTime, new Date()));

        if(!courses){
          return;
        }
      });
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_CHOOSE && this.appSession.l_getUserId()>0){
      // Not used yet, for choose course and assign to registration;
      this.forChoose = true;
      let openOnly:boolean = true;
      this.providersService.s_getAvailableCourses(this.futureOnly, openOnly, this.providerId, this.mountainId, this.instructorId, this.courseTypeId, this.privateOnly, (courses:Course[]) => {
        this.courses = courses;
        this.sortSessions();
        this.sortCourses();
        this.showCourseCountMessage();
        this.dismissLoading();
        if(!courses){
          return;
        }
      });
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_PROGRAM_REQUESTS){
      this.providersService.s_getProgramRequests(this.futureOnly, this.providerId, null, null, (courses:Course[]) => {
        this.courses = courses;
        this.sortSessions();
        this.sortCourses();
        this.showCourseCountMessage();
        this.dismissLoading();
        if(!courses){
          return;
        }
      });
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_CAMP){
      this.providersService.s_getCampCourses(this.futureOnly, this.providerId, this.mountainId, (courses:Course[]) => {
        this.courses = courses;
        this.sortSessions();
        this.sortCourses();
        this.showCourseCountMessage();
        this.dismissLoading();
        if(!courses){
          return;
        }
      });
    }else{
      console.log("Unknown fromCommand!");
      this.dismissLoading();
      return;
    }
  }

  onTogglePcType(pcType:ProviderCourseTypeWithDetails){
    if(!pcType){
      return;
    }
    pcType.expended = !pcType.expended;
  }

  getCount(pcType:ProviderCourseTypeWithDetails):number{
    if(!pcType || !pcType.courses || pcType.courses.length===0){
      return 0;
    }
    let count = 0;
    for(let course of pcType.courses){
      if(!course.hide && !course.hidePickList && !course.filterHide){
        count++;
      }
    }
    pcType.visibleCourseCount = count;
    return count;
  }

  categoryCoursesByType(){
    if(!this.pcTypes || this.pcTypes.length===0){
      return;
    }
    if(!this.courses || this.courses.length===0){
      this.pcTypes = null;
      return;
    }

    let tempCoruses = [];
    for(let index = 0; index<this.pcTypes.length; index++){
      let pcType = this.pcTypes[index];
      pcType.courses = [];
      let topCourses:Course[] = [];
      for(let i = 0; i < this.courses.length; i++){
        let course = this.courses[i];
        if(course.providerCourseTypeId && course.providerCourseTypeId===pcType.id){
          if(course.featured && topCourses.indexOf(course)<0){
            topCourses.push(course);
          }else{
            pcType.courses.push(course);
          }
          tempCoruses.push(course);
          this.courses.splice(i, 1);
          i = i-1;
        }
      }

      if(topCourses.length>0){
        topCourses = topCourses.concat(pcType.courses);
        pcType.courses = topCourses;
      }

      pcType.visibleCourseCount = pcType.courses.length;
    }
    this.courses = tempCoruses;
  }

  showCourseCountMessage(){
    let count=0;
    if(this.courses){
      count = this.courses.length;
    }
    this.toastUtil.showToastForTime("Found " + count + " item(s).", 1000);
  }

  segmentChanged(){
    console.log("Good segmentChanged(). appType: " + this.appType);
    this.showLoading();
    this.searchKey = null;
    this.searchKeys = null;
    this.fromCommand = this.reverseMappingSegment(this.appType);
    this.updatePageContent(true);
    this.onScrollUp();
  }

  sortCoursesByTime(){
    console.log("Good sortCourseByTime.");
    this.courses.sort((t1,t2) => {
      if(!t1.sessionTimes || t1.sessionTimes.length===0){
        return 1;
      }else if(!t2.sessionTimes || t2.sessionTimes.length===0){
        return -1;
      }else{
        let t1m = moment(t1.sessionTimes[0].startTime);
        let t2m = moment(t2.sessionTimes[0].startTime);
        if(t1m.isAfter(t2m)){
          return 1;
        }else{
          return -1;
        }
      }
    });

    if(this.fromCommand===this.appConstants.PAGE_FOR_AVAILABLE){
      this.categoryCoursesByType();
    }
  }

  sortSessions(){
    if(this.courses && this.courses.length>0){
      for(let course of this.courses){
        this.sortCourseSessionsByStartTime(course);
      }
    }
  }

  sortCourseSessionsByStartTime(course:Course){
    if(!course || !course.sessionTimes || course.sessionTimes.length===1){
      return;
    }
    course.sessionTimes.sort((t1,t2) => {
      if(!t1.startTime){
        return -1;
      }else if(t2.startTime){
        return 1;
      }else{
        let startT1 = moment(t1.startTime);
        let startT2 = moment(t2.startTime);
        if(startT1.isAfter(startT2)){
          return -1;
        }else{
          return 1;
        }
      }
    });
  }

  sortCoursesByInstructorName(){
    console.log("Good sorCoursesByInstructorName.");
    this.courses.sort((t1,t2) => {
      let nameT1 = (t1.instructorName?t1.instructorName.toLowerCase():"");
      let nameT2 = (t2.instructorName?t2.instructorName.toLowerCase():"");
      if(!nameT1 || nameT1>nameT2){
        return 1;
      }else{
        return -1;
      }
    });

    if(this.fromCommand===this.appConstants.PAGE_FOR_AVAILABLE){
      this.categoryCoursesByType();
    }
  }

  sortCoursesByCourseName(){
    console.log("Good sortCoursesByCourseName.");
    if(!this.courses){
      return;
    }
    this.courses.sort(function(a, b) {
      let nameA = a.name.toLowerCase(); // ignore upper and lowercase
      let nameB = b.name.toLowerCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    if(this.fromCommand===this.appConstants.PAGE_FOR_AVAILABLE){
      this.categoryCoursesByType();
    }
  }

  sortCourses(){
    if(this.sortOption===this.SORT_BY_COURSE_TIME){
      this.sortCoursesByTime();
    }else if(this.sortOption===this.SORT_BY_COURSE_NAME){
      this.sortCoursesByCourseName();
    }else if(this.sortOption===this.SORT_BY_COURSE_INSTRUCTOR_NAME){
      this.sortCoursesByInstructorName();
    }else{
      console.log("Unknown sort option!");
    }
    this.onScrollUp();
  }

  async changeSortCourseOption(){
    console.log("Good changeSortCourseOption().");
    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Sort by'),
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: this.translateUtil.translateKey('Name'),
          value: this.SORT_BY_COURSE_NAME,
          checked: false
        },
        {
          name: 'radio2',
          type: 'radio',
          label: this.translateUtil.translateKey('Time'),
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
            this.sortCourses();
          }
        }
      ]
    });
    await alert.present();
  }

  doInfinite(infiniteScroll) {
    // get pagination comments;
    this.updatePageContent(false);

    setTimeout(() => {
      infiniteScroll.complete();
    }, 30);
  }

  private l_searchCoursesForSkiProviderIdPagination(){
    this.searchRequest.providerId = this.providerId;
    this.providersService.s_getCoursesForProviderIdPagination(this.appSession.l_getUserId(), this.searchRequest, (pageResponse:GeneralPaginationResponse) => {
      console.log("Got courses for providerId.");
      if(!pageResponse){
        console.log("no more result!");
        this.searchRequest.noMoreResult = true;
        return;
      }
      let pageCourses:Course[] = pageResponse.pageResults;
      if(pageCourses && pageCourses.length>0){
        if(!this.courses){
          this.courses = [];
        }
        this.courses = this.courses.concat(pageCourses);
        this.searchRequest.start = pageResponse.start + pageCourses.length;
        this.sortCoursesByTime();
      }else{
        console.log("no more result now!");
        this.searchRequest.noMoreResult = true;
      }
    });
  }

  private l_searchCoursesForInstructorIdPagination(){
    this.searchRequest.instructorId = this.instructorId;
    this.providersService.s_getCoursesForInstructorIdPagination(this.appSession.l_getUserId(), this.searchRequest, (pageResponse:GeneralPaginationResponse) => {
      console.log("Got courses.");
      if(!pageResponse){
        console.log("no more result!");
        this.searchRequest.noMoreResult = true;
        return;
      }
      let pageCourses:Course[] = pageResponse.pageResults;
      if(pageCourses && pageCourses.length>0){
        if(!this.courses){
          this.courses = [];
        }
        this.courses = this.courses.concat(pageCourses);
        this.searchRequest.start = pageResponse.start + pageCourses.length;
        this.sortCoursesByTime();
      }else{
        console.log("no more result now!");
        this.searchRequest.noMoreResult = true;
      }
    });
  }

  toggleSearchBar(){
    this.showSearchBar = !this.showSearchBar;
    this.focusButton();
    //this.checkSearchBarTimeout();;
  }

  focusButton(){
    if(this.showSearchBar && this.search){
      setTimeout(() => {
        this.search.setFocus();
      }, 500);
    }
  }

  onClearSearch(){
    this.getItems(null);
    this.showSearchBar = false;
  }

  onClearTagSearch(){
    this.getTagItems(null);
    this.showSearchBar = false;
  }

  getItems(ev: any) {
    if(!this.courses){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;
      let valStr = val.toLowerCase();
      let keys = valStr.split(/[\s,;]+/);
      this.searchKeys = keys;

      for(let course of this.courses){
        course.hide = false;
        for(let key of keys){
          let foundKey = false;
          if(course.id && course.id.toString().toLowerCase().indexOf(key)>=0){
            foundKey = true;
          }else if(course.name && course.name.toLowerCase().indexOf(key)>=0){
            foundKey = true;
          }else if(course.instructorName && course.instructorName.toLowerCase().indexOf(key)>=0){
            foundKey = true;
          }else if(course.tripHillName && course.tripHillName.toLowerCase().indexOf(key)>=0){
            foundKey = true;
          }

          if(!foundKey){
            course.hide = true;
            break;
          }
        }
      }
    }else{
      this.searchKey = null;
      this.searchKeys = null;
      for(let course of this.courses){
        course.hide = false;
      }
    }
    this.onScrollUp();
    this.updateTypeCouseCounts();
    //this.checkSearchBarTimeout();;
  }

  getTagItems(ev: any) {
    if(!this.courses){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchTagKey = val;
      let valStr = val.toLowerCase();
      let keys = valStr.split(/[\s,;]+/);
      this.searchTagKeys = keys;

      for(let course of this.courses){
        course.hide = false;
        for(let key of keys){
          let foundKey = false;
          if(course.id && course.tags && course.tags.toString().toLowerCase().indexOf(key)>=0){
            foundKey = true;
          }
          if(!foundKey){
            course.hide = true;
            break;
          }
        }
      }
    }else{
      this.searchTagKey = null;
      this.searchTagKeys = null;
      for(let course of this.courses){
        course.hide = false;
      }
    }
    this.onScrollUp();
    this.updateTypeCouseCounts();
    //this.checkSearchBarTimeout();;
  }

  updateTypeCouseCounts():number{
    let totalShow = 0;
    if(this.pcTypes && this.pcTypes.length>0){
      for(let pcType of this.pcTypes){
        let typeCourseCount = this.getCount(pcType);
        if(typeCourseCount>0){
          totalShow = totalShow + typeCourseCount;
        }
      }
    }
    return totalShow;
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

  onChooseCourse(courseId:number){
    console.log("Good onChooseCourse(). courseId: " + courseId);
    if(this.CALLBACK_HOOKED_COMPONENT){
      let values:any[] = [];
      values['courseId'] = courseId;
      let callbackValue = new CallbackValue(this.CALLBACK_HOOKED_COMPONENT, values);
      this.callbackValuesService.callbackDataSubject.next(callbackValue);
    }
  }

  onViewDetails(course){
    console.log("Good onViewDetails, courseId: " + course.id);
    let navigationExtras: NavigationExtras = {
      state: {
        courseId:course.id,
        providerId:this.providerId
      }
    };
    this.router.navigate(['ski-course-details'], navigationExtras);
  }

  onAdd(){
    console.log("Good this.onAdd().");
    let newCourse = new Course();
    newCourse.ownerUserId = this.userId;
    newCourse.providerId = this.providerId;
    newCourse.createdTypeId = this.appConstants.COURSE_CREATED_FROM_INSTRUCTOR;
    newCourse.open = true;
    newCourse.instructorId = this.instructorId;

    let navigationExtras: NavigationExtras = {
      state: {
        course:newCourse,
        providerId:this.providerId
      }
    };
    this.router.navigate(['ski-course-edit'], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  openPage(selection:string) {
    // let options = {enableBackdropDismiss: false};
    switch(selection){
      case "events": {

        break;
      }
      default: {
        console.log("Unknown selection: " + selection);
        break;
      }
    }
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  async l_showPastPopUp(){
    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('How long ago to show?'),
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: this.translateUtil.translateKey('One Month'),
          value: '1',
          checked: true
        },
        {
          name: 'radio2',
          type: 'radio',
          label: this.translateUtil.translateKey('One Year'),
          value: '2'
        },
        {
          name: 'radio3',
          type: 'radio',
          label: this.translateUtil.translateKey('All'),
          value: '3'
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
          text: this.translateUtil.translateKey('Show'),
          handler: (data) => {
            console.log('Confirm Ok');
            console.log("Show clicked. data: " + data);
            let startTime = null;
            let endTime = null;
            if(data==="1"){

              startTime = moment().subtract(1, 'months').toISOString();
            }else if(data==="2"){
              startTime = moment().subtract(1, 'years').toISOString();
            }else if(data==="3"){
              startTime = moment().subtract(10, 'years').toISOString();
            }
            endTime = moment().toISOString();
            this.courses = [];
            this.searchRequest = new GeneralPaginationRequest(0, 50);
            this.searchRequest.startTime = startTime;
            this.searchRequest.endTime = endTime;
            this.updatePageContent(true);
          }
        }
      ]
    });
    await alert.present();
  }

  shareSheetShare() {
    if(!this.providerId){
      return;
    }
    let mountId = -1;
    if(this.mountainId){
      mountId = this.mountainId;
    }
    let instId = -1;
    if(this.instructorId){
      instId = this.instructorId;
    }

    let url = "https://www.kapok-tree.com/#/ski-courses/" + this.providerId + "/" + mountId + "/" + instId + "/" + this.fromCommand;
    console.log("url: " + url);
    if(this.platform.is('cordova')){
      this.socialSharing.share("Lesson link. ", "Sharing instructor lessons", null, url).then(() => {
        console.log("shareSheetShare: Success");
      }).catch(() => {
        console.error("shareSheetShare: failed");
      });
    }else{
      this.utils.showOkAlertForSharing(this.alertCtrl, "Sharing from browser", "If you are on browser, please copy and share the link below.", url);
    }
  }

  goHome(){
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Share'),
        handler: () => {
          console.log('Share clicked');
          this.shareSheetShare();
        },
      }
    );
    buttons.push(
        {
          text: this.translateUtil.translateKey('Sort'),
          handler: () => {
            console.log('Sort clicked');
            this.changeSortCourseOption();
          },
        }
    );
    // for futureOnly;
    if(this.futureOnly){
      buttons.push(
          {
            text: this.translateUtil.translateKey('Show Past'),
            handler: () => {
              console.log('Show Past');
              // this.l_showPastPopUp();
              this.futureOnly = false;
              this.updatePageContent(true);
            },
          }
      );
    }else{
      buttons.push(
          {
            text: this.translateUtil.translateKey('Future Only'),
            handler: () => {
              console.log('Show futureOnly');
              // this.l_showPastPopUp();
              this.futureOnly = true;
              this.updatePageContent(true);
            },
          }
      );
    }

    // if((this.fromCommand===this.appConstants.PAGE_FOR_PROVIDER || this.fromCommand===this.appConstants.PAGE_FOR_INSTRUCTOR) &&
    if(this.appSession.l_isInstructor(this.providerId) || this.appSession.l_isAdministrator(this.providerId)){
      buttons.push(
        {
          text: this.translateUtil.translateKey('New program'),
          handler: () => {
            console.log('Add clicked');
            this.onAdd();
          },
        }
      );
    }
    buttons.push(
      {
        text: this.translateUtil.translateKey('Home'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('Home clicked');
          this.goHome();
        },
      }
    );
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

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
