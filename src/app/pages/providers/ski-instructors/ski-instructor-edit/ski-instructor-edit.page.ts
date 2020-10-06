import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, ModalController, NavController} from '@ionic/angular';
import {NgForm} from "@angular/forms";
import {CodeTableService} from "../../../../services/code-table-service.service";
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {DateTimeUtils} from "../../../../services/date-time-utils.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PaymentProcessUtil} from "../../../../services/coursePayment/payment-process-util.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {UserService} from "../../../../services/user-service.service";
import {StudentUtil} from "../../../../services/student-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {InstructorWithDetails} from "../../../../models/InstructorWithDetails";
import * as moment from 'moment';
import {SearchUserComponent} from "../../search-user/search-user.component";
import {UserInfo} from "../../../../models/UserInfo";

@Component({
  selector: 'app-ski-instructor-edit',
  templateUrl: './ski-instructor-edit.page.html',
  styleUrls: ['./ski-instructor-edit.page.scss'],

  providers: [
    StudentUtil,
  ],
})
export class SkiInstructorEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  @ViewChild("formRef") formRef:NgForm;
  private myModal:any;

  providerId:number;
  instructorId:number;
  instructor:InstructorWithDetails;
  submitted:boolean;
  callback:any;
  formChanged:boolean = false;
  skiCertificatedDate:any;
  snowboardCertificatedDate:any;
  expireTime:any;
  currentDateTime:string;
  confirmedLeave:boolean;
  youtubeLinks:string[];

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public studentUtil:StudentUtil,
              private alertCtrl:AlertController, private userService:UserService, private actionsheetCtrl:ActionSheetController,
              public dateTimeUtils:DateTimeUtils, private codeTableService:CodeTableService, private paymentProcessUtil:PaymentProcessUtil,
              private modalController:ModalController, private ionRouterOutlet:IonRouterOutlet) {
    super(appSession, router, appConstants);
    this.l_checkUserId(true);

    this.currentDateTime = this.dateTimeUtils.getCurrentLocalTime();
    this.formChanged = false;

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.instructor = this.router.getCurrentNavigation().extras.state.instructor;
        this.instructorId = this.router.getCurrentNavigation().extras.state.instructorId;
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
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
    }
    if(!this.instructor){
      if(!this.instructorId){
        this.router.navigate([this.appConstants.ROOT_PAGE]);
        return;
      }
      this.l_updateInstructorById();
    }else{
      this.instructorId = this.instructor.id;
      this.skiCertificatedDate = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.instructor.skiCertificatedDate);
      this.snowboardCertificatedDate = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.instructor.snowboardCertificatedDate);
      this.expireTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.instructor.expireDate);
      this.updateYoutubeLinks();
    }
  }

  ionViewCanLeave(){
    if (this.formRef.dirty && !this.confirmedLeave) {
      this.onCancelPage();
      return false;
    }else{
      return true;
    }
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  l_updateInstructorById(){
    this.providerService.s_getSkiInstructorDetailsById(this.instructorId, (instructor:InstructorWithDetails) => {
      this.instructor = instructor;
      if(this.instructor){
        this.skiCertificatedDate = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.instructor.skiCertificatedDate);
        this.snowboardCertificatedDate = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.instructor.snowboardCertificatedDate);
        this.expireTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.instructor.expireDate);
        this.updateYoutubeLinks();
      }
    });
  }

  updateYoutubeLinks(){
    if(!this.instructor || !this.instructor.youtubeLinks || this.instructor.youtubeLinks.length===0){
      return;
    }
    this.youtubeLinks = this.instructor.youtubeLinks.split(";");
  }

  openPage(selection:string) {
  }

  onJoditChange($event){
    if(!$event || !$event.args){
      return;
    }
    const val = $event.args[0];
    const preVal = $event.args[1];
    // console.log("Good onJoditChange, value: " + val + ", previous value: " + preVal);

    this.instructor.description = val;
  }

  async onSearchUser(){
    console.log("Good onSearchUser().");
    const modal = await this.modalController.create({
      component: SearchUserComponent,
      componentProps: { }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if(data){
      let selectedUser:UserInfo = data;
      if(selectedUser){
        console.log("selectedUser.id: " + selectedUser.id);
        this.instructor.userId = selectedUser.id;
        this.instructor.userName = selectedUser.userName;
      }
    }
  }

  deleteTime(fieldName){
    this.instructor[fieldName] = null;
  }

  async addYoutubeLink(){
    this.utils.addYoutubeLink(this.alertCtrl, this.translateUtil, this.toastUtil, this.youtubeLinks, (youtubeLinks:string[]) => {
      this.mergeLinksToCourse(youtubeLinks);
    });
  }

  deleteYoutubeLink(link:string){
    if(!link || link.trim().length===0 || this.youtubeLinks==null || this.youtubeLinks.length===0){
      return;
    }
    let deleted:boolean = false;
    let tempLinks:string[] = [];

    for (let i = 0; i < this.youtubeLinks.length; i++) {
      if(this.youtubeLinks[i] === link){
        deleted = true;
        continue;
      }else{
        tempLinks.push(link);
      }
    }
    this.youtubeLinks = tempLinks;
    this.mergeLinksToCourse(this.youtubeLinks);
  }

  mergeLinksToCourse(youtubeLinks:string[]){
    this.youtubeLinks = youtubeLinks;
    this.instructor.youtubeLinks = null;
    if(this.youtubeLinks && this.youtubeLinks.length>0){
      for (let i = 0; i < this.youtubeLinks.length; i++) {
        if(i===0){
          this.instructor.youtubeLinks = this.youtubeLinks[i];
        }else{
          this.instructor.youtubeLinks = this.instructor.youtubeLinks + ";" + this.youtubeLinks[i];
        }
      }
    }
  }

  saveInstructor(formRef:NgForm) {
    console.log("save called good.");
    this.submitted = true;

    if(!this.instructor.userId){
      this.toastUtil.showToastTranslate("Please search user for creating instructor.");
      return;
    }

    if(this.skiCertificatedDate && this.expireTime && (moment(this.skiCertificatedDate).isAfter(moment(this.expireTime)))){
      this.toastUtil.showToastTranslate("Start certificated in can not be after Expire Time.");
      return;
    }

    if(this.snowboardCertificatedDate && this.expireTime && (moment(this.snowboardCertificatedDate).isAfter(moment(this.expireTime)))){
      this.toastUtil.showToastTranslate("Snowboard certificated in can not be after Expire Time.");
      return;
    }

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
    }else{
      this.instructor.skiCertificatedDate = this.utils.changeTimeZoneFromISOToLocalForServer(this.skiCertificatedDate);
      this.instructor.snowboardCertificatedDate = this.utils.changeTimeZoneFromISOToLocalForServer(this.snowboardCertificatedDate);
      this.instructor.expireDate = this.utils.changeTimeZoneFromISOToLocalForServer(this.expireTime);
      this.providerService.s_saveSkiInstructorDetails(this.appSession.l_getUserId(), this.instructor, (instructor:InstructorWithDetails) => {
        this.confirmedLeave = true;
        if(!instructor){
          this.toastUtil.showToastTranslate("Save instructor failed. If you are creating a new instructor, it's maybe the user is already an instructor.");
        }

        if(this.callback){
          this.callback();
        }
        this.onClose();
      });
    }
  }

  onLevelChange(){
    this.formChanged = true;
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

  l_reset(){
    this.formChanged = false;
    if(!this.instructor.id || this.instructor.id<=0){
      this.instructor = new InstructorWithDetails();
    }else{
      this.l_updateInstructorById();
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

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            console.log('To submit form.');
            if(!this.formRef){
              console.log("Can not find formRef!");
            }else{
              this.formRef.ngSubmit.emit("ngSubmit");
              console.log('Save clicked finished.');
            }
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
