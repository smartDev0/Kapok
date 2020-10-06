import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {AppSession} from "../../../services/app-session.service";
import {ProviderCourseTypeWithDetails} from "../../../models/ProviderCourseTypeWithDetails";
import {LearnType} from "../../../models/code/LearnType";
import {InstructorWithDetails} from "../../../models/InstructorWithDetails";
import {Provider} from "../../../models/Provider";
import {CourseRegistration} from "../../../models/CourseRegistration";
import {AlertController, IonContent, IonRouterOutlet, ModalController, NavController} from "@ionic/angular";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ToastUtil} from "../../../services/toast-util.service";
import {AppConstants} from "../../../services/app-constants.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {Student} from "../../../models/Student";
import {StudentUtil} from "../../../services/student-util.service";
import {CodeTableService} from "../../../services/code-table-service.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {UserInfo} from "../../../models/UserInfo";
import {UserService} from "../../../services/user-service.service";
import {PaymentProcessUtil} from "../../../services/coursePayment/payment-process-util.service";
import {Utils} from "../../../services/utils.service";
import {Course} from "../../../models/Course";
import {CoursePaymentService} from '../../../services/coursePayment/course-payment-service.service';
import {GuestCheckoutPage} from "../guest-checkout/guest-checkout.page";
import {SessionTime} from "../../../models/SessionTime";
import {AgeRangeOption} from "../../../models/courseOptions/AgeRangeOption";
import {LevelOption} from "../../../models/courseOptions/LevelOption";
import {StudentPage} from "../student/student.page";

@Component({
  selector: 'app-ski-course-registration-confirm',
  templateUrl: './ski-course-registration-confirm.page.html',
  styleUrls: ['./ski-course-registration-confirm.page.scss'],

  providers: [
    StudentUtil,
  ],
})
export class SkiCourseRegistrationConfirmPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  private actionSheet:any;
  private myModal:any;

  userId:number;
  registration:CourseRegistration;
  providerId:number;
  provider:Provider;
  namesEmptyError = null;
  instructor:InstructorWithDetails;
  submitted:boolean = false;
  callback:any = null;
  disableModifyButtons:boolean = true;
  disableLearnType:boolean = false;
  disableProviderCourseType:boolean = false;
  learnTypes:LearnType[] = null;
  availableProviderCourseTypes:ProviderCourseTypeWithDetails[] = null;

  course:Course = null;
  courseStrudentLimit:number = 0;
  pcTypeMaxStudents:number = 0;
  courseStudentCount:number = 0;
  studentSpace:number;

  enableLiftTicket = false;
  enableRental = false;

  sessionTimeError = null;

  courseSimple:Course;
  useBirthDay:boolean;
  ageRangeOptions:AgeRangeOption[];
  levelOptions:LevelOption[];

  constructor(public appSession:AppSession, private route: ActivatedRoute, router: Router, private toastUtil:ToastUtil,
              public appConstants:AppConstants, private providersService:ProvidersService, public studentUtil:StudentUtil,
              private codeTableService:CodeTableService, public translateUtil:TranslateUtil, private userService:UserService,
              private paymentProcessUtil:PaymentProcessUtil, private navCtrl:NavController, public modalController: ModalController,
              private alertCtrl:AlertController, private utils:Utils, private ionRouterOutlet:IonRouterOutlet,
              private coursePaymentService:CoursePaymentService, private modalCtrl:ModalController,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(false);
    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.availableProviderCourseTypes = this.router.getCurrentNavigation().extras.state.availableCourseTypes;
        if(!this.availableProviderCourseTypes || this.availableProviderCourseTypes.length<=1){
          this.disableProviderCourseType = true;
        }
        this.registration = this.router.getCurrentNavigation().extras.state.registration;

        if(!this.availableProviderCourseTypes && this.registration && this.registration.providerCourseTypeId){
          this.providersService.s_getProviderCourseTypesByProviderId(this.providerId, true, (pcTypes:ProviderCourseTypeWithDetails[]) => {
            if(pcTypes && pcTypes.length>0){
              for(let pcType of pcTypes){
                if(pcType.id===this.registration.providerCourseTypeId){
                  this.availableProviderCourseTypes = [];
                  this.availableProviderCourseTypes.push(pcType);
                  break;
                }
              }
            }
            if(!this.availableProviderCourseTypes || this.availableProviderCourseTypes.length<=1){
              this.disableProviderCourseType = true;
            }
          });
        }

        this.getCourseOptions(this.registration.courseId);

        this.updateEnableRental();
      }
    });

    this.coursePaymentService.subscribeCourseRegistrationLock((status:boolean) => {
      if(this.registration){
        this.registration.alreadySent = status;
      }
    });
  }

  getCourseOptions(courseId:number){
    this.providersService.getSkiCourseSimpleWithOptionsById(courseId, (course:Course) => {
      if(!course){
        return;
      }
      this.courseSimple = course;
      this.ageRangeOptions = this.courseSimple.ageRangeOptions;
      this.levelOptions = this.courseSimple.levelOptions;
      this.useBirthDay = this.courseSimple.useBirthDayOption;

      if(this.ageRangeOptions && this.ageRangeOptions.length>0){
        this.ageRangeOptions.sort((s1:AgeRangeOption,s2:AgeRangeOption) => {
          return (s1.sequence-s2.sequence);
        });
      }
      if(this.levelOptions && this.levelOptions.length>0){
        this.levelOptions.sort((s1:LevelOption,s2:LevelOption) => {
          return (s1.sequence-s2.sequence);
        });
      }
    });
  }

  updateEnableRental(){
    if(this.provider){
      this.enableLiftTicket = this.provider.enableLiftTicket;
      this.enableRental = this.provider.enableRental;
    }
    if(this.registration && (this.registration.tripId>0 || this.registration.tripRegistrationId>0)){
      this.enableLiftTicket = false;
      this.enableRental = false;
    }
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.codeTableService.getLearnType((types:LearnType[]) => {
      this.learnTypes = types;
      this.getInstructor();
    });

    this.autoAddMemberStudent();

    if(!this.registration){
      this.utils.showOkAlert(this.alertCtrl, "Can not find registration to confirm!", null);
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    if(this.registration && this.registration.learnTypeId>0) {
      this.disableLearnType = true;
    }

    if(this.registration.alreadySent){
      this.registration = null;
      this.toastUtil.showToast("Please start registration again.");
      this.onClose();
      return;
    }

    this.constructorInit();
  }

  ionViewDidEnter() {
  }

  ionViewCanLeave(){
    if(this.registration && (!this.registration.alreadySent && !this.registration.confirmedCancel)){
      this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to cancel the registration?", null, null, "Cancel", null, "Yes",
        (data) => {
          this.registration.confirmedCancel = true;
          this.onClose();
        }
      );
      return false;
    }
    return true;
  }

  ionViewWillLeave() {
    if (this.myModal) {
      this.myModal.dismiss();
    }

    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  private constructorInit(){
    if((!this.registration || !this.registration.providerCourseTypeId) && !this.availableProviderCourseTypes){
      this.toastUtil.showToastTranslate("Empty available Class types!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.providersService.s_getProviderById(this.providerId, (provider:Provider) => {
        this.provider = provider;
        if(!this.provider){
          this.toastUtil.showToastTranslate("Can not find provider by providerId!");
          this.router.navigate([this.appConstants.ROOT_PAGE]);
          return;
        }else{
          this.updateEnableRental();
          if(this.registration.tripHillId!=null && this.registration.tripHillName==null){
            for(let tripHill of this.provider.tripHills){
              if(this.registration.tripHillId===tripHill.id){
                this.registration.tripHillName = tripHill.locationStr;
                break;
              }
            }
          }
        }
      });
    }

    if(!this.registration){
      this.toastUtil.showToastTranslate("Empty course registration!");
      return;
    }else{
      if(!this.registration.students){
        this.registration.students = [];
      }
      if(!this.registration.providerCourseTypeId && this.availableProviderCourseTypes.length===1){
        this.registration.providerCourseTypeId = this.availableProviderCourseTypes[0].id;
        this.registration.providerCourseTypeName = this.availableProviderCourseTypes[0].name;
      }

      if(this.registration.providerCourseTypeId && this.availableProviderCourseTypes){
        for(let pcType of this.availableProviderCourseTypes){
          if(pcType.id===this.registration.providerCourseTypeId){
            this.pcTypeMaxStudents = pcType.maxStudentNum;
          }
        }
      }

      if(this.registration.courseId){
        this.providersService.s_getCoursesDetailsById(this.registration.courseId, (course:Course) => {
          this.course = course;
          this.courseStrudentLimit = this.course.totalStudentLimit;
          // this.registStudentLimit = this.course.registStudentLimit;

          this.l_checkStudentsCount(true);
        });
      }else{
        this.l_checkStudentsCount(true);
      }
    }

    this.getCourseStudentCount();
  }

  getDisableBtn(){
    if(!this.registration || this.registration.alreadySent){
      return true;
    }
    return false;
  }

  autoAddMemberStudent(){
    console.log("Good autoAddMemberStudent.");
    if(!this.registration){
      return;
    }
    if(this.registration.students && this.registration.students.length>0){
      return;
    }

    if(this.registration && this.appSession.l_getUserInfo()){
      let name = this.appSession.l_getUserInfo().name;

      // fix this; this.registration.id, name, age, level, false, false
      let regStudent = new Student();
      regStudent.name = name;
      if(!this.registration.students){
        this.registration.students = [];
      }
      this.registration.students.push(regStudent);
      // this.l_checkStudentsCount();
    }
  }

  getInstructor(){
    if(!this.learnTypes || this.learnTypes.length===0){
      return;
    }
    if(this.registration && this.registration.learnTypeId){
      let learnType = this.l_getLearnTypeById(this.registration.learnTypeId, this.learnTypes);
      if(learnType){
        this.learnTypes = [];
        this.learnTypes.push(learnType);
      }
    }else if(this.registration && this.registration.instructorId){
      this.providersService.s_getSkiInstructorDetailsById(this.registration.instructorId, (instructor:InstructorWithDetails) => {
        this.instructor = instructor;

        if(this.instructor){
          let lTypes = [];
          if(this.instructor.skiLevel>0 && this.learnTypes){
            let type = this.l_getLearnTypeByName("ski", this.learnTypes);
            if(type){
              lTypes.push(type);
            }
          }
          if(this.instructor.boardLevel>0 && this.learnTypes){
            let type = this.l_getLearnTypeByName("board", this.learnTypes);
            if(type){
              lTypes.push(type);
            }
          }

          if(lTypes.length>0){
            this.learnTypes = [];
            this.learnTypes = this.learnTypes.concat(lTypes);
            if(this.learnTypes.length===1 && this.learnTypes[0] && this.learnTypes[0].id){
              this.registration.learnTypeId = this.learnTypes[0].id;
              this.disableLearnType = true;
            }
          }
        }
      });
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

  l_getLearnTypeByName(name, lTypes):LearnType{
    if(!name || !lTypes){
      return null;
    }
    for(let type of lTypes){
      if(type.name && type.name.toLowerCase().indexOf(name.toLowerCase())>=0){
        return type;
      }
    }
    return null;
  }

  l_getLearnTypeById(id, lTypes):LearnType{
    if(!id || !lTypes){
      return null;
    }
    for(let type of lTypes){
      if(type.id && type.id===id){
        return type;
      }
    }
    return null;
  }

  onClose(){
    this.registration = null;
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  courseTypeChanged(){
    console.log("Good courseTypeChanged().");
    if(this.registration.providerCourseTypeId && this.availableProviderCourseTypes){
      for(let pcType of this.availableProviderCourseTypes){
        if(pcType.id===this.registration.providerCourseTypeId){
          this.pcTypeMaxStudents = pcType.maxStudentNum;
        }
      }
    }
    this.l_checkStudentsCount(true);
  }

  l_checkStudentsCount(showAlert:boolean):boolean{
    if(!this.pcTypeMaxStudents){
      this.pcTypeMaxStudents = 0;
    }
    if(!this.courseStrudentLimit){
      this.courseStrudentLimit = 0;
    }
    console.log("courseStrudentLimit: " + this.courseStrudentLimit + ", pcTypeMaxStudents: " + this.pcTypeMaxStudents);

    if(this.courseStrudentLimit===0 && this.pcTypeMaxStudents===0){
      // this.toastUtil.showToast("Can not find student limit for this course and course type!");
      return true;
    }

    let registStudentCount = 0;
    if(this.registration.students){
      registStudentCount = this.registration.students.length;
    }

    let totalStudentCount = this.courseStudentCount + registStudentCount;
    console.log("totalStudentCount: " + totalStudentCount);
    if(this.courseStrudentLimit>0 && totalStudentCount>this.courseStrudentLimit){
      if(this.studentSpace<0){
        if(showAlert){
          this.utils.showOkAlert(this.alertCtrl, "No more available space.", null);
        }
        return false;
      }
    }

    if(this.course && this.course.registStudentLimit>0){
      this.studentSpace = this.course.registStudentLimit - registStudentCount;
      if(this.studentSpace<0){
        if(showAlert){
          this.utils.showOkAlert(this.alertCtrl, "Exceeded registration limit.", null);
        }
        return false;
      }
    }else if(this.pcTypeMaxStudents>0){
      this.studentSpace = this.pcTypeMaxStudents - registStudentCount;
      if(this.studentSpace<0){
        if(showAlert){
          this.utils.showOkAlert(this.alertCtrl, "Exceeded registration limit for the selected type.", null);
        }
        return false;
      }
    }

    return true;
  }

  async getCourseStudentCount(){
    if(!this.registration.courseId){
      this.courseStudentCount = 0;
      return;
    }
    await this.providersService.s_getCourseStudentCount(this.registration.courseId, (count:number) => {
      this.courseStudentCount = count;
      this.l_checkStudentsCount(true);
    });
  }

  onUpdateStudent(student:Student){
    console.log("Good onUpdateStudent, student: " + student?student.name:"");
    this.l_addUpdateStudent(student);
  }

  async l_addUpdateStudent(student?:Student){
    if(!this.registration.students){
      this.registration.students = [];
    }

    if(!student){
      student = new Student();
      student.id = this.registration.students.length * -1;
    }
    if(this.course && this.course.useBirthDayOption===true){
      student.useBirthDay = true;
    }

    const modal = await this.modalController.create({
      component: StudentPage,
      componentProps: {
        student:student,
        enableLiftTicket:this.enableLiftTicket,
        enableRental:this.enableRental,
        ageRangeOptions:this.ageRangeOptions,
        levelOptions:this.levelOptions,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if(data){
      let resultStudent:Student = data;
      let found:boolean = false;
      for (let _i = 0; _i < this.registration.students.length; _i++) {
        let studentInList = this.registration.students[_i];
        if(student.id===studentInList.id){
          found = true;
        }
      }
      if(!found){
        this.registration.students.push(resultStudent);
      }
      this.validateStudent(resultStudent);
    }

    if(this.registration.students && this.registration.students.length>0){
      this.namesEmptyError = null;
    }else{
      this.namesEmptyError = "StudentNames required";
    }

    this.l_checkStudentsCount(true);
  }

  validateStudent(student:Student, index?:number){
    if(!student.name || (!student.ageRangeOptionId && !student.birthDay) || !student.levelOptionId){
      let errorMesg = null;
      if(student.name){
        errorMesg = this.translateUtil.translateKey("Student ") + student.name +
          this.translateUtil.translateKey(" missing required information, please fill in all required fields.");
        student.error = errorMesg;
        this.toastUtil.showToast(errorMesg);
      }else{
        errorMesg = this.translateUtil.translateKey("Student number ") + index +
          this.translateUtil.translateKey(" missing required information, please fill in all required fields.");
        student.error = errorMesg;
        this.toastUtil.showToast(errorMesg);
      }
      return;
    }else{
      student.error = null;
    }
  }

  onDeleteStudentName(student:Student){
    if(!student){
      return;
    }
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to remove this student?'), null, null,
      this.translateUtil.translateKey('CANCEL'), null,
      this.translateUtil.translateKey('Remove'),
      (data) => {
        if (student && this.registration.students) {
          for (let _i = 0; _i < this.registration.students.length; _i++) {
            let studentTemp = this.registration.students[_i];
            if (student.ageRangeOptionId === studentTemp.ageRangeOptionId && student.levelOptionId === studentTemp.levelOptionId && student.name === studentTemp.name) {
              this.registration.students.splice(_i, 1);
            }
          }
        }
        this.l_checkStudentsCount(true);
      }
    );
  }


  onRegisterDetails(regUserId:number){
    console.log("Good onRegisterDetails, regUserId: " + regUserId);
    if(!regUserId || regUserId<=0 || !this.appSession.l_getUserId()){
      return;
    }
    this.userService.s_getUserPreviewById(this.appSession.l_getUserId(), regUserId, (userBrief:UserInfo) => {
      if(userBrief){
        console.log("Got userBrief for member, userName: " + userBrief.userName);
        this.l_showPopup(userBrief, null, null);
      }
    });
  }

  onInstructorDetails(instructorId:number){
    if(!instructorId || instructorId<=0 || !this.appSession.l_getUserId()){
      return;
    }

    console.log("Good onInstructorDetails. instructorId: " + instructorId);
    this.providersService.s_getUserBriefByInstructorId(this.appSession.l_getUserId(), instructorId, (userBrief:UserInfo) => {
      if(userBrief){
        console.log("Got userBrief for instructor, userName: " + userBrief.userName);
        this.l_showPopup(userBrief, this.instructor?this.instructor.skiLevel:null, this.instructor?this.instructor.boardLevel:null);
      }
    });
  }

  l_showPopup(userBrief:UserInfo, instructorSkiLevel, instructorSnowboardLevel){
    let contentStr = "UserName: " + userBrief.userName + "<br>" +
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

    this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey('User Brief'), contentStr);
  }

  l_scrollToId(id:string, append?:number):boolean{
    let element = document.getElementById(id);
    if(!element){
      return false;
    }
    let yOffset = document.getElementById(id).offsetTop;
    console.log("scrollY: " + yOffset);
    if(append){
      yOffset = yOffset + append;
    }
    this.content.scrollToPoint(0, yOffset+100, 200);
    return true;
  }

  l_getProviderCourseType(pcTypeId:number):ProviderCourseTypeWithDetails{
    if(!this.availableProviderCourseTypes){
      return null;
    }
    for(let pcType of this.availableProviderCourseTypes){
      if(pcType.id===pcTypeId){
        return pcType;
      }
    }
    return null;
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

  async onConfirm() {
    if(this.utils.checkDebounce("SkiCourseRegistrationConfirmPage.onConfirm")){
      console.log("SkiCourseRegistrationConfirmPage.onConfirm debounced!");
      return;
    }
    this.l_onConfirm();
  }

  async l_onConfirm(){
    console.log("Good onConfirm().");
    this.submitted = true;

    if(!this.registration){
      this.toastUtil.showToastTranslate("Null registration!");
      return;
    }

    if(!this.registration.providerId){
      this.toastUtil.showToastTranslate("Undefined provider!");
      return;
    }

    if (!this.registration.providerCourseTypeId) {
      this.toastUtil.showToastTranslate("Class type is required!");
      this.l_scrollToId("skiCourseTypeId");
      return;
    }

    if (!this.registration.isConsent) {
      this.toastUtil.showToastTranslate("Please review and accept consent before proceed.");
      this.l_scrollToId("consentId");
      return;
    }

    let pcType = this.l_getProviderCourseType(this.registration.providerCourseTypeId);
    if(!pcType){
      this.toastUtil.showToastTranslate("Can not find provider Class type!");
      this.l_scrollToId("skiCourseTypeId");
      return;
    }

    if (!this.registration.learnTypeId) {
      this.toastUtil.showToastTranslate("Learn type is required!");
      this.l_scrollToId("learnTypeId");
      return;
    }

    if (!this.registration.students || this.registration.students.length === 0) {
      this.content.scrollToBottom();
      this.namesEmptyError = this.translateUtil.translateKey("Student can not be empty!");
      this.toastUtil.showToastTranslate("Student can not be empty!");
      this.l_scrollToId("addStudentBtnId");
      return;
    } else {
      this.namesEmptyError = null;
    }

    // check each student;
    if(this.registration.students && this.registration.students.length>0){
      let studentsInRange = this.l_checkStudentsCount(true);
      if(!studentsInRange){
        return;
      }

      let index:number = 0;
      let levelOptionsId:number = null;
      for(let student of this.registration.students){
        this.validateStudent(student);

        if(student.error){
          this.l_scrollToId("student_" + index, 200);
          return;
        }

        // check level;
        if(!levelOptionsId){
          levelOptionsId = student.levelOptionId;
        }
        if((!this.course || !this.course.isCamp) && levelOptionsId !== student.levelOptionId){
          this.toastUtil.showToastTranslate("All students must be at same level!");
          return;
        }

        index = index + 1;
      }
    }

    if(this.registration && !this.registration.userId){
      this.registration.userId = this.appSession.l_getUserId();
    }

    this.l_checkStudentsCount(true);

    // check seleced sessionTime;
    if(this.course && this.course.allowSelectSessions===true && this.course.sessionTimes && this.course.sessionTimes.length>0){
      let hasChecked = false;
      let chosenSessionStr = "";

      this.course.sessionTimes.sort((s1:SessionTime,s2:SessionTime) => {
        return (s1.id-s2.id);
      });

      this.registration.selectedSessionTimes = [];
      this.sessionTimeError = null;

      for(let sessionTime of this.course.sessionTimes){
        // check if mandatory session is checked;
        if(sessionTime.mandatory && !sessionTime.checked){
          this.toastUtil.showToast("Please select mandatory session " + sessionTime.name + " to continue.");
          return;
        }

        if(sessionTime.checked){
          hasChecked = true;
          if(this.registration.selectedSessionTimes.indexOf(sessionTime)<0){
            this.registration.selectedSessionTimes.push(sessionTime);
          }

          chosenSessionStr = chosenSessionStr + sessionTime.name + ", " +
            this.utils.formatDateShort(sessionTime.startTime) + " " +
            this.utils.formatTimeOfDate(sessionTime.startTime) + " to " +
            this.utils.formatTimeOfDate(sessionTime.endTime) + " " +
            (sessionTime.tripHillName?sessionTime.tripHillName:"") +
            ";<br> ";
        }
      }
      this.registration.selectedSessionsStr = chosenSessionStr;

      if(!hasChecked){
        this.sessionTimeError = "Please choose session.";
        this.toastUtil.showToast("Please choose session.");
        return;
      }
    }

    // get student space for this registration or course;
    let regLimit = 0;
    if(this.course && this.course.registStudentLimit>0){
      regLimit = this.course.registStudentLimit;
    }else{
      regLimit = this.pcTypeMaxStudents;
    }
    let studentSpace = regLimit - this.registration.students.length;
    if(studentSpace>0){
      if(this.course && this.course.isCamp){
        console.log("No need to notice for trip event.");
        this.sendOutRegistration();
      }else{
        this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('You still can add ' + studentSpace + ' students.'),
            null, this.translateUtil.translateKey("Cancel to add more student, or register to send out confirmation."), this.translateUtil.translateKey('Cancel'), null,
            this.translateUtil.translateKey('Register'),
            (data) => {
              this.sendOutRegistration();
            }
        );
      }
    }else{
      this.sendOutRegistration();
    }
  }

  async sendOutRegistration() {
    if (this.myModal) {
      this.myModal.dismiss();
    }

    if(this.userId){
      this.registration.userId = this.userId;
    }

    // not logged in, and no email, go for guest checkout;
    if(!this.registration.userId && !this.registration.email) {
      const modal = await this.modalCtrl.create({
        component: GuestCheckoutPage,
        componentProps: {registration: this.registration},
      });
      await modal.present();
      const {data} = await modal.onDidDismiss();
      let guestRegistration: CourseRegistration = data;

      if (!guestRegistration || !guestRegistration.email) {
        this.toastUtil.showToast("Guest registration contact email can not be empty!");
        return;
      }

      this.registration = guestRegistration;
    }

    // check if the email has been used for this course registration;
    if (this.registration.email && this.course && this.course.registrations) {
      for (let regist of this.course.registrations) {
        if (regist.email && regist.email === this.registration.email) {
          this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('This email address has registered this lesson already, do you want to register again?'),
            null, null, this.translateUtil.translateKey('No'), null, this.translateUtil.translateKey('Yes'),
            (dataResult) => {
              this.doRegisterCourse();
            });
          return;
        }
      }
    }else if(this.registration.courseId>0 && this.registration.userId>0){
      // if registering course for userId, check if have registered or not;
      this.providersService.s_getCourseRegistrationsCountForCourseIdAndUser(this.registration.courseId, this.registration.userId, (count:number) => {
        if(count>0){
          this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('You have registered already. Continue?'),
            null, null, this.translateUtil.translateKey('No'), null, this.translateUtil.translateKey('Yes'),
            (dataResult) => {
              this.doRegisterCourse();
            });
        }else{
          this.doRegisterCourse();
        }
      });
      return;
    }

    this.doRegisterCourse();
  }

  private doRegisterCourse(){
    if(this.provider && this.provider.onlineMembership===false){
      // Not considering membership for now;
      this.registration.isMember = false;

      // KEEP THIS!! FOR FUTURE REQUIRED MEMBERSHIP FUNCTIONS!
      // let alert = this.alertCtrl.create();
      // alert.setTitle(this.translateUtil.translateKey('Are you member of ' + this.provider.name + "?"));
      // alert.setSubTitle("Member may have discount. Membership will be validated. If you are not sure, please content " + this.provider.name + " or your instructor.");
      // alert.addButton({
      //   text: this.translateUtil.translateKey('Not Member'),
      //   handler: data => {
      //     this.registration.isMember = false;
      //     this.paymentProcessUtil.checkAnyPayCourse(this.registration, this.navCtrl);
      //   }
      // });
      // alert.addButton({
      //   text: this.translateUtil.translateKey('Member'),
      //   handler: data => {
      //     this.registration.isMember = true;
      //     this.paymentProcessUtil.checkAnyPayCourse(this.registration, this.navCtrl);
      //   }
      // });
      // alert.present();
    }

    let payOfflineOnly = false;
    if(this.provider && this.provider.payOffline && !this.provider.payOnline){
      payOfflineOnly = true;
    }
    this.coursePaymentService.updateCourseRegistrationLock(true);
    this.paymentProcessUtil.checkAnyPayCourse(this.registration, this.navCtrl, payOfflineOnly);
  }
}
