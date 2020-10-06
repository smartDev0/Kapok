import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent,
  ModalController,
  NavController,
  PopoverController
} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {AppSession} from "../../../../services/app-session.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {NgForm} from "@angular/forms";
import {Mountain} from "../../../../models/Mountain";
import {DateTimeUtils} from "../../../../services/date-time-utils.service";
import {Utils} from "../../../../services/utils.service";

@Component({
  selector: 'app-mountain-edit',
  templateUrl: './mountain-edit.page.html',
  styleUrls: ['./mountain-edit.page.scss'],
})
export class MountainEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  @ViewChild("formRef") formRef:NgForm;

  mountainId:number;
  mountain:Mountain;
  submitted:boolean;
  callback:any;
  formChanged:boolean = false;
  public currentDateTime:string;

  constructor(public appSession:AppSession,
              public popoverCtrl: PopoverController, public providersService:ProvidersService, public utils:Utils,
              public modalCtrl: ModalController, public appConstants:AppConstants, public dateTimeUtils:DateTimeUtils,
              public alertCtrl: AlertController, public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private navCtrl:NavController,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.currentDateTime = this.dateTimeUtils.getCurrentLocalTime();
    this.formChanged = false;

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.mountainId = this.router.getCurrentNavigation().extras.state.mountainId;
        this.mountain = this.router.getCurrentNavigation().extras.state.mountain;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    // For creating;
    if(!this.mountain){
      if(!this.mountainId){
        this.router.navigate([this.appConstants.ROOT_PAGE]);
        return;
      }
      this.l_updateContent();
    }else{
      this.mountainId = this.mountain.id;
    }
  }


  l_updateContent(){
    if(!this.mountainId){
      this.mountain = null;
      return;
    }
    this.providersService.s_getMountainById(this.appSession.l_getUserId(), this.mountainId, (mountain:Mountain) => {
      this.mountain = mountain;
    });
  }

  saveMountain(formRef:NgForm) {
    console.log("save called good.");
    this.providersService.saveMountain(this.appSession.l_getUserId(), this.mountain, (resultMountain:Mountain) => {
      this.mountain = resultMountain;
      this.l_close();
    });
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  onCancel() {
    if (this.formRef.dirty || this.formChanged) {
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
    this.formChanged = false;
    if(!this.mountain.id || this.mountain.id<=0){
      this.mountain = new Mountain();
    }else{
      this.l_updateContent();
    }
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

  onSave(){
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
            console.log('To submit form.');
            this.onSave();
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
