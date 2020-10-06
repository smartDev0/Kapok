import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, ModalController, NavController} from "@ionic/angular";
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AppConstants} from "../../../../services/app-constants.service";
import {UserService} from "../../../../services/user-service.service";
import {StudentUtil} from "../../../../services/student-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {NgForm} from "@angular/forms";
import {CourseRegistration} from "../../../../models/CourseRegistration";
import {CourseType} from "../../../../models/code/CourseType";
import {ProviderCourseTypeWithDetails} from "../../../../models/ProviderCourseTypeWithDetails";
import {ProviderContext} from "../../../../models/transfer/ProviderContext";
import {DateTimeUtils} from "../../../../services/date-time-utils.service";
import {CodeTableService} from "../../../../services/code-table-service.service";
import * as moment from 'moment';
import {Student} from "../../../../models/Student";
import {PaymentProcessUtil} from "../../../../services/coursePayment/payment-process-util.service";
import {StudentPage} from "../../student/student.page";
import {Provider} from "../../../../models/Provider";
import {CallbackValuesService} from "../../../../services/callback-values.service";
import {Subscription} from "rxjs";
import {AgeRangeOption} from "../../../../models/courseOptions/AgeRangeOption";
import {LevelOption} from "../../../../models/courseOptions/LevelOption";
import {Course} from "../../../../models/Course";

@Component({
  selector: 'app-ski-course-registration-edit',
  templateUrl: './ski-course-registration-edit.page.html',
  styleUrls: ['./ski-course-registration-edit.page.scss'],

  providers: [
    StudentUtil,
  ],
})
export class SkiCourseRegistrationEditPage extends BasicUserIdPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  @ViewChild("formRef") formRef:NgForm;
  private myModal:any;

  providerId:number;
  provider:Provider;
  instructorId:number;
  memberId:number;

  registrationRequest:CourseRegistration;

  submitted:boolean;
  callback:any;
  formChanged:boolean = false;
  currentDateTime:string;
  disableForGroupCourse = false;

  namesEmptyError = null;
  courseTypes:CourseType[];
  student_errs:string[];
  pcTypes:ProviderCourseTypeWithDetails[];
  confirmedLeave:boolean;

  courseSimple:Course;
  ageRangeOptions:AgeRangeOption[];
  levelOptions:LevelOption[];

  private subscription:Subscription;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public studentUtil:StudentUtil,
              private alertCtrl:AlertController, private userService:UserService, private actionsheetCtrl:ActionSheetController,
              public dateTimeUtils:DateTimeUtils, private codeTableService:CodeTableService, private paymentProcessUtil:PaymentProcessUtil,
              private modalController:ModalController, private callbackValues:CallbackValuesService,) {
    super(appSession, router, appConstants);
    this.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.registrationRequest = this.router.getCurrentNavigation().extras.state.registrationRequest;

        if(this.registrationRequest && this.registrationRequest.courseId){
          this.getCourseOptions(this.registrationRequest.courseId);
        }
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.providerService.s_getProviderById(this.providerId, (providerResult:Provider) => {
        this.provider = providerResult;
      });
    }

    this.appSession.checkProviderContext(false, this.providerId, (context:ProviderContext) => {
      if(context){

        this.currentDateTime = this.dateTimeUtils.getCurrentLocalTime();
        this.formChanged = false;
        this.disableForGroupCourse = false;

        this.memberId = this.appSession.l_getMemberId(this.providerId);
        if(!this.providerId){
          this.toastUtil.showToastTranslate("Can not get school!");
          return;
        }

        this.instructorId = this.registrationRequest.instructorId;
        this.namesEmptyError = null;

        this.codeTableService.getCourseType((courseTypes:CourseType[]) => {
          this.courseTypes = courseTypes;
        });

        this.providerService.s_getProviderCourseTypesByProviderId(this.providerId, true, (pcTypes:ProviderCourseTypeWithDetails[]) => {
          this.pcTypes = pcTypes;
        });
        this.l_updatePageContent();
      }
    });
  }

  ionViewCanLeave(){
    if(this.myModal){
      this.myModal.dismiss();
    }
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }

    if (this.formRef.dirty && !this.confirmedLeave) {
      this.onCancelPage();
      return false;
    }else{
      return true;
    }
  }

  ionViewWillLeave() {
  }

  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getCourseOptions(courseId:number){
    this.providerService.getSkiCourseSimpleWithOptionsById(courseId, (course:Course) => {
      if(!course){
        return;
      }
      this.courseSimple = course;
      this.ageRangeOptions = this.courseSimple.ageRangeOptions;
      this.levelOptions = this.courseSimple.levelOptions;
    });
  }

  l_updatePageContent() {
    this.submitted = false;
    if (!this.appSession.l_getUserId()) {
      return;
    }
  }

  onViewConsent(){
    console.log("Good onViewConsent().");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: this.providerId,
      }
    };
    this.router.navigate(['consent-view'], navigationExtras);
  }

  courseTypeChanged(){
    console.log("courseTypeChanged() called: " + this.registrationRequest.providerCourseTypeId);
    let isGroupType:boolean = this.checkProviderCourseType(this.registrationRequest.providerCourseTypeId, this.pcTypes, this.appConstants.CODE_COURSE_GROUP);
    if(isGroupType){
      this.disableForGroupCourse = true;
      this.instructorId = null;
    }else{
      this.disableForGroupCourse = false;
    }
  }

  checkProviderCourseType(providerCourseTypeId:number, pcTypes:ProviderCourseTypeWithDetails[], courseTypeCodeId:number){
    if(!providerCourseTypeId || !pcTypes || !courseTypeCodeId){
      return false;
    }

    for(let pcType of pcTypes){
      if(pcType.id === providerCourseTypeId && pcType.courseTypeCodeId===courseTypeCodeId){
        return true;
      }
    }
    return false;
  }


  onUpdateStudent(student:Student){
    console.log("Good onUpdateStudent, student: " + student?student.name:"");
    this.l_addUpdateStudent(student);
    this.student_errs = [];
  }

  onLearnTypeChanged(){
    // this.autoAddMemberStudent();
  }

  autoAddMemberStudent(){
    if(this.registrationRequest.students && this.registrationRequest.students.length>0){
      return;
    }

    if(this.registrationRequest && this.appSession.l_getUserInfo()){
      let name = this.appSession.l_getUserInfo().name;

      let regStudent = new Student();
      regStudent.name = name;
      if(!this.registrationRequest.students){
        this.registrationRequest.students = [];
      }
      this.registrationRequest.students.push(regStudent);
    }
  }

  deleteCourseType(){
    this.registrationRequest.providerCourseTypeId = null;
    this.disableForGroupCourse = false;
  }

  async l_addUpdateStudent(student?:Student){
    if(!student){
      student = new Student();
    }

    const modal = await this.modalController.create({
      component: StudentPage,
      componentProps: {
        student:student,
        enableLiftTicket:this.provider.enableLiftTicket,
        enableRental:this.provider.enableRental,
        ageRangeOptions:this.ageRangeOptions,
        levelOptions:this.levelOptions,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if(data){
      let resultStudent:Student = data;
      if(resultStudent){
        if(!this.registrationRequest.students){
          this.registrationRequest.students = [];
        }
        this.registrationRequest.students.push(resultStudent);
      }
    }
  }

  onDeleteStudentName(student:Student){
    if(student && this.registrationRequest.students){
      for (let _i = 0; _i < this.registrationRequest.students.length; _i++) {
        let studentTemp = this.registrationRequest.students[_i];
        if(student.ageRangeOptionId===studentTemp.ageRangeOptionId && student.levelOptionId===studentTemp.levelOptionId && student.name===studentTemp.name){
          this.registrationRequest.students.splice(_i, 1);
        }
      }
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

  saveSkiRegistration(formRef:NgForm) {
    this.submitted = true;

    if(!this.registrationRequest.providerCourseTypeId){
      this.l_scrollToId("courseTypeId");
      this.toastUtil.showToastTranslate("Class type is required.");
      return;
    }
    if(!this.registrationRequest.learnTypeId){
      this.l_scrollToId("learnTypeId");
      this.toastUtil.showToastTranslate("Learning type is required.");
      return;
    }

    if(!this.registrationRequest.students || this.registrationRequest.students.length===0){
      this.l_scrollToId("addStudentBtnId");
      this.toastUtil.showToastTranslate("Student name(s) is required.");
      this.namesEmptyError = "Student name(s) is required.";
      return;
    }

    if(!this.registrationRequest.students|| this.registrationRequest.students.length===0){
      this.namesEmptyError = true;
      this.toastUtil.showToastTranslate("Student names required.");
      return;
    }else{
      this.namesEmptyError = false;
    }

    let payOfflineOnly = false;
    if(this.provider && this.provider.payOffline && !this.provider.payOnline){
      payOfflineOnly = true;
    }
    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
      this.confirmedLeave = false;
    }else{
      console.log("save called good.");
      this.confirmedLeave = true;
      this.paymentProcessUtil.checkAnyPayCourse(this.registrationRequest, this.navCtrl, payOfflineOnly);
    }
  }

  onCancelPage(){
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null,
        this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DISCARD'),
        (data) => {
          this.confirmedLeave = true;
          this.navCtrl.pop();
        });
    }else{
      this.navCtrl.pop();
    }
  }

  // onCancel() {
  //   if((this.formRef && this.formRef.dirty) || this.formChanged) {
  //     let alert = this.alertCtrl.create();
  //     alert.setTitle(this.translateUtil.translateKey('Discard change?'));
  //     alert.addButton(this.translateUtil.translateKey('CANCEL'));
  //     alert.addButton({
  //       text: this.translateUtil.translateKey('DISCARD'),
  //       handler: data => {
  //         this.l_reset();
  //         this.l_close();
  //       }
  //     });
  //     alert.present();
  //   }else{
  //     // this.l_reset();
  //     this.l_close();
  //   }
  // }

  l_reset(){
    this.submitted = false;
    this.formChanged = false;
    this.namesEmptyError = false;
    if(!this.registrationRequest.id || this.registrationRequest.id<=0){
      this.registrationRequest = new CourseRegistration();
    }else{
      this.l_updatePageContent();
    }
  }

  l_close(){
    this.navCtrl.pop();
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  l_onSave(){
    console.log('To submit form.');
    if(!this.formRef){
      console.log("Can not find formRef!");
    }else{
      this.formRef.ngSubmit.emit("ngSubmit");
      console.log('Save clicked finished.');
    }
  }

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            this.l_onSave();
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
