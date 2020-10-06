import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, NavController, Platform} from "@ionic/angular";
import {CodeTableService} from "../../../services/code-table-service.service";
import {Utils} from "../../../services/utils.service";
import {AppSession} from "../../../services/app-session.service";
import {ImageService} from "../../../services/image-service.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ACLService} from "../../../services/aclservice.service";
import {AppConstants} from "../../../services/app-constants.service";
import {UserService} from "../../../services/user-service.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {AlbumImage} from "../../../models/AlbumImage";

@Component({
  selector: 'app-album',
  templateUrl: './album.page.html',
  styleUrls: ['./album.page.scss'],
})
export class AlbumPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  toShowUserId:number = null;
  albumImages:AlbumImage[] = null;
  callback:any=null;
  loading:any = null;

  sliderConfig = {
    slidesPerView: 1.3,
    spaceBetween: 2,
    centeredSlides: true
  };

  constructor(public utils:Utils, private navCtrl: NavController, private platform:Platform, private aclService:ACLService,
              public alertCtrl: AlertController, appSession:AppSession, private codeTableService:CodeTableService,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              public appConstants:AppConstants, public providerService:ProvidersService, private imageService:ImageService,
              private actionsheetCtrl: ActionSheetController, public userService:UserService,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(false);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.toShowUserId = this.router.getCurrentNavigation().extras.state.toShowUserId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.updateAlubm();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updateAlubm(){
    this.userService.s_getAlbumImagesForUserId(this.toShowUserId, (albumImages:AlbumImage[]) => {
      this.albumImages = albumImages;
      if(!this.isOwner()){
        if(this.albumImages){
          this.albumImages.forEach((item, index) => {
            if(!item.isShown){
              this.albumImages.splice(index, 1);
            }
          });
        }
      }
    });
  }

  isOwner(){
    if(!this.appSession.l_getUserId() || !this.toShowUserId){
      return false;
    }
    if(this.toShowUserId===this.appSession.l_getUserId()){
      return true;
    }else{
      return false;
    }
  }

  onScrollUp(){
    console.log("onScrollUp().");
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  onDeleteAlbumImage(albumImageId:number){
    console.log("onDelete, imageId: " + albumImageId);
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Delete image'), null, null,
      this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DELETE'),
      (data) => {
        this.imageService.s_deleteAlbumImage(albumImageId, (result:boolean) => {
          if(result){
            this.toastUtil.showToastTranslate("Image deleted.");
            this.albumImages.forEach((item, index) => {
              if(item.id===albumImageId){
                // this.slides.slidePrev(10, true);
                this.albumImages.splice(index, 1);
                // this.slides.update(1);
                // this.onClose();
                return;
              }
            });
          }else{
            this.toastUtil.showToastTranslate("Delete image failed!");
          }
        });
      });
  }

  async onChangeCaption(albumImage:AlbumImage){
    console.log("Good onChangeCaption().");
    let caption = albumImage.caption;

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Change image caption'),
      inputs: [
        {
          label: this.translateUtil.translateKey('New Caption'),
          name: "cap",
          type: 'text',
          value: caption,
        },
      ],
      buttons: [
        {
          text: this.translateUtil.translateKey('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey('Change'),
          handler: (data) => {
            console.log("new caption: " + data);
            albumImage.caption = data['cap'];
            this.imageService.s_updateAlbumImage(this.appSession.l_getUserId(), albumImage);
          }
        }
      ]
    });
    await alert.present();
  }

  onShowImage(albumImage:AlbumImage){
    console.log("Good onShowImage(). albumImage.id: " + albumImage.id);
    albumImage.isShown = true;
    this.imageService.s_updateAlbumImage(this.appSession.l_getUserId(), albumImage);
  }

  onHideImage(albumImage:AlbumImage){
    console.log("Good onHideImage(). albumImage.id: " + albumImage.id);
    albumImage.isShown = false;
    this.imageService.s_updateAlbumImage(this.appSession.l_getUserId(), albumImage);
  }

  onAddImages(){
    console.log("Good onAddImages().");
    let navigationExtras: NavigationExtras = {
      state: {
      }
    };
    this.router.navigate(['add-album'], navigationExtras);
  }

  async onClose(){
    this.navCtrl.pop();
  }

  async openMenu() {
    let buttonList = [];
    if(this.isOwner()){
      buttonList.push(
        {
          text: this.translateUtil.translateKey('Add images'),
          handler: () => {
            console.log('Add clicked');
            this.onAddImages();
          }
        });
    }

    buttonList.push(
      {
        text: this.translateUtil.translateKey('Close'),
        handler: () => {
          console.log('Close clicked');
          this.onClose();
        }
      });

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttonList,
    });
    this.actionSheet.present();
  }
}
