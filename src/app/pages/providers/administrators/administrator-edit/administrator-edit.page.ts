import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, ModalController, NavController} from "@ionic/angular";
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ToastUtil} from "../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {NgForm} from "@angular/forms";
import {AdminUser} from "../../../../models/AdminUser";
import {DateTimeUtils} from "../../../../services/date-time-utils.service";
import {ProviderContext} from "../../../../models/transfer/ProviderContext";
import * as moment from 'moment';
import {UserInfo} from "../../../../models/UserInfo";
import {SearchUserComponent} from "../../search-user/search-user.component";

@Component({
  selector: 'app-administrator-edit',
  templateUrl: './administrator-edit.page.html',
  styleUrls: ['./administrator-edit.page.scss'],
})
export class AdministratorEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;
  @ViewChild("formRef") formRef:NgForm;

  providerId:number;
  adminUserId:number;
  adminUser:AdminUser;
  submitted:boolean;
  callback:any;
  formChanged:boolean = false;
  startTime:any;
  expireTime:any;
  confirmedLeave:boolean;
  public currentDateTime:string;

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil, public alertCtrl:AlertController,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private actionsheetCtrl:ActionSheetController, private navCtrl:NavController, public modalController: ModalController,
              private route: ActivatedRoute, public router:Router, private dateTimeUtils:DateTimeUtils, ) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.currentDateTime = this.dateTimeUtils.getCurrentLocalTime();
    this.formChanged = false;

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.adminUserId = this.router.getCurrentNavigation().extras.state.adminUserId;
        this.adminUserId = this.router.getCurrentNavigation().extras.state.adminUserId;
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

    this.l_updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  l_updatePageContent(){
    this.appSession.checkProviderContext(false, this.providerId, (context:ProviderContext) => {
      if(this.adminUserId>0){
        this.providerService.s_getAdministratorDetailsById(this.appSession.l_getUserId(), this.adminUserId, (adminUser:AdminUser) => {
          this.adminUser = adminUser;
          if(this.adminUser){
            this.startTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.adminUser.startDate);
            this.expireTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.adminUser.expireDate);
          }
        });
      }else{
        this.adminUser = new AdminUser(this.providerId, this.appSession.l_getUserId(), null);
      }
    });
  }

  presentPopover(myEvent) {

  }

  openPage(selection:string) {

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
        this.adminUser.userId = selectedUser.id;
        this.adminUser.userName = selectedUser.userName;
      }
    }
  }

  deleteTime(fieldName){
    // this.instructor[fieldName] = null;
  }

  saveAdministratorUser(formRef:NgForm) {
    console.log("save called good.");
    this.submitted = true;
    this.confirmedLeave = true;

    if(!this.adminUser.userId){
      this.toastUtil.showToastTranslate("Please search user for creating instructor.");
      return;
    }

    if(this.startTime && this.expireTime && (moment(this.startTime).isAfter(moment(this.expireTime)))){
      this.toastUtil.showToastTranslate("Start Time can not be after Expire Time.");
      return;
    }

    if(!formRef.valid){
      this.toastUtil.showToastTranslate(this.translateUtil.translateKey("FORM_FILL_MESG"));
    }else{
      this.adminUser.startDate = this.utils.changeTimeZoneFromISOToLocalForServer(this.startTime);
      this.adminUser.expireDate = this.utils.changeTimeZoneFromISOToLocalForServer(this.expireTime);
      this.providerService.s_saveAdminUser(this.appSession.l_getUserId(), this.adminUser, (adminUser:AdminUser) => {
        this.adminUser = adminUser;
        if(this.callback){
          this.callback();
        }
        this.l_close();
      });
    }
  }

  onLevelChange(){
    this.formChanged = true;
  }

  ionViewCanLeave(){
    if (this.formRef.dirty && !this.confirmedLeave) {
      this.onCancel();
      return false;
    }else{
      return true;
    }
  }

  onCancel() {
    if (this.formRef.dirty || this.formChanged) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null,
        this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DISCARD'),
        (data) => {
          this.confirmedLeave = true;
          this.l_reset();
          this.l_close();
        });
    }else{
      // this.l_reset();
      this.l_close();
    }
  }

  l_reset(){
    this.formChanged = false;

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
