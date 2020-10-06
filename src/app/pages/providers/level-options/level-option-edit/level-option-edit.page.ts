import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController} from "@ionic/angular";
import {NgForm} from "@angular/forms";
import {LevelOption} from "../../../../models/courseOptions/LevelOption";
import {AppSession} from "../../../../services/app-session.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Utils} from "../../../../services/utils.service";
import {LevelOptionService} from "../../../../services/course/level-option.service";

@Component({
  selector: 'app-level-option-edit',
  templateUrl: './level-option-edit.page.html',
  styleUrls: ['./level-option-edit.page.scss'],
})
export class LevelOptionEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  userId:number;
  providerId:number;
  levelOption:LevelOption;
  submitted:boolean;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils, private alertCtrl:AlertController,
              private levelService:LevelOptionService, private ionRouterOutlet:IonRouterOutlet,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.levelOption = this.router.getCurrentNavigation().extras.state.levelOption;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

  }

  ionViewCanLeave(){
  }


  ionViewWillLeave() {
  }

  onSave(formRef:NgForm) {
    console.log("onSave called good.");
    this.submitted = true;

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
    }else{
      this.levelService.saveLevelOption(this.appSession.l_getUserId(), this.levelOption, (result:boolean) => {
        if(result){
          this.toastUtil.showToast("Level saved.");
          this.onClose();
        }else{
          this.toastUtil.showToast("Saving level failed!");
        }
      });
    }
  }

  onDelete(){
    if(this.levelOption && this.levelOption.id){
      this.utils.showAlertConfirm(this.alertCtrl, "Delete this Level?", null, null, "Cancel", null, "Delete", () => {
        this.levelService.deleteLevelOption(this.userId, this.levelOption.id, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("Level deleted.");
            this.onClose();
          }else{
            this.toastUtil.showToast("Delete Level failed.");
          }
        });
      });
    }else{
      this.onClose();
    }
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  onSaveBtn(){
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
            this.onSaveBtn();
          }
        },
        {
          text: this.translateUtil.translateKey('Delete'),
          handler: () => {
            console.log('Delete clicked.');
            this.onDelete();
          }
        },
        {
          text: this.translateUtil.translateKey('Cancel'),
          handler: () => {
            console.log('Cancel clicked.');
            this.onClose();
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
