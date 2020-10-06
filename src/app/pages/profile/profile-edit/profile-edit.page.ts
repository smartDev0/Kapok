import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, NavController, Platform} from "@ionic/angular";
import {Utils} from "../../../services/utils.service";
import {AppSession} from "../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AppConstants} from "../../../services/app-constants.service";
import {UserService} from "../../../services/user-service.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {UserInfo} from "../../../models/UserInfo";
import {Gender} from "../../../models/code/Gender";
import {CodeTableService} from "../../../services/code-table-service.service";
import {ImageService} from "../../../services/image-service.service";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  public userInfo:UserInfo = null;
  public submitted:boolean = false;
  public callback:any = null;
  public genders:Gender[];
  public userNameExistError:string;
  public confirmedLeave:boolean;
  public phoneError:string = null;

  // For image file upload;
  public form: FormGroup;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(public utils:Utils, private navCtrl: NavController, private platform:Platform,
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
    this.codeTableService.getGenderType((genders:Gender[]) => {
      this.genders = genders;
    });

    this.createForm();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  l_updateUser(){
    this.userService.s_getUserInfoById(this.appSession.l_getUserId(), (userInfo:UserInfo) => {
      if(userInfo){
        this.userInfo = userInfo;
      }else{
        this.toastUtil.showToast(this.translateUtil.translateKey("Can not find user by id: ") + this.appSession.l_getUserId());
        this.appSession.logoutUser(() => {
          this.router.navigate([this.appConstants.ROOT_PAGE]);
        });
      }
      this.userNameExistError = null;
    });
  }

  validatePhone(phone:string){
    if(!phone){
      return false;
    }
    if(!this.utils.phoneVailtion(phone)){
      this.phoneError = this.translateUtil.translateKey("Invalid phone number.");
      return false;
    }else{
      this.phoneError = null;
      return true;
    }
  }

  saveProfile(profileForm:NgForm){
    this.submitted = true;
    if(!profileForm){
      return;
    }
    if(!this.validatePhone(this.userInfo.phoneNumber)){
      return;
    }
    if(profileForm.invalid){
      console.log("profileForm is invalide.");
      return;
    }else{
      this.l_saveUser();
    }
  }

  l_saveUser(){
    if(this.userInfo.userName !== this.appSession.l_getUserInfo().userName){
      // check if userName has been used; userNameExistError
      this.userService.s_checkUserName(this.userInfo.userName, (used:boolean) => {
        if(used){
          this.userNameExistError = this.translateUtil.translateKey("Username has been used already!");
          return;
        }else{
          this.l_saveToServer();
        }
      });
    }else{
      this.l_saveToServer();
    }
  }

  l_saveToServer(){
    this.confirmedLeave = true;
    this.userNameExistError = null;
    this.appSession.saveUserInfo(this.userInfo, (savedInfo:UserInfo) => {
      this.userInfo = savedInfo;
      if(this.userInfo){
        this.toastUtil.showToast(this.translateUtil.translateKey("PROFILE_SAVE_OK"));
      }
      if(this.callback){
        this.callback(this.userInfo);
      }
      this.userNameExistError = null;
      this.l_close();
    });
  }

  ionViewCanLeave(){
    if (this.formRef.dirty && !this.confirmedLeave) {
      this.onClose();
      return false;
    }else{
      return true;
    }
  }

  onClose() {
    if (this.formRef.dirty) {
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
    this.l_updateUser();
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
    let buttonList = [
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
      {
        text: this.translateUtil.translateKey('CHANGE_EMAIL'),
        handler: () => {
          console.log('Change Email form.');
          //
          let navigationExtras: NavigationExtras = {
            state: {
            }
          };
          this.router.navigate(['change-email'], navigationExtras);
        }
      },
    ];

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttonList,
    });

    this.actionSheet.present();
  }

  /*******************************************
   * For image file upload;
   *******************************************/
  createForm() {
    // this.form = this.fb.group({
    //   // name: ['', Validators.required],
    //   avatar: null
    // });
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result
          // value: reader.result.split(',')[1]
        });
      };
    }
  }

  /**
   * For upload image using file input in browser;
   */
  onSubmit() {
    const formModel = this.form.value;
    // In a real-world app you'd have a http request / service call here like
    // this.http.post('apiUrl', formModel)
    if(!formModel || !formModel.avatar || !formModel.avatar.value){
      return;
    }

    let value = formModel.avatar.value;
    this.imageService.uploadProfileImageBrowser(this.userInfo.id, value, () => {
      this.l_updateUser();
    });
    setTimeout(() => {
      console.log(formModel);
    }, 1000);
  }

  clearFile() {
    // this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }
  /*******************************************
   * End of for image file upload;
   *******************************************/
}
