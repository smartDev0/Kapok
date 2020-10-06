import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../BasicUserIdPage';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  LoadingController,
  NavController,
  Platform
} from '@ionic/angular';
import {Utils} from '../../services/utils.service';
import {AppSession} from '../../services/app-session.service';
import {TranslateUtil} from '../../services/translate-util.service';
import {ToastUtil} from '../../services/toast-util.service';
import {AppConstants} from '../../services/app-constants.service';
import {ProvidersService} from '../../services/providers-service.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {UserInfo} from '../../models/UserInfo';
import {UserService} from '../../services/user-service.service';
import {ImageService} from "../../services/image-service.service";
import {Camera, CameraOptions, CameraPopoverOptions} from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],

  providers: [
    Camera,
  ],
})
export class ProfilePage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  public loading:any = null;
  public isApp:boolean = true;
  public userInfo:UserInfo;
  public userId:number;

  private image_uploads:any;
  private files_info:string="";

  constructor(public utils:Utils, private navCtrl: NavController, private platform:Platform,
              public alertCtrl: AlertController, appSession:AppSession, private imageService:ImageService,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, private loadingCtrl:LoadingController,
              public appConstants:AppConstants, public providerService:ProvidersService,
              private actionsheetCtrl: ActionSheetController, public userService:UserService,
              private route: ActivatedRoute, public router:Router, private camera: Camera,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.userId = this.appSession.l_getUserId();
    this.checkIsApp();
    this.l_updateUser();
  }

  l_initButtons(){
    // this.files_info = document.getElementById('files_info');
    this.image_uploads = document.getElementById('image_uploads');
    this.image_uploads.addEventListener("change", (event) => {
      if(!this.image_uploads || !this.image_uploads.files){
        console.log("Can not find image_uploads or empty selection.");
        return;
      }
      let curFiles = this.image_uploads.files;
      if(curFiles.length === 0) {
        console.log("Empty selection.");
        this.files_info = "";
      }else if(curFiles.length === 1){
        let selectedFile = curFiles[0];
        console.log("Selected file: " + selectedFile.name);
        this.files_info = selectedFile.name;
      }else{
        console.log("Selected number of file: " + curFiles.length);
        this.files_info = curFiles.length + " files";
      }
    });
  }

  l_updateUser(){
    console.log("Good l_updateProfile.");
    this.userService.s_getUserInfoById(this.appSession.l_getUserId(), (userInfo:UserInfo) => {
      this.appSession.l_setSessionUser(userInfo);
      this.userInfo = userInfo;
    });
  }

  ionViewWillLeave(){
    console.log("AddAlbumPage ionViewWillLeave.");
    if(this.actionSheet){
      this.actionSheet.dismiss();
    }

    if(this.loading){
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
  }

  onClickIcon(){
    console.log("Good onClickIcon().");
    this.l_initButtons();

    document.getElementById("image_uploads").click();
  }

  async updateImageDisplay() {
    if(this.isApp){
      console.log("This is app, can not choose by file.");
    }

    if(!this.image_uploads || !this.image_uploads.files){
      console.log("Can not find image_uploads or empty selection.");
      return;
    }

    console.log("Good updateImageDisplay().");
    let curFiles = this.image_uploads.files;
    if(curFiles.length === 0) {
      console.log("Empty selection.");
    } else {
      for(let i = 0; i < curFiles.length; i++) {
        console.log("File: " + curFiles[i].name);
        // image.src = window.URL.createObjectURL(curFiles[i]);

        this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Upload and change icon?'), null, null,
          this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('Change'),
          (data) => {
            console.log("Do uploading and changing icon.");
            this.showLoading();

            let reader = new FileReader();
            let file = curFiles[i];
            reader.readAsDataURL(file);
            reader.onload = () => {
              let content = reader.result.toString().split(',')[1];
              this.uploadImageToServer(content);
            };
          });
      }
    }
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

  private uploadImageToServer(base64Content:string){
    this.imageService.s_uploadProfileImageDevice(this.appSession.l_getUserId(), base64Content, "New Caption", (result:boolean) => {
      if(result){
        this.l_updateUser();
      }
      if(this.loading){
        this.loading.dismiss();
      }
    });

    // In case network connection is gone, release the page;
    this.appSession.subscribeNetwork((connected:boolean) => {
      if(!connected){
        console.log("Connection is gone, release page.");
        if(this.loading){
          this.loading.dismiss();
        }
      }
    });
  }

  onEditProfile(){
    let navigationExtras: NavigationExtras = {
      state: {
      }
    };
    this.router.navigate(['profile-edit'], navigationExtras);
  }

  onClose(){
    this.navCtrl.pop();
  }

  onChangePassword(){
    console.log("Good onChangePassword.");
    let navigationExtras: NavigationExtras = {
      state: {
      }
    };
    this.router.navigate(['change-password'], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
        () => {
          this.content.scrollToTop(300);
        },
        10
    );
  }

  public checkIsApp(){
    // console.log(this.platform.platforms());
    // if(this.platform.is('mobile')) {
    if(this.platform.is('cordova')){
      this.isApp = true;
    } else {
      this.isApp = false;
    }
  }

  onChooseAlbum(){
    console.log("Good onChooseAlbum().");
    // album
    let navigationExtras: NavigationExtras = {
      state: {
        toShowUserId: this.appSession.l_getUserId()
      }
    };
    this.router.navigate(['album'], navigationExtras);
  }

  onFromLibrary(){
    console.log("onFromLibrary().");
    this.chooseIcon(this.userId, 1);
  }

  onFromCamera(){
    console.log("onFromCamera()");
    this.chooseIcon(this.userId, 2);
  }

  async onChooseIcon(){
    if (typeof Camera === 'undefined' || !this.camera) {
      let mesg = this.translateUtil.translateKey('CAMERA_NOT_AVAILABLE_MESG');
      this.toastUtil.showToast(mesg);

      return;
    } else {
      const alert = await this.alertCtrl.create({
        header: this.translateUtil.translateKey("CHOOSE_ICON"),
        inputs: [
          {
            type: 'radio',
            label: this.translateUtil.translateKey('FROM_LIBRARY'),
            value: "library",
            checked: true
          },
          {
            type: 'radio',
            label: this.translateUtil.translateKey('FROM_CAMERA'),
            value: "camera",
            checked: false
          }
        ],
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
            handler: (data) => {
              console.log("Selected Choose. Data: " + data);
              let userId = this.appSession.l_getUserId();
              if(data==="camera"){
                this.chooseIcon(userId, 2);
              }else if(data==="library"){
                this.chooseIcon(userId, 1);
              }else{
                this.toastUtil.showToast("CANNOT_FIND_SOURCE" + ": " + data);
              }
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async chooseIcon (userId, optionId) {
    let sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    if (optionId && optionId === 2) {
      sourceType = this.camera.PictureSourceType.CAMERA;
    }

    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: false,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 750,
      correctOrientation: true,
      // popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    this.loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'crescent',
      duration: 2000
    });
    await this.loading.present();

    this.camera.getPicture(options).then((imageData) => {
      this.imageService.s_uploadProfileImageDevice(userId, imageData, "New Caption", () => {
        this.l_updateUser();
        if(this.loading){
          this.loading.dismiss();
        }
      });
    }, (err) => {
      // An error occured. Show a message to the user
      if(this.loading){
        this.loading.dismiss();
      }
      console.log("getPicture error: " + err);
      // cordova_not_available
      this.toastUtil.showToast(this.translateUtil.translateKey(err));
      // try browser file choose;
      this.isApp = false;
    });
  }

  async openMenu() {
    let buttonList = [
      {
        text: this.translateUtil.translateKey('EDIT'),
        handler: () => {
          console.log('EDIT clicked');
          this.onEditProfile();
        }
      },
      {
        text: this.translateUtil.translateKey('CHANGE_PASSWORD'),
        handler: () => {
          console.log('Change Password clicked');
          this.onChangePassword();
        }
      },
    ];
    buttonList.push(
        {
          text: this.translateUtil.translateKey('Album'),
          handler: () => {
            console.log('Album clicked');
            this.onChooseAlbum();
          }
        }
    );
    buttonList.push(
        {
          text: this.translateUtil.translateKey('TERMS'),
          handler: () => {
            console.log('Terms clicked');
            let navigationExtras: NavigationExtras = {
              state: {
              }
            };
            this.router.navigate(['terms'], navigationExtras);
          }
        }
    );
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttonList,
    });
    this.actionSheet.present();
  }
}
