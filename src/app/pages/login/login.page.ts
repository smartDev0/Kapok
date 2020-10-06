import { Component, OnInit } from '@angular/core';
import {ACLUser} from "../../models/transfer/RegisterUser";
import {TranslateUtil} from "../../services/translate-util.service";
import {CodeTableService} from "../../services/code-table-service.service";
import {ToastUtil} from "../../services/toast-util.service";
import {UserService} from "../../services/user-service.service";
import {ACLService} from "../../services/aclservice.service";
import {AppConstants} from "../../services/app-constants.service";
import {AppSession} from "../../services/app-session.service";
import {UserInfo} from "../../models/UserInfo";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {ModalController} from '@ionic/angular';
import {TermsModalPage} from '../terms/termsModal.page';
import {Provider} from '../../models/Provider';
import {ProvidersService} from '../../services/providers-service.service';
import {Utils} from "../../services/utils.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  public readonly LOGIN_PAGE:string = this.translateUtil.translateKey("LOGIN");
  public readonly REGISTER_PAGE:string = this.translateUtil.translateKey("REGISTER");
  public readonly RESET_PAGE:string = this.translateUtil.translateKey("FORGOT_PASSWORD");

  // for member registration;
  providerId:number;
  memberRegistration:boolean;   // forward to membership page if true;
  provider:Provider;

  aclUser:ACLUser;
  userInfo:UserInfo = null;
  confirmPass:string;
  currentPage:string;
  isInModal:boolean;
  backUrls:any[];

  userNameError:string = null;
  emailError:string = null;
  passwordError:string = null;
  confirmPassError:string = null;
  submitted = false;

  constructor(public codeTableService:CodeTableService, private route: ActivatedRoute, private router: Router,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, public userService:UserService,
              private aclService:ACLService, public appConstants:AppConstants, private modalController:ModalController,
              private appSession:AppSession, private providerService:ProvidersService, public utils:Utils) {
    this.isInModal = true;
    this.currentPage = this.LOGIN_PAGE;
    this.aclUser = new ACLUser(null, null);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.backUrls = this.router.getCurrentNavigation().extras.state.backUrls;
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.memberRegistration = this.router.getCurrentNavigation().extras.state.memberRegistration;

        if(this.providerId){
          this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
            this.provider = provider;
          });
        }
      }
    });

    this.userNameError = null;
    this.emailError = null;
    this.passwordError = null;
    this.confirmPassError = null;
    this.submitted = false;
  }

  ionViewWillEnter() {
    if(this.memberRegistration){
      this.aclUser = new ACLUser(null, null);
      this.currentPage=this.REGISTER_PAGE;
    }
  }

  onLogin(){
    if(!this.aclUser.email || !this.aclUser.password){
      this.toastUtil.showToast(this.translateUtil.translateKey("INVALID_EMAIL_PASSWORD"));
      return;
    }
    this.appSession.loginUser(this.aclUser, (userInfo:UserInfo)=>{
      if(userInfo){
        this.userInfo = userInfo;
        this.l_toPage();
      }else{
        this.toastUtil.showToastTranslate("Incorrect email or password. Please try again.", 5000);
      }
    });
  }

  resetError(mesgName:string){
    console.log("resetError, mesgName: " + mesgName);
    if(mesgName){
      this[mesgName]=null;
    }
  }

  checkUserName(callback?){
    console.log("Good checkUserName.");
    if(this.aclUser.userName){
      // var tempStr = _.replace(this.aclUser.userName, /[&\/\\#,+()$~%.'":*?<>{}]/g,'');
      // if(tempStr.length<this.aclUser.userName.length){
      //   this.userNameError = "No special characters: &/\\#,+_$~%\"\':*?(){}";
      //   if(callback){
      //     callback(false);
      //   }
      //   return;
      // }
    }else{
      this.userNameError = this.translateUtil.translateKey("EMPTY_USERNAME");
      if(callback){
        callback(false);
      }
      return;
    }

    this.userService.s_checkUserName(this.aclUser.userName, (exists:boolean) => {
      if(exists){
        this.userNameError = this.translateUtil.translateKey("USERNAME_USED");
        if(callback){
          callback(false);
        }
        return;
      }else{
        if(callback){
          callback(true);
        }
        this.userNameError = null;
      }
    });
  }

  checkEmail(callback?){
    console.log("Good checkEmail.");
    this.userService.s_checkEmail(this.aclUser.email, (exists:boolean) => {
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

  checkConfirmPassword(callback?){
    if(this.aclUser.password !== this.confirmPass){
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

  async onTerms(){
    const modal = await this.modalController.create({
      component: TermsModalPage,
      componentProps: { }
    });
    await modal.present();
  }

  onRegister(formRef:NgForm){
    if(this.utils.checkDebounce("LoginPage.onRegister")){
      console.log("onRegister debounced!");
      return;
    }

    this.submitted = true;
    this.userNameError = null;

    if(formRef.valid){
      if(!this.aclUser.email || !this.aclUser.password || !this.confirmPass){
        this.toastUtil.showToast(this.translateUtil.translateKey("INVALID_EMAIL_PASSWORD"));
        return;
      }
      if(this.aclUser.password !== this.confirmPass){
        // this.toastUtil.showToast(this.translateUtil.translateKey("PASSWORD_NO_MATCH"));
        this.confirmPassError = this.translateUtil.translateKey("PASSWORD_NO_MATCH");
        return;
      }
      if(!this.aclUser.agreeTerms){
        return;
      }

      this.checkUserName((resultName:boolean) => {
        if(resultName){
          this.checkEmail((resultEamil:boolean) => {
            if(resultEamil){
              this.checkConfirmPassword((resultPassword:boolean) => {
                if(resultPassword){
                  this.l_RegisterUser();
                }
              });
            }
          });
        }
      });
    }else{
      console.log("form is invalid.");
    }
  }

  l_RegisterUser(){
    // logout first;
    if(this.appSession.l_getUserId()>0){
      this.userInfo = null;
      this.appSession.logoutUser();
    }

    this.aclService.s_RegisterUser(this.aclUser, (userInfo:UserInfo) => {
      if(!userInfo || !userInfo.id || !userInfo.token){
        this.toastUtil.showToast(this.translateUtil.translateKey("REGISTER_FAILED"));
        console.log(this.translateUtil.translateKey("REGISTER_FAILED"));
      }else{
        this.onLogin();
      }
    });
  }

  onReset(formRef:NgForm){
    this.submitted = true;
    if(!formRef.valid){
      return;
    }
    this.aclService.s_resetPassword(this.aclUser.email, (result:boolean) => {
      if(result){
        this.toastUtil.showToast(this.translateUtil.translateKey("Reset password email will be sent out shortly."));
        this.l_toPage();
      }else{
        this.toastUtil.showToast(this.translateUtil.translateKey("If there is the email in the system, reset password email will be sent out shortly."));
      }
    });
  }

  onShowLogin(){
    this.currentPage = this.LOGIN_PAGE;
  }

  onShowRegister(){
    this.currentPage = this.REGISTER_PAGE;
  }

  onShowForgotPassword(){
    this.currentPage = this.RESET_PAGE;
  }

  onCancel(){
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  l_toPage(){
    let requireOnlineMembership = false;
    if(this.provider && this.provider.onlineMembership){
      requireOnlineMembership = true;
    }
    if(requireOnlineMembership && this.memberRegistration && this.providerId && this.userInfo && this.userInfo.id){
      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.providerId,
        }
      };
      this.router.navigate(['membership'], navigationExtras);
      return;
    }else if(this.backUrls && this.backUrls.length>0){
      this.router.navigate(this.backUrls);
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

}
