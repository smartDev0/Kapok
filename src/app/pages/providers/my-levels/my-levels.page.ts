import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {
  ActionSheetController, AlertController,
  IonContent, NavController,
} from "@ionic/angular";
import {Utils} from "../../../services/utils.service";
import {AppConstants} from "../../../services/app-constants.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {AppSession} from "../../../services/app-session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {InstructorWithDetails} from "../../../models/InstructorWithDetails";
import * as moment from 'moment';

@Component({
  selector: 'app-my-levels',
  templateUrl: './my-levels.page.html',
  styleUrls: ['./my-levels.page.scss'],
})
export class MyLevelsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;
  private popover:any;
  @ViewChild("formRef") formRef:NgForm;

  skiCertificatedIn:any;
  snowboardCertificatedIn:any;
  expireTime:any;
  instructorId:number;
  instructor:InstructorWithDetails;
  submitted:boolean;
  providerId:number;
  callback:any;

  constructor(public navCtrl: NavController, private alertCtrl:AlertController,
              appSession:AppSession, public translateUtil:TranslateUtil,
              public toastUtil:ToastUtil, private providerService:ProvidersService,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              public appConstants:AppConstants, public utils:Utils,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
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
    this.instructorId = this.appSession.l_getInstructorId(this.providerId);

    if(!this.instructorId){
      this.toastUtil.showToastTranslate("Can not find profile instructorId!");
      return;
    }
    this.l_updatePageContent();
  }

  ionViewCanLeave(){
    this.onCancel();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  l_updatePageContent(){
    this.providerService.s_getSkiInstructorDetailsById(this.instructorId, (instructor:InstructorWithDetails) => {
      this.instructor = instructor;
      this.skiCertificatedIn = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.instructor.skiCertificatedDate);
      this.snowboardCertificatedIn = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.instructor.snowboardCertificatedDate);
      this.expireTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.instructor.expireDate);
    });
  }

  l_reset(){
    this.l_updatePageContent();
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

  onDeleteSkiLevel(){
    console.log("Good onDeleteSkiLevel().");
    this.instructor.skiLevel = null;
    this.skiCertificatedIn = null;
    this.instructor.skiCertificatedDate = null;
  }

  onDeleteBoardLevel(){
    console.log("Good onDeleteBoardLevel().");
    this.instructor.boardLevel = null;
    this.snowboardCertificatedIn = null;
    this.instructor.snowboardCertificatedDate = null;
  }

  onDeleteExpireDate(){
    this.expireTime = null;
    this.instructor.expireDate = null;
  }

  saveProfile(formRef:NgForm) {
    console.log("saveProfile called good.");
    this.submitted = true;

    if(!this.instructor){
      this.toastUtil.showToastTranslate("Empty instructor?!.");
      return;
    }
    if((!this.instructor.skiLevel || this.instructor.skiLevel===0) && (!this.instructor.boardLevel || this.instructor.boardLevel===0)){
      this.toastUtil.showToastTranslate("Ski level and snow board level can not be both 0!");
      return;
    }

    if(this.skiCertificatedIn && this.expireTime && (moment(this.skiCertificatedIn).isAfter(moment(this.expireTime)))){
      this.toastUtil.showToastTranslate("Ski certificated date can not be after Expire Time.");
      return;
    }
    if(this.snowboardCertificatedIn && this.expireTime && (moment(this.snowboardCertificatedIn).isAfter(moment(this.expireTime)))){
      this.toastUtil.showToastTranslate("Snowboard certificated date can not be after Expire Time.");
      return;
    }

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
    }else{
      if(this.skiCertificatedIn){
        this.instructor.skiCertificatedDate = this.utils.changeTimeZoneFromISOToLocalForServer(this.skiCertificatedIn);
      }else{
        this.instructor.skiCertificatedDate = null;
      }

      if(this.snowboardCertificatedIn){
        this.instructor.snowboardCertificatedDate = this.utils.changeTimeZoneFromISOToLocalForServer(this.snowboardCertificatedIn);
      }else{
        this.instructor.snowboardCertificatedDate = null;
      }

      this.instructor.expireDate = this.utils.changeTimeZoneFromISOToLocalForServer(this.expireTime);
      this.providerService.s_saveSkiInstructorDetails(this.appSession.l_getUserId(), this.instructor, (instructor:InstructorWithDetails) => {
        if(instructor){
          this.toastUtil.showToastTranslate("Updated my instructor profile successfully.");
          // this.formRef.reset();
          // this.l_updatePageContent();
          this.l_close();
        }else{
          this.toastUtil.showToastTranslate("Update my instructor profile failed!");
        }
      });
    }
  }

  onCancel() {
    if(this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null,
        this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DISCARD'),
        (data) => {
          this.l_reset();
          this.l_close();
        });
    }else{
      // this.l_reset();
      this.l_close();
    }
  }

  onSaveBtn(){
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
