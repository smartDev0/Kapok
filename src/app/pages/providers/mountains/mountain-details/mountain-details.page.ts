import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AppSession} from "../../../../services/app-session.service";
import {
  ActionSheetController,
  AlertController, IonContent,
  ModalController,
  NavController,
  PopoverController
} from "@ionic/angular";
import {ProvidersService} from "../../../../services/providers-service.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {Mountain} from "../../../../models/Mountain";
import {Utils} from "../../../../services/utils.service";

@Component({
  selector: 'app-mountain-details',
  templateUrl: './mountain-details.page.html',
  styleUrls: ['./mountain-details.page.scss'],
})
export class MountainDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  mountainId:number = null;
  mountain:Mountain = null;
  callback:any = null;
  disableModifyButtons:boolean = true;

  public loading:any = null;

  constructor(public appSession:AppSession, public utils:Utils,
              public popoverCtrl: PopoverController, public providersService:ProvidersService,
              public modalCtrl: ModalController, public appConstants:AppConstants,
              public alertCtrl: AlertController, public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private navCtrl:NavController,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.mountainId = this.router.getCurrentNavigation().extras.state.mountainId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.updatePageContent();
  }

  updatePageContent(){
    console.log("updatePageContent, this.mountainId: " + this.mountainId);
    this.providersService.s_getMountainById(this.appSession.l_getUserId(), this.mountainId, (mountain:Mountain) => {
      this.mountain = mountain;
    });
  }

  isModifyDisabled(){
    // // Update disable buttons;
    // if(this.eventsService.event.ownerUserId==this.userId){
    //   this.disableModifyButtons = false;
    // }else{
    //   this.disableModifyButtons = true;
    // }
    // return this.disableModifyButtons;
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  l_getYesNo(value:boolean){
    if(value){
      return this.translateUtil.translateKey("YES");
    }else{
      return this.translateUtil.translateKey("NO");
    }
  }

  // onBeforeUpload = (metadata: UploadMetadata) => {
  //   let alert = this.alertCtrl.create();
  //   alert.setTitle(this.translateUtil.translateKey('Upload and change icon?'));
  //   alert.addButton({
  //     text: this.translateUtil.translateKey('CANCEL'),
  //     handler: data => {
  //     }
  //   });
  //   alert.addButton({
  //     text: this.translateUtil.translateKey('Change'),
  //     handler: data => {
  //       console.log("Do uploading and changing icon.");
  //
  //       // if(!this.loading){
  //       this.loading = this.loadingCtrl.create({
  //         content: this.translateUtil.translateKey('Uploading...')
  //       });
  //       // }
  //       this.loading.present();
  //
  //       let reader = new FileReader();
  //       let file = metadata.file;
  //       reader.readAsDataURL(file);
  //       reader.onload = () => {
  //         let filename = file.name;
  //         if(filename==null){
  //           filename = this.appSession.l_getUserId() + "_image";
  //         }
  //         // let filetype = file.type;
  //         let content = reader.result.split(',')[1];
  //         // let encodedContent = btoa(content);
  //
  //         this.imageService.s_uploadMountainTitleImage(this.appSession.l_getUserId(), this.mountainId, content, filename, (result:boolean) => {
  //           if(result){
  //             this.updatePageContent();
  //           }
  //           this.loading.dismiss();
  //         });
  //
  //         // In case network connection is gone, release the page;
  //         this.appSession.subscribeNetwork((connected:boolean) => {
  //           if(!connected){
  //             console.log("Connection is gone, release page.");
  //             this.loading.dismiss();
  //           }
  //         });
  //
  //       };
  //     }
  //   });
  //   alert.present();
  //
  //   metadata.abort = true;
  //   return metadata;
  // };


  onEdit() {
    let navigationExtras: NavigationExtras = {
      state: {
        mountainId:this.mountainId
      }
    };
    this.router.navigate(['mountain-edit'], navigationExtras);
  }

  async onDelete(){
    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Delete Mountain?'),
      inputs: [
        {
          type: 'checkbox',
          label: this.translateUtil.translateKey('Delete trip hills for this mountain?'),
          value: "1",
          checked: false
        },
        {
          type: 'checkbox',
          label: this.translateUtil.translateKey('All the lessons and schedule will lose trip hill, confirm?'),
          value: "2",
          checked: false
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if(data && data.includes("1") && data.includes("2")){
              this.l_delete();
            }else{
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  l_delete(){
    this.providersService.s_deleteMountain(this.appSession.l_getUserId(), this.mountainId, (result:boolean) => {
      if(result){
        this.toastUtil.showToastTranslate("Mountain deleted.");
      }
      this.onClose();
    });
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  onClose(){
    this.navCtrl.pop();
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Edit'),
        handler: () => {
          console.log('Edit clicked');
          this.onEdit();
        },
      }
    );
    buttons.push(
      {
        text: this.translateUtil.translateKey('Delete'),
        handler: () => {
          console.log('Delete clicked');
          this.onDelete();
        },
      }
    );

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
