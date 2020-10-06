import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonContent, LoadingController,
  ModalController,
  NavController,
  Platform
} from '@ionic/angular';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {Utils} from "../../../../services/utils.service";
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AppSession} from "../../../../services/app-session.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {Course} from "../../../../models/Course";
import {ProviderCourseTypeWithDetails} from "../../../../models/ProviderCourseTypeWithDetails";
import {CodeTableService} from "../../../../services/code-table-service.service";
import {SessionTime} from "../../../../models/SessionTime";
import {CourseRegistration} from "../../../../models/CourseRegistration";
import * as moment from 'moment';
import {CourseUtil} from "../../../../services/course-util.service";
import {CallbackValuesService} from "../../../../services/callback-values.service";
import {InstructorWithDetails} from "../../../../models/InstructorWithDetails";
import {GuestCheckoutPage} from "../../guest-checkout/guest-checkout.page";
import {SelectRegistrationPage} from "./select-registration/select-registration.page";
import {GeneralResponse} from "../../../../models/transfer/GeneralResponse";
import {Subscription} from "rxjs";
import {CreateQuestionComponent} from "../../question-answers/create-question/create-question.component";
import {Question} from "../../../../models/userRelationship/Question";
import {AttachedFile} from '../../../../models/AttachedFile';
import {AttachedFileService} from '../../../../services/attached-file.service';
import {Provider} from "../../../../models/Provider";

@Component({
  selector: 'app-ski-course-details',
  templateUrl: './ski-course-details.page.html',
  styleUrls: ['./ski-course-details.page.scss'],

  providers: [
    SocialSharing,
  ],
})
export class SkiCourseDetailsPage extends BasicUserIdPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;
  private myModal:any;

  // These ids are for create course relationship to SkiEvent or SkiProvider;
  providerId:number = null;
  provider:Provider = null;

  userId:number = null;
  courseId:number = null;
  course:Course = null;
  instructorUserId:number = null;
  callback:any = null;
  disableModifyButtons:boolean = true;
  pcTypes:ProviderCourseTypeWithDetails[];
  courseStudentCount:number = 0;
  isFavorite:boolean = false;

  loading:any = null;
  isApp:boolean = true;
  loadCount:number = 0;
  files = [];
  fileNames = [];
  allowedNumberOfVideos: number = 2;

  attachedVideos:AttachedFile[] = [];
  attachedFiles:AttachedFile[] = [];
  youtubeLinks:string[] = [];

  expendedCourseInstructors:boolean;

  private subscription:Subscription;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public platform:Platform,
              private socialSharing: SocialSharing, private actionsheetCtrl:ActionSheetController,
              private codeTableService:CodeTableService, private courseUtil:CourseUtil, private modalCtrl:ModalController,
              private alertCtrl:AlertController, private callbackValues:CallbackValuesService,
              private attachedFileService:AttachedFileService, private loadingCtrl:LoadingController,) {
    super(appSession, router, appConstants);

    this.userId = this.appSession.l_getUserId();
    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.courseId = this.router.getCurrentNavigation().extras.state.courseId;
        this.course = this.router.getCurrentNavigation().extras.state.course;

        this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
          this.provider = provider;
        });
        this.updateYoutubeLinks();
      }
    });
  }

  ngOnInit() {
    if(!this.providerId){
      this.providerId = parseInt(this.route.snapshot.paramMap.get('providerId'));
      this.courseId = parseInt(this.route.snapshot.paramMap.get('courseId'));
    }
  }

  ionViewWillEnter() {
    if(!this.providerId) {
      this.toastUtil.showToastTranslate("Empty provider!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    console.log("Good ionViewWillEnter().");
    this.l_getParameters();
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
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  l_getParameters(){
    if(!this.providerId){
      this.toastUtil.showToast("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    this.appSession.checkProviderContext(true, this.providerId, null, null);

    if(this.courseId){
      this.updatePageContent();
      this.checkFavorite();
    }else{
      if(!this.course){
        console.log("courseId is empty!");
        return;
      }else{
        this.courseId = this.course.id;
        this.checkFavorite();
        this.l_updateCourseTypes(this.course);
      }
    }
  }

  l_updateCourseTypes(course:Course){
    if(!course){
      return;
    }
    this.providerService.s_getProviderCourseTypesByProviderId(this.providerId, true, (pcTypes:ProviderCourseTypeWithDetails[]) => {
      this.pcTypes = [];
      if(pcTypes && pcTypes.length>0){
        for(let pcType of pcTypes){
          if(pcType.id===course.providerCourseTypeId){
            this.pcTypes.push(pcType);
          }
        }
        if(this.pcTypes.length===0){
          this.pcTypes = this.pcTypes.concat(pcTypes);
        }
      }
    });
  }

  updatePageContent(){
    this.providerService.s_getCoursesDetailsById(this.courseId, (course:Course) => {
      if(!course){
        this.toastUtil.showToast("Can not find lesson!");
        this.router.navigate([this.appConstants.ROOT_PAGE]);
        return;
      }
      this.course = course;
      this.updateYoutubeLinks();
      this.getCourseAttachedFiles();
      this.l_updateCourseTypes(this.course);
      this.getCourseStudentCount();
      this.getCourseExtraInstructors();
    });
  }

  async getCourseStudentCount(){
    await this.providerService.s_getCourseStudentCount(this.courseId, (count:number) => {
      if(!count || count<0){
        count = 0;
      }
      this.courseStudentCount = count;
    });
  }

  getCourseExtraInstructors(){
    if(!this.course || !this.courseId || this.courseId<=0){
      return;
    }
    this.providerService.s_getInstructorsForCourseId(this.courseId, (instructors:InstructorWithDetails[]) => {
      this.course.instructors = instructors;
    });
  }

  updateYoutubeLinks(){
    if(!this.course || !this.course.youtubeLinks || this.course.youtubeLinks.length===0){
      return;
    }
    this.youtubeLinks = this.course.youtubeLinks.split(";");
  }

  checkFavorite(){
    if(!this.userId){
      this.isFavorite = false;
      return;
    }
    if(!this.courseId){
      this.isFavorite = false;
      return;
    }
    this.providerService.s_checkFavoriteCourse(this.userId, this.courseId, (isFavorite:boolean) => {
      this.isFavorite = isFavorite;
    });
  }

  onToggleCourseInstructors(){
    console.log("Good onToggleCourseInstructors().");
    this.expendedCourseInstructors = !this.expendedCourseInstructors;
  }

  onDeleteCourseInstructor(instructor){
    console.log("Good onDeleteCourseInstructor(instructor).");
    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to remove this instructor from course?", null, null, "Cancel", null, "Remove", () => {
      if(!instructor || !instructor.id || !this.course.instructors){
        return;
      }
      for(let i=0; i<this.course.instructors.length; i++){
        let tempInst = this.course.instructors[i];
        if(tempInst.id===instructor.id){
          this.course.instructors.splice(i, 1);
        }
      }
      this.providerService.deleteCourseInstructor(this.userId, this.courseId, instructor.id, (result:boolean) => {
        if(result){
          this.toastUtil.showToast("Course instructor deleted.");
        }else{
          this.toastUtil.showToast("Delete course instructor failed!");
        }
      });
    });
  }

  onAddCourseInstructor(){
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
            if(!this.course.instructors){
              this.course.instructors = [];
            }
            for(let instructor of data){
              if(this.course.instructors.indexOf(instructor)<0){
                this.course.instructors.push(instructor);
              }
            }
            if(this.course.instructors.length>0){
              this.expendedCourseInstructors = true;

              let instructorIds:number[] = [];
              for(let inst of this.course.instructors){
                instructorIds.push(inst.id);
              }
              this.providerService.saveCourseInstructors(this.userId, this.courseId, instructorIds, (result:boolean) => {
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

  onAddFavorite(){
    console.log("Good onFavorite(): ");

    if(!this.userId){
      this.utils.showOkAlert(this.alertCtrl, "Please login first.", "If you don't have an account yet, please register one.");
      return;
    }
    if(!this.courseId){
      return;
    }

    this.providerService.s_addFavoriteCourse(this.userId, this.courseId, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Program/Lesson added to Favorites.");
      }
      this.checkFavorite();
    });
  }

  onRemoveFavorite(){
    console.log("Good onRemoveFavorite.");
    if(!this.userId){
      this.utils.showOkAlert(this.alertCtrl, "Please login first.", "If you don't have an account yet, please register one.");
      return;
    }
    if(!this.courseId){
      return;
    }

    this.providerService.s_removeFavoriteCourse(this.userId, this.courseId, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Program/Lesson removed from Favorites.");
      }
      this.checkFavorite();
    });
  }

  onAttachFile(e){
    console.log("Good onAttachFile().");
    this.fileNames = [];
    this.files = [];
    let reader = new FileReader();
    if(e.target.files && e.target.files.length>0){
      if(e.target.files.length > this.allowedNumberOfVideos){
        this.notAllowedToast();
        return;
      }

      for(let file of e.target.files){
        if(file.size>this.appConstants.MAX_UPLOAD_FILE_SIZE){
          this.utils.showOkAlert(this.alertCtrl, "File size limit is " + (this.appConstants.MAX_UPLOAD_FILE_SIZE/1000000) + "M", null);
          return;
        }

        this.fileNames.push(file.name);

        reader.readAsDataURL(file);
        reader.onload = (ev: any) => {
          this.files.push(ev.target.result);
        };
      }

      this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to attach selected file(s) to this lesson?", "", "", "Cancel", null, "Attach",
        () => {
          this.showLoading();
          this.loadCount = 0;

          for(let i = 0; i < this.files.length; i++){
            this.loadCount = this.loadCount + 1;

            let fileContent = this.files[i];
            let fileName= this.fileNames[i];
            let content = fileContent.split(',')[1];
            this.uploadFileToServer(content, fileName, this.courseId);

            this.files.splice(i, 1);
            this.fileNames.splice(i, 1);
          }
        });
    }
  }

  onUpdateDescription(attachedFile:AttachedFile){
    console.log("Good onUpdateDescription");
    if(!attachedFile){
      return;
    }
    attachedFile.isEdit = true;
    attachedFile.tempDescription = attachedFile.description;
  }

  onSaveDescription(attachedFile:AttachedFile){
    console.log("Good onSaveDescription.");

    attachedFile.description = attachedFile.tempDescription;
    this.attachedFileService.s_updateFile(this.userId, attachedFile, (result:AttachedFile) => {
      attachedFile.description = result.description;
    });

    attachedFile.isEdit = false;
    attachedFile.tempDescription = attachedFile.description;
  }

  onCancelDescription(attachedFile:AttachedFile){
    console.log("Good onCancelDescription.");
    attachedFile.isEdit = false;
    attachedFile.tempDescription = attachedFile.description;
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

  private uploadFileToServer(base64Content:string, fileName:string, courseId:number){
    this.attachedFileService.s_createFileForCourseId(this.appSession.l_getUserId(), base64Content, fileName, courseId, (resultVideo:AttachedFile) => {
      this.loadCount = this.loadCount -1;
      if(this.loadCount<=0){
        if(resultVideo){
          this.toastUtil.showToast("Upload successfully.");
        }
        this.fileNames = [];
        this.files = [];

        this.dismissLoading();
        this.updatePageContent();
      }
    });

    // In case network connection is gone, release the page;
    this.appSession.subscribeNetwork((connected:boolean) => {
      if(!connected){
        console.log("Connection is gone, release page.");
        this.dismissLoading();
      }
    });
  }

  notAllowedToast() {
    this.toastUtil.showToast("Allowed only " + this.allowedNumberOfVideos + " videos to be selected at a time.");
  }

  deleteAttachedFile(fileId){
    console.log("Good deleteAttachedFile, fileId: " + fileId);
    if(!fileId){
      return;
    }
    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete the attached file?", null, null, "Cancel", null, "Delete", () => {
      this.attachedFileService.s_deleteCourseAttachedFile(this.userId, fileId, (result:boolean) => {
        if(result){
          this.toastUtil.showToast("Attached file deleted.");
        }
        this.updatePageContent();
      });
    });
  }

  downloadLocalFile(fileId){
    console.log("Good downloadFile, fileId: " + fileId);

    this.attachedFileService.s_getAttachedFileContentById(fileId, (attachedFile:AttachedFile) => {
      console.log("Got content back.");
      if(!attachedFile){
        this.toastUtil.showToastTranslate("Can not get attached file by id: " + fileId);
        return;
      }
      if(attachedFile.based64Content){
        this.utils.downloadFile(attachedFile.fileName, attachedFile.based64Content);
      }else{
        console.log("Empty bytes content!");
      }
    });
  }

  getVideoURL(videoId:number){
    return this.attachedFileService.s_getVideoURL(this.userId, videoId);
  }

  getCourseAttachedFiles(){
    this.attachedVideos = [];
    this.attachedFiles = [];

    if(!this.course || !this.course.attachedFiles){
      return;
    }

    for(let attachedFile of this.course.attachedFiles){
      if(attachedFile.mediaType===this.appConstants.MEDIA_VEDIO){
        this.attachedVideos.push(attachedFile);
      }else{
        this.attachedFiles.push(attachedFile);
      }
    }
  }

  onChooseInstructor(){
    console.log("Good onChooseInstructor().");

    let componentName = 'SkiCourseDetailsPage' + this.utils.getTime();
    let navigationExtras: NavigationExtras = {
      state: {
        CALLBACK_HOOKED_COMPONENT: componentName,
        providerId:this.providerId, fromCommand:this.appConstants.PAGE_FOR_CHOOSE
      }
    };
    this.router.navigate(['ski-instructors', this.utils.getTime()], navigationExtras);

    this.subscription = this.callbackValues.callbackDataSubject.subscribe((callbackValue) => {
      if(!callbackValue || !callbackValue.target || callbackValue.target!==componentName || !callbackValue.values){
        return;
      }
      let instructor:InstructorWithDetails = callbackValue.values['instructor'];
      if(instructor && instructor.id>0){
        this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to set lesson to this instructor?'),
          "Instructor: " + instructor.name, null, this.translateUtil.translateKey('No'), null,
          this.translateUtil.translateKey('Yes'),
          (data) => {
            this.providerService.s_setCourseInstructorId(this.appSession.l_getUserId(), this.courseId, instructor.id, (result:boolean) =>{
              if(result){
                this.toastUtil.showToastTranslate("Set instructor successfully.");
              }else{
                this.toastUtil.showToastTranslate("Failed set instructor.");
              }
              this.updatePageContent();
              if(this.callback){
                this.callback();
              }
            });
          });
      }
    });
  }

  onChooseInstructorTeachClassType(){
    console.log("Good onChooseInstructorTeachClassType().");
    // this.navCtrl.push('SkiInstructors', {providerId:this.providerId, providerCourseTypeId:this.course.providerCourseTypeId, fromCommand:this.appConstants.PAGE_FOR_CHOOSE, callback: (instructor:InstructorWithDetails) => {
    //     if(instructor){
    //       let alert = this.alertCtrl.create();
    //       alert.setTitle(this.translateUtil.translateKey('Are you sure to set course to this instructor?'));
    //       alert.setSubTitle( "Instructor: " + instructor.name);
    //       alert.addButton(this.translateUtil.translateKey('No'));
    //       alert.addButton({
    //         text: this.translateUtil.translateKey('Yes'),
    //         handler: data => {
    //           this.providerService.s_setCourseInstructorId(this.appSession.l_getUserId(), this.courseId, instructor.id, (result:boolean) =>{
    //             if(result){
    //               this.toastUtil.showToastTranslate("Set course instructor successfully.");
    //             }else{
    //               this.toastUtil.showToastTranslate("Failed set course instructor.");
    //             }
    //             this.updatePageContent();
    //             if(this.callback){
    //               this.callback();
    //             }
    //           })
    //         }
    //       });
    //       alert.present();
    //     }
    //   }})
  }

  onDeleteInstructor(){
    console.log("Good onDeleteInstructor().");
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to delete this instructor?'), null,
      null, this.translateUtil.translateKey('Cancel'), null, this.translateUtil.translateKey('Delete'),
      (data) => {
          this.providerService.s_setCourseInstructorId(this.appSession.l_getUserId(), this.courseId, -1, (result:boolean) =>{
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

  async onEditSession(sessionTime:SessionTime){
    if(!sessionTime){
      return;
    }
    if(!this.userId){
      return;
    }

    console.log("Good onEditSession.");
    if(this.appSession.l_hasAboveInstructorAccess(this.providerId)){
      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.providerId,
          sessionTime:sessionTime
        }
      };
      this.router.navigate(['session-time'], navigationExtras);
    }
  }

  async onAddSession(){
    console.log("Good onAddSession.");

    let sessionTime = new SessionTime();
    sessionTime.courseId = this.course.id;
    sessionTime.instructorId = this.course.instructorId;
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId,
        sessionTime:sessionTime
      }
    };
    this.router.navigate(['session-time'], navigationExtras);
  }

  onToggleSessionTimes(course:Course){
    console.log("Good onToggleSessionTimes.");
    if(!course){
      return;
    }
    course.sessionTimesExpended = !course.sessionTimesExpended;
  }

  onToggleRegistrations(course){
    console.log("Good onToggleRegistrations.");
    if(!course){
      return;
    }
    course.registrationsExpended = !course.registrationsExpended;
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

  onViewRegDetails(event, registration){
    console.log("Good onViewRegDetails, registrationId: " + registration);
    if(!registration || !registration.id){
      return;
    }
    if(registration.ownerUserId!==this.userId && !this.appSession.l_hasAboveInstructorAccess(this.providerId)){
      return;
    }

    let navigationExtras: NavigationExtras = {
      state: {
        registrationId: registration.id, providerId:this.providerId
      }
    };
    this.router.navigate(['ski-course-registration-details'], navigationExtras);
  }

  removeRegistration(regId:number){
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Remove registration from lesson?'), null, null,
      this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('Remove'),
      (data) => {
        this.providerService.s_removeRegistrationFromCourse(this.appSession.l_getUserId(), regId, (result:boolean) => {
          this.updatePageContent();
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

  getRegistrationLine(registration:CourseRegistration):string{
    if(!registration){
      return null;
    }

    let line = "" + registration.title + ", " +
      (registration.registerName?(registration.registerName + ", "):"") +
      (registration.contactName?("Guest:"+registration.contactName + ", "):"") +
      (registration.paymentStatusName?(registration.paymentStatusName + ", "):"");
    return line;
  }

  onRegisterCoruse() {
    console.log("Good onRegisterCoruse().");
    if (this.course.createdTypeId!==this.appConstants.COURSE_CREATED_FROM_INSTRUCTOR) {
      // this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey("Not a instructor's course, can not register."), null);
      // return;
    }

    if (!this.course.open) {
      this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey("Lesson closed, can not register."), null);
      return;
    }

    //check deadline;
    if (this.course.deadLine) {
      if (moment(this.course.deadLine).isBefore(new Date())) {
        this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey("Lesson register deadline passed, can not register."), null);
        return;
      }
    }

    this.providerService.s_checkCourseStudentSpace(this.course.id, (roomCount:number) => {
      if(roomCount===0){
        let alert = this.alertCtrl.create();
        this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey("This lesson has been fully booked."),
          this.translateUtil.translateKey("Please choose another lesson and continue."));
      }else{
        this.proceedRegisterCourse();
      }
    });
  }

  async proceedRegisterCourse() {
    if (this.course.registerCode) {
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
              if (regCode && regCode === this.course.registerCode) {
                this.continueRegisterCourse();
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
      this.continueRegisterCourse();
    }
  }

  async continueRegisterCourse() {
    // check user or guest;
    if(!this.appSession.l_getUserId()){
      const alert = await this.alertCtrl.create({
        header: this.translateUtil.translateKey("Has account?"),
        inputs: [
        ],
        buttons: [
          {
            text: this.translateUtil.translateKey('Guest Checkout'),
            handler: (data) => {
              this.l_guestCheckOut();
            }
          },
          {
            text: this.translateUtil.translateKey('Sign Up or Login'),
            handler: (data) => {
              let backUrls:any[] = ["ski-course-details", this.providerId, this.courseId];

              let navigationExtras: NavigationExtras = {
                state: {
                  backUrls: backUrls,
                  providerId:this.providerId,
                  memberRegistration:true,
                }
              };
              this.router.navigate(['login'], navigationExtras);
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }
        ]
      });
      await alert.present();
      return;
    }

    let registrationRequest = this.l_prepareRegistration();
    this.doRegisterCourse(registrationRequest);
  }

  async l_guestCheckOut(){
    let registrationRequest = this.l_prepareRegistration();

    if (this.myModal) {
      this.myModal.dismiss();
    }

    const modal = await this.modalCtrl.create({
      component: GuestCheckoutPage,
      componentProps: {registration:registrationRequest},
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    let guestRegistration:CourseRegistration = data;
    if(!guestRegistration || !guestRegistration.email){
      this.toastUtil.showToast("Guest lesson registration contact email can not be empty!");
      return;
    }

    this.doRegisterCourse(guestRegistration);
  }

  private doRegisterCourse(registration:CourseRegistration){
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, registration:registration, availableCourseTypes:this.pcTypes, course:this.course
      }
    };
    this.router.navigate(['ski-course-registration-confirm'], navigationExtras);
  }

  l_prepareRegistration():CourseRegistration{
    // create registration;
    let startTime = null;
    let endTime = null;
    if(this.course.sessionTimes && this.course.sessionTimes.length===1){
      startTime = this.course.sessionTimes[0].startTime;
      endTime = this.course.sessionTimes[0].endTime;
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

    let registrationRequest = new CourseRegistration();
    registrationRequest.title = userName + " registration for " + this.course.name;
    registrationRequest.providerId = this.providerId;
    registrationRequest.instructorId = null;
    registrationRequest.providerCourseTypeId = this.course.providerCourseTypeId;
    registrationRequest.providerCourseTypeName = this.course.providerCourseTypeName;
    registrationRequest.learnTypeId = this.course.learnTypeId;
    registrationRequest.learnTypeName = this.course.learnTypeName;
    registrationRequest.userId = this.appSession.l_getUserId();
    registrationRequest.courseId = this.courseId;
    registrationRequest.courseName = this.course.name;
    registrationRequest.tripHillId = this.course.tripHillId;
    registrationRequest.tripHillName = this.course.tripHillName;
    registrationRequest.registerName = name;
    registrationRequest.instructorName = null;
    registrationRequest.consentMandatory = this.course.consentMandatory;

    return registrationRequest;
  }

  onEdit() {
    let navigationExtras: NavigationExtras = {
      state: {
        courseId:this.courseId,
        providerId:this.providerId
      }
    };
    this.router.navigate(['ski-course-edit', this.providerId+"_"+this.courseId], navigationExtras);
  }

  onDelete(){
    let message = null;
    if(this.course.registrations && this.course.registrations.length>0){
      message = "This course has registrations. Deleting this course will course error when cancel the registrations! Please delete registrations first.";
    }

    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Delete lesson?'), message, null,
      this.translateUtil.translateKey('CANCEL'), null,
      this.translateUtil.translateKey('Delete'),
      (data) => {
        this.l_delete();
      });
  }

  l_delete(){
    this.providerService.s_deleteSkiCourse(this.appSession.l_getUserId(), this.courseId, (result:boolean) => {
      if(result){
        this.toastUtil.showToastTranslate("Lesson deleted.");
      }
      this.onClose();
    });
  }

  async onAddRegistration(){
    if (this.myModal) {
      this.myModal.dismiss();
    }

    const modal = await this.modalCtrl.create({
      component: SelectRegistrationPage,
      componentProps: {courseTypeId: this.course.providerCourseTypeId, providerId:this.providerId},
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    let selectedRegistration:CourseRegistration = data;
    if(selectedRegistration){
      if(this.course.sessionTimes && this.course.sessionTimes.length===1){
        this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Registration startTime and andTime will be updated according to selected lesson. Continue?'),
          null, null, this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('Assign to lesson'),
          (dataResult) => {
            this.providerService.s_assignRegistrationToCourse(this.appSession.l_getUserId(), this.courseId, selectedRegistration.id, () => {
              this.updatePageContent();
            });
          });
      }else{
        this.providerService.s_assignRegistrationToCourse(this.appSession.l_getUserId(), this.courseId, selectedRegistration.id, () => {
          this.updatePageContent();
        });
      }
    }
  }

  onViewSummary(){
    console.log("Good onViewSummary().");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: this.providerId, courseId: this.courseId
      }
    };
    this.router.navigate(['course-summary'], navigationExtras);
  }

  shareSheetShare() {
    if(!this.courseId||!this.course){
      return;
    }

    let url = "https://www.kapok-tree.com/#/ski-course-details/" + this.providerId + "/" + this.courseId;
    console.log("url: " + url);
    if(this.platform.is('cordova')){
      this.socialSharing.share("Lesson " + this.course.name, " details", null, url).then(() => {
        console.log("shareSheetShare: Success");
      }).catch(() => {
        console.error("shareSheetShare: failed");
      });
    }else{
      this.utils.showOkAlertForSharing(this.alertCtrl, "Sharing from browser", "If you are on browser, please copy and share the link below.", url);
    }
  }

  async onAskQuestion(){
    if(!this.userId){
      this.utils.showOkAlert(this.alertCtrl, "Please login first.", "If you don't have an account yet, please register one.");
      return;
    }else{
      await this.l_getInstructorUserId(this.course.instructorId);

      let question:Question = new Question();
      question.userId = this.userId;
      question.courseId = this.courseId;
      question.assignedUserId = this.course.instructorId;
      question.providerId = this.providerId;
      question.isOpen = true;
      question.createdDate = new Date();
      question.lastUpdatedDate = new Date();
      question.acceptVideo = this.course.acceptVideo;

      const modal = await this.modalCtrl.create({
        component: CreateQuestionComponent,
        componentProps: {question:question},
      });
      await modal.present();
    }
  }

  async l_getInstructorUserId(instructorId:number){
    if(!instructorId || instructorId<=0){
      return;
    }
    await this.providerService.s_getSkiInstructorDetailsById(instructorId, (instructor:InstructorWithDetails) => {
      if(!instructor){
        return null;
      }else{
        this.instructorUserId = instructor.userId;
      }
    });
    if(this.instructorUserId){
      return this.instructorUserId;
    }
    return null;
  }

  onClose(){
    this.navCtrl.pop();
  }

  goHome(){
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  onDuplicate(){
    console.log("Good onDuplicate().");
    let newCourse = new Course();
    newCourse.ownerUserId = this.userId;
    newCourse.providerId = this.providerId;
    newCourse.createdTypeId = this.appConstants.COURSE_CREATED_FROM_INSTRUCTOR;
    newCourse.open = true;
    newCourse.instructorId = this.course.instructorId;

    newCourse.instructorName = this.course.instructorName;
    newCourse.instructorReviewScore = this.course.instructorReviewScore;
    newCourse.instructorReviewCount = this.course.instructorReviewCount;
    newCourse.providerCourseTypeId = this.course.providerCourseTypeId;
    newCourse.providerCourseTypeName = this.course.providerCourseTypeName;
    newCourse.description = this.course.description;
    newCourse.conditionStr = this.course.conditionStr;
    newCourse.learnTypeId = this.course.learnTypeId;
    newCourse.learnTypeName = this.course.learnTypeName;
    newCourse.deadLine = this.course.deadLine;
    newCourse.courseTime = this.course.courseTime;
    newCourse.totalStudentLimit = this.course.totalStudentLimit;
    newCourse.registStudentLimit = this.course.registStudentLimit;
    newCourse.tripHillId = this.course.tripHillId;
    newCourse.tripHill = this.course.tripHill;
    newCourse.tripHillName = this.course.tripHillName;
    newCourse.registerCode = this.course.registerCode;
    newCourse.statusId = this.course.statusId;
    newCourse.statusName = this.course.statusName;
    newCourse.comments = this.course.comments;
    newCourse.featured = this.course.featured;
    newCourse.minStudentCount = this.course.minStudentCount;
    newCourse.consentMandatory = this.course.consentMandatory;
    newCourse.isCamp = this.course.isCamp;
    newCourse.forTrip = this.course.forTrip;
    newCourse.providerId = this.course.providerId;
    newCourse.acceptVideo = this.course.acceptVideo;
    newCourse.acceptQuestion = this.course.acceptQuestion;
    newCourse.unitPrice = this.course.unitPrice;
    newCourse.youtubeLinks = this.course.youtubeLinks;
    newCourse.createdDate = new Date();
    newCourse.createdTypeId = this.course.createdTypeId;
    newCourse.createdTypeName = this.course.createdTypeName;

    let navigationExtras: NavigationExtras = {
      state: {
        course:newCourse,
        providerId:this.providerId
      }
    };
    this.router.navigate(['ski-course-edit'], navigationExtras);
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
    if(this.courseUtil.isCourseRegister(this.course)){
      buttons.push(
        {
          text: this.translateUtil.translateKey('Register'),
          handler: () => {
            console.log('Register clicked');
            this.onRegisterCoruse();
          },
        }
      );
    }
    if(this.course && this.course.acceptQuestion){
      buttons.push(
          {
            text: this.translateUtil.translateKey('Ask Question'),
            handler: () => {
              console.log('ask question clicked');
              this.onAskQuestion();
            },
          });
    }
    buttons.push(
      {
        text: this.translateUtil.translateKey('Comments'),
        handler: () => {
          console.log('Comments clicked');
          let navigationExtras: NavigationExtras = {
            state: {
              providerId:this.providerId, entityTypeId:this.appConstants.COMMENT_TYPE_COURSE, entityId: this.courseId
            }
          };
          this.router.navigate(['comments'], navigationExtras);
        },
      });

    if(this.appSession.l_isAdministrator(this.providerId) ||
      this.appSession.l_isSiteAdmin() ||
      (this.course.instructorId===this.appSession.l_getInstructorId(this.providerId))){
      buttons.push(
        {
          text: this.translateUtil.translateKey('Summary'),
          handler: () => {
            console.log('Summary clicked');
            this.onViewSummary();
          },
        }
      );
      buttons.push(
        {
          text: this.translateUtil.translateKey('Duplicate'),
          handler: () => {
            this.onDuplicate();
          }
        }
      );
      buttons.push(
        {
          text: this.translateUtil.translateKey('Edit'),
          handler: () => {
            console.log('Edit clicked');
            this.onEdit();
          },
        }
      );
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
