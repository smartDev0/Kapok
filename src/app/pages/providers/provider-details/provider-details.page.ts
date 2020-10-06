import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../BasicUserIdPage';
import {
  ActionSheetController,
  AlertController,
  IonContent, IonRouterOutlet,
  LoadingController,
  NavController, Platform, PopoverController,
} from '@ionic/angular';
import {AppSession} from '../../../services/app-session.service';
import {AppConstants} from '../../../services/app-constants.service';
import {ToastUtil} from '../../../services/toast-util.service';
import {ProvidersService} from '../../../services/providers-service.service';
import {Utils} from '../../../services/utils.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {Provider} from '../../../models/Provider';
import {ProviderContext} from '../../../models/transfer/ProviderContext';
import {TripHill} from '../../../models/TripHill';
import {ImageService} from '../../../services/image-service.service';
import {ProviderMemberWithDetails} from '../../../models/ProviderMemberWithDetails';
import {Camera, CameraOptions} from "@ionic-native/camera/ngx";

@Component({
  selector: 'app-provider-details',
  templateUrl: './provider-details.page.html',
  styleUrls: ['./provider-details.page.scss'],
  providers: [
    Camera,
  ],
})
export class ProviderDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;
  private popover:any;

  providerId:number = null;
  provider:Provider = null;
  disableModifyButtons:boolean = true;

  public loading:any = null;
  public isApp:boolean = true;
  public userId:number;

  private image_uploads:any;
  private files_info:string="";

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil, public alertCtrl:AlertController,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil, private imageService:ImageService,
              private actionsheetCtrl:ActionSheetController, private navCtrl:NavController, private popCtrl:PopoverController,
              private route: ActivatedRoute, public router:Router, public loadingCtrl: LoadingController, private camera: Camera,
              private ionRouterOutlet:IonRouterOutlet, private platform:Platform,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();

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
      this.toastUtil.showToastTranslate("providerId is empty!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    this.checkIsApp();
    this.updatePageContent(true);
  }

  updatePageContent(refresh?){
    if(!refresh){
      refresh = false;
    }else{
      refresh = true;
    }

    // reset providerContext first;
    this.appSession.l_setProviderContext(null);

    this.appSession.checkProviderContext(refresh, this.providerId, (context:ProviderContext) => {
      if(context){
        this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
          if(provider){
            this.provider = provider;
          }
        });
      }
    });
  }

  isModifyDisabled(){
  }

  ionViewWillLeave(){
    if(this.actionSheet){
      this.actionSheet.dismiss();
    }
    if(this.popover){
      this.popover.dismiss();
    }
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

  canEdit(){
    if(this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin()){
      return true;
    }
    return false;
  }

  onScrollUp(){
    setTimeout(
        () => {
          this.content.scrollToTop(300);
        },
        10
    );
  }

  onEditTripHill(tripHillId:number){
    if(!this.canEdit()){
      return;
    }

    if(!tripHillId){
      return;
    }
    console.log("Good onEditTripHill(). tripHillId: " + tripHillId);
    let navigationExtras: NavigationExtras = {
      state: {
        tripHillId:tripHillId, providerId:this.providerId
      }
    };
    this.router.navigate(['trip-hill', this.providerId+"_"+tripHillId], navigationExtras);
  }

  onAddPlace(){
    console.log("Good onAddPlace().");
    let newTripHill = new TripHill();
    newTripHill.providerId = this.providerId;

    let navigationExtras: NavigationExtras = {
      state: {
        tripHill:newTripHill, providerId:this.providerId
      }
    };
    this.router.navigate(['trip-hill', this.utils.getTime()], navigationExtras);
  }

  onDeleteTripHill(tripHillId:number){
    console.log("Deleting tripHillId: " + tripHillId);
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to delete this trip hill?'), null, null,
        this.translateUtil.translateKey('CANCEL'), null,
        this.translateUtil.translateKey('Delete'),
            (data) => {
              this.l_deleteMeetPlace(tripHillId);
            }
     );
  }

  l_deleteMeetPlace(tripHillId:number){
    this.providerService.s_deleteTripHill(this.appSession.l_getUserId(), tripHillId, (result:boolean) => {
      if(result){
        this.provider.tripHills.forEach((item, index) => {
          if(item && item.id===tripHillId){
            this.provider.tripHills.splice(index, 1);
          }
        });
      }
    });
  }

  onFromLibrary(){
    console.log("onFromLibrary().");
    this.chooseIcon(this.userId, 1);
  }

  onFromCamera(){
    console.log("onFromCamera()");
    this.chooseIcon(this.userId, 2);
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

  private uploadImageToServer(base64Content:string){
    this.imageService.s_uploadProviderIconImage(this.appSession.l_getUserId(), this.providerId, base64Content, "userId_image"+this.appSession.l_getUserId().toString(), (result:boolean) => {
      if(result){
        this.updatePageContent(true);
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
      this.imageService.s_uploadProviderIconImage(userId, this.providerId, imageData, "userId_image"+userId.toString(), () => {
        this.updatePageContent(true);
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

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onDeleteProvider(){
    console.log("Good onDeleteProvider.");
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to delete school?'),
      this.translateUtil.translateKey("All it's data will be deleted too."), null, this.translateUtil.translateKey('CANCEL'), null,
      this.translateUtil.translateKey('Delete'),
      (data) => {
        this.providerService.s_deleteProvider(this.appSession.l_getUserId(), this.providerId, (result:boolean) => {
          if(result){
            this.toastUtil.showToastTranslate("Provider deleted successfully.");
          }else{
            this.toastUtil.showToastTranslate("Provider deleted failed!");
          }
          this.onClose();
        });
      });
  }

  async openMenu() {
    let buttons:any = [];

    if(this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin()) {
      buttons.push(
        {
          text: this.translateUtil.translateKey('Edit'),
          handler: () => {
            console.log('Edit clicked');
            let navigationExtras: NavigationExtras = {
              state: {
                providerId: this.providerId
              }
            };
            this.router.navigate(['provider-edit'], navigationExtras);
          },
        }
      );
    }

    if(this.appSession.l_isSiteAdmin()){
      buttons.push(
          {
            text: this.translateUtil.translateKey('Delete'),
            handler: () => {
              console.log('Delete clicked');
              this.onDeleteProvider();
            },
          }
      );
    }

    if(this.provider.onlineMembership){
      if(!this.appSession.l_isMember(this.providerId)){
        buttons.push(
            {
              text: this.translateUtil.translateKey('Register Member'),
              handler: () => {
                console.log('Register Member clicked');
                if(!this.providerId){
                  this.toastUtil.showToastTranslate("Can not providerId is empty.");
                  return;
                }
                let member = new ProviderMemberWithDetails();
                member.providerId = this.providerId;
                member.userId = this.appSession.l_getUserId();
                member.userName = this.appSession.l_getUserInfo().userName;
                member.startDate = this.utils.convertDateToJson(new Date());
                member.providerMemberTypeId = null;
                member.activated = true;
                member.expireDate = null;
                let navigationExtras: NavigationExtras = {
                  state: {
                    member: member, providerId:this.providerId
                  }
                };
                this.router.navigate(['provider-member-edit'], navigationExtras);
              },
            }
        );
      }else{
        buttons.push(
            {
              text: this.translateUtil.translateKey('My Membership'),
              handler: () => {
                console.log('My Membership clicked');
                let navigationExtras: NavigationExtras = {
                  state: {
                    memberId: this.appSession.l_getMemberId(this.providerId), providerId:this.providerId
                  }
                };
                this.router.navigate(['provider-member-details'], navigationExtras);
              },
            }
        );
      }
    }

    if(buttons==null || buttons.length===0){
      buttons.push(
          {
            text: this.translateUtil.translateKey('CLOSE'),
            // role: 'cancel', // will always sort to be on the bottom
            handler: () => {
              console.log('CLOSE clicked');
              this.onClose();
            },
          }
      );
    }

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }

}
