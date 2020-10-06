import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, NavController, Platform} from "@ionic/angular";
import {NgForm} from "@angular/forms";
import {CodeTableService} from "../../../services/code-table-service.service";
import {Utils} from "../../../services/utils.service";
import {AppSession} from "../../../services/app-session.service";
import {ImageService} from "../../../services/image-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ACLService} from "../../../services/aclservice.service";
import {AppConstants} from "../../../services/app-constants.service";
import {UserService} from "../../../services/user-service.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {ProvidersService} from "../../../services/providers-service.service";

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.page.html',
  styleUrls: ['./change-email.page.scss'],
})
export class ChangeEmailPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  newEmail:string;
  confirmEmail:string;
  emailError:string;
  confirmEmailError:string;
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
    this.l_reset();
  }

  resetError(mesgName:string){
    console.log("resetError, mesgName: " + mesgName);
    if(mesgName){
      this[mesgName]=null;
    }
  }

  checkEmail(callback?){
    console.log("Good checkEmail.");
    this.userService.s_checkEmail(this.newEmail, (exists:boolean) => {
      if(exists){
        this.emailError = this.translateUtil.translateKey("EMAIL_USED");
        if(callback){
          callback(false);
        }
        return;
      }else{
        this.emailError = null;
        if(callback){
          callback(true);
        }
      }
    });
  }

  checkConfirmEmail(callback?){
    if(this.confirmEmail !== this.newEmail){
      this.confirmEmailError = this.translateUtil.translateKey("WRONG_CONFIRM_EMAIL");
      if(callback){
        callback(false);
      }
    }else{
      this.confirmEmailError = null;
      if(callback){
        callback(true);
      }
    }
  }

  saveEmail(profileForm:NgForm){
    if(!profileForm){
      return;
    }

    this.submitted = true;
    if(profileForm.invalid){
      console.log("passwordForm is invalide.");
      return;
    }else{
      console.log("Saving password.");
      this.checkConfirmEmail((result:boolean) => {
        if(result){
          this.l_updateEmail();
        }
      });
      this.l_close();
    }
  }

  l_updateEmail(){
    this.userService.s_updateEmail(this.appSession.l_getUserId(), this.newEmail, (result:boolean) => {
      if(result){
        this.toastUtil.showToast(this.translateUtil.translateKey("Email changed."));
        if(this.callback){
          this.callback(result);
        }
      }else{
        this.toastUtil.showToast(this.translateUtil.translateKey("Change email failed."));
      }
    });
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
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
      // this.l_reset();
      this.l_close();
    }
  }

  l_reset(){
    this.newEmail = null;
    this.confirmEmail = null;
    this.emailError = null;
    this.confirmEmailError = null;
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
