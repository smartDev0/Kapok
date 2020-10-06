import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController} from "@ionic/angular";
import {NgForm} from "@angular/forms";
import {AppSession} from "../../../../services/app-session.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Utils} from "../../../../services/utils.service";
import {AgeRangeOption} from "../../../../models/courseOptions/AgeRangeOption";
import {AgeRangeOptionService} from "../../../../services/course/age-range-option.service";

@Component({
  selector: 'app-age-range-option-edit',
  templateUrl: './age-range-option-edit.page.html',
  styleUrls: ['./age-range-option-edit.page.scss'],
})
export class AgeRangeOptionEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  userId:number;
  providerId:number;
  ageRangeOption:AgeRangeOption;
  submitted:boolean;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils, private alertCtrl:AlertController,
              private ageRangeService:AgeRangeOptionService, private ionRouterOutlet:IonRouterOutlet,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.ageRangeOption = this.router.getCurrentNavigation().extras.state.ageRangeOption;
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
      this.ageRangeService.saveAgeRangeOption(this.appSession.l_getUserId(), this.ageRangeOption, (result:boolean) => {
        if(result){
          this.toastUtil.showToast("AgeRange saved.");
          this.onClose();
        }else{
          this.toastUtil.showToast("Saving ageRange failed!");
        }
      });
    }
  }

  onDelete(){
    if(this.ageRangeOption && this.ageRangeOption.id){
      this.utils.showAlertConfirm(this.alertCtrl, "Delete this AgeRange?", null, null, "Cancel", null, "Delete", () => {
        this.ageRangeService.deleteAgeRangeOption(this.userId, this.ageRangeOption.id, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("AgeRange deleted.");
            this.onClose();
          }else{
            this.toastUtil.showToast("Delete AgeRange failed.");
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
