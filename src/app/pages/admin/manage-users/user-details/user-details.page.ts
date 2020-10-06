import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController} from "@ionic/angular";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {AdminUserService} from "../../../../services/admin/admin-user-service";
import {Utils} from "../../../../services/utils.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppSession} from "../../../../services/app-session.service";
import {UserInfo} from "../../../../models/UserInfo";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage extends BasicUserIdPage implements OnInit{
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  public userId:number;
  public userInfo:UserInfo;
  public isSiteAdmin = false;

  constructor(public utils:Utils, private navCtrl: NavController,
              public alertCtrl: AlertController, appSession:AppSession,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              public appConstants:AppConstants, private adminUserService:AdminUserService,
              private actionsheetCtrl: ActionSheetController, private ionRouterOutlet:IonRouterOutlet,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.userId = this.router.getCurrentNavigation().extras.state.userId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(!this.userId || this.userId<=0){
      this.toastUtil.showToast("Empty userId!");
      return;
    }else{
      this.l_updateUserInfo();
    }
  }


  l_updateUserInfo(){
    this.adminUserService.s_getUserInfoById(this.userId, (userInfo:UserInfo) => {
      if(!userInfo){
        this.toastUtil.showToast("Can not find user id: " + this.userId);
        return;
      }
      console.log("userInfo: " + userInfo.userName);
      this.userInfo = userInfo;
      if(this.userInfo){
        this.isSiteAdmin = this.userInfo.isSiteAdmin;
      }
    });
  }

  onAdminChange(){
    if(this.isSiteAdmin===this.userInfo.isSiteAdmin){
      console.log("No change, return.");
      return;
    }

    console.log("Good onAdminChange(): " + this.isSiteAdmin);
    let title = "Enable site admin";
    let subTitle = "Are you sure to enable this user to be site admin?";
    if(!this.isSiteAdmin){
      title = "Disable site admin";
      subTitle = "Are you sure to disable this user to be site admin?";
    }

    this.utils.showAlertConfirm(this.alertCtrl, title, subTitle, null, "Cancel",
      () => {
        this.isSiteAdmin = this.userInfo.isSiteAdmin;
      }, "Confirmed",
      (data) => {
        if(this.isSiteAdmin){
          console.log("To enable siteAdmin.");
        }else{
          console.log("To disable siteAdmin");
        }
        this.l_changeSiteAdminForUserId(this.userInfo.id, this.isSiteAdmin);
      });
  }

  l_changeSiteAdminForUserId(userId:number, isSiteAdmin:boolean){
    this.adminUserService.s_changeSiteAdmin(userId, isSiteAdmin, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Site admin changed.");
      }
      this.l_updateUserInfo();
    });
  }

  onLogoutUser(){
    console.log("Good onLogoutUser.");

    this.utils.showAlertConfirm(this.alertCtrl, "Logout User", "Are you sure to logout this use? The user will have to login again for continuing view content.",
      null, "Cancel", null, "Logout",
      () => {
        this.l_logoutUser();
      });
  }

  l_logoutUser(){
    this.adminUserService.s_logoutUserById(this.userId, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Logout user successfully.");
      }else{
        this.toastUtil.showToast("Failed logging out user!");
      }
    });
  }

  onLockUser() {
    console.log("Good onLockUser.");
    if (!this.userId || this.userId <= 0 || this.userInfo.locked) {
      console.log("Wrong parameter for locking user.");
    }
    this.l_popupLockUnlockUser(true);
  }

  onUnLockUser(){
    console.log("Good onUnLockUser.");
    if(!this.userId || this.userId<=0 || !this.userInfo.locked){
      console.log("Wrong parameter for unlocking user.");
    }
    this.l_popupLockUnlockUser(false);
  }

  l_popupLockUnlockUser(status:boolean) {
    if(!this.userInfo){
      this.toastUtil.showToast("Empty user!");
      return;
    }
    let text = (status?"Lock":"Unlock");
    let title = "Are you sure to " + text + " User?";
    this.utils.showAlertConfirm(this.alertCtrl, title, null, null, "Cancel", null, text,
      () => {
        if(this.userInfo.locked){
          this.l_lockUnlockUser(this.userId, false);
        }else{
          this.l_lockUnlockUser(this.userId, true);
        }
      });
  }

  l_lockUnlockUser(userId:number, status:boolean){
    this.adminUserService.s_lockUnlockUserById(userId, status, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("UserId: " + this.userId +
          ", has been changed successfully. Current status: " + (status?"Locked":"Unlocked") + ".");
      }else{
        this.toastUtil.showToast("Failed locking/unlock userId: " + this.userId + ".");
      }
      this.l_updateUserInfo();
    });
  }

  // onDelete(){
  //   console.log("Good onDelete().");
  //   let alert = this.alertCtrl.create();
  //   alert.setTitle("Delete User");
  //   let name = 'Confirm by check';
  //   alert.addInput({
  //     type: 'checkbox',
  //     label: name,
  //     name: name,
  //     id: name,
  //     value: String(this.confirmedDeleteUser),
  //     checked: false
  //   });
  //   alert.addInput({
  //     type: 'checkbox',
  //     label: "Delete all user events and data.",
  //     name: "deleteData",
  //     id: "deleteData",
  //     value: String(this.confirmedDeleteUserData),
  //     checked: false
  //   });
  //   alert.addButton("Cancel");
  //   alert.addButton({
  //     text: "Delete",
  //     handler: data => {
  //       console.log("data: " + data);
  //       if(data && data.indexOf(this.confirmedDeleteUser)>=0 && data.indexOf(this.confirmedDeleteUserData)>=0){
  //         this.l_deleteUser();
  //       }else{
  //         return false;
  //       }
  //     }
  //   });
  //   alert.present();
  // }
  //
  // l_deleteUser(){
  //   this.adminUserService.s_deleteUserById(this.userId, (result:boolean) => {
  //     if(result){
  //       this.toastUtil.showToast("User deleted successfully.");
  //     }else{
  //       this.toastUtil.showToast("User delete failed.");
  //     }
  //     this.userId = null;
  //     this.userInfo = null;
  //     if(this.navCtrl.canGoBack()){
  //       this.navCtrl.pop();
  //     }
  //   })
  // }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  async openMenu() {
    let buttons = [
      {
        text: this.translateUtil.translateKey('LogoutUser'),
        handler: () => {
          console.log('onLogoutUser user.');
          this.onLogoutUser();
        }
      },
    ];

    buttons.push(
      {
        text: this.translateUtil.translateKey('Close'),
        handler: () => {
          this.onClose();
        }
      }
    );

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons,
    });
    this.actionSheet.present();
  }

}
