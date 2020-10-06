import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, NavController, Platform} from "@ionic/angular";
import {NgForm} from "@angular/forms";
import {CodeTableService} from "../../../services/code-table-service.service";
import {Utils} from "../../../services/utils.service";
import {AppSession} from "../../../services/app-session.service";
import {ImageService} from "../../../services/image-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../../services/app-constants.service";
import {UserService} from "../../../services/user-service.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {UserInfo} from "../../../models/UserInfo";
import {ACLService} from "../../../services/aclservice.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  user:UserInfo;
  currentPassword:string;
  newPassword:string;
  confirmPass:string;
  passwordError:string;
  confirmPassError:string;
  submitted:boolean;
  callback:any;

  constructor(public utils:Utils, private navCtrl: NavController, private platform:Platform, private aclService:ACLService,
              public alertCtrl: AlertController, appSession:AppSession, private codeTableService:CodeTableService,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              public appConstants:AppConstants, public providerService:ProvidersService, private imageService:ImageService,
              private actionsheetCtrl: ActionSheetController, public userService:UserService,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.user = this.appSession.l_getUserInfo();
    this.l_reset();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  resetError(mesgName:string){
    if(mesgName){
      this[mesgName]=null;
    }
  }

  checkConfirmPassword(callback?){
    if(this.newPassword !== this.confirmPass){
      this.confirmPassError = this.translateUtil.translateKey("PASSWORD_NO_MATCH");
      if(callback){
        callback(false);
      }
    }else{
      this.confirmPassError = null;
      if(callback){
        callback(true);
      }
    }
  }

  savePassword(profileForm:NgForm){
    if(!profileForm){
      return;
    }

    this.submitted = true;
    if(profileForm.invalid){
      console.log("passwordForm is invalid.");
      return;
    }else{
      console.log("Saving password.");
      this.checkConfirmPassword((result:boolean) => {
        if(result){
          this.l_updatePassword();
        }
      });
    }
  }

  l_updatePassword(){
    this.aclService.s_updatePassword(this.user.id, this.currentPassword, this.newPassword, (result:boolean) => {
      if(result){
        this.toastUtil.showToast(this.translateUtil.translateKey('PASSWORD_CHANGED'));
      }else{
        this.toastUtil.showToast(this.translateUtil.translateKey('PASSWORD_FAILED'));
      }
    });
    this.l_close();
  }

  onClose() {
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null,
        this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DISCARD'),
        (data) => {
          this.l_reset();
          this.l_close();
        });
    }else{
      this.l_close();
    }
  }

  l_reset(){
    this.currentPassword = null;
    this.newPassword = null;
    this.confirmPass = null;
    this.passwordError = null;
    this.confirmPassError = null;
    this.submitted = false;
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
