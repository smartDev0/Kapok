import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent, IonRouterOutlet,
  LoadingController,
  NavController,
  Platform
} from '@ionic/angular';
import {ActivatedRoute, Router} from "@angular/router";
import {AppSession} from "../../../../services/app-session.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {UserService} from "../../../../services/user-service.service";
import {ImageService} from "../../../../services/image-service.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {Utils} from "../../../../services/utils.service";
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-add-album',
  templateUrl: './add-album.page.html',
  styleUrls: ['./add-album.page.scss'],
  providers: [
    Camera,
  ],
})
export class AddAlbumPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  userId;
  loading:any = null;
  isApp:boolean = true;
  loadCount:number = 0;

  currentPlatform;
  images = [];
  allowedNumberOfImages: number = 2;

  @ViewChild('pickerButton', { read: ElementRef }) pickerButton: ElementRef;

  constructor(public utils:Utils, private navCtrl: NavController, private platform:Platform,
              public alertCtrl: AlertController, appSession:AppSession, private loadingCtrl:LoadingController,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              public appConstants:AppConstants, public providerService:ProvidersService, private imageService:ImageService,
              private actionsheetCtrl: ActionSheetController, public userService:UserService, private ionRouterOutlet:IonRouterOutlet,
              private route: ActivatedRoute, public router:Router, private camera: Camera, ) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();
    if(!this.userId){
      this.toastUtil.showToast("Please login first.");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    this.platform.ready().then((platformResult) => {
      console.log(platformResult);
      if (platformResult === ("dom" || 'browser')) {
        this.currentPlatform = 'browser';
        this.isApp = false;
      } else {
        this.currentPlatform = 'device';
        this.isApp = true;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.checkIsApp();
  }

  ionViewWillLeave() {
    this.dismissLoading();
  }

  public checkIsApp(){
    if(this.platform.is('mobile')) {
      this.isApp = true;
    } else {
      this.isApp = false;
    }
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  browserImagePicker(e) {
    let files = e.target.files;
    if (files.length > this.allowedNumberOfImages) {
      this.notAllowedToast();
    } else {
      this.images = [];
      for (let i = 0; i < files.length; i++) {
        let reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (ev: any) => {
          //console.log(ev)
          this.images.push(ev.target.result);
        };
      }
    }
  }

  nativeImagePicker() {
    this.choosePhotoLibrary();
  }

  async choosePhotoLibrary() {
    let sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;

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
        this.images.push(imageData);
    });
  }

  notAllowedToast() {
    this.toastUtil.showToast("Allowed only " + this.allowedNumberOfImages + " images to be selected at a time.");
  }

  deleteImg(i) {
    this.images.splice(i, 1);
  }

  imageUpload() {
    console.log("Good imageUpload().");

    this.showLoading();
    this.loadCount = 0;
    if(this.images && this.images.length>0){
      for(let img of this.images){
        this.loadCount = this.loadCount + 1;
        let content = img.split(',')[1];
        this.uploadImageToServer(content, "New Caption");
      }
    }
  }

  private uploadImageToServer(base64Content:string, fileName:string){
    this.imageService.s_uploadAlbumImage(this.appSession.l_getUserId(), base64Content, fileName, (result:boolean) => {
      this.loadCount = this.loadCount -1;
      if(this.loadCount<=0){
        if(result){
          this.toastUtil.showToast("Upload successfully.");
        }
        this.dismissLoading();
        this.onClose();
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

}
