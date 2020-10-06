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
import {CoursePriceFormulaService} from "../../../../services/coursePayment/course-price-formula.service";
import {CoursePriceFormula} from "../../../../models/payment/coursePayment/CoursePriceFormula";

@Component({
  selector: 'app-course-price-formula-edit',
  templateUrl: './course-price-formula-edit.page.html',
  styleUrls: ['./course-price-formula-edit.page.scss'],
})
export class CoursePriceFormulaEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  userId:number;
  providerId:number;
  coursePriceFormula:CoursePriceFormula;
  submitted:boolean;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils, private alertCtrl:AlertController,
              private coursePriceFormulaService:CoursePriceFormulaService, private ionRouterOutlet:IonRouterOutlet,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.coursePriceFormula = this.router.getCurrentNavigation().extras.state.coursePriceFormula;
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
      this.coursePriceFormulaService.saveCoursePriceFormula(this.appSession.l_getUserId(), this.coursePriceFormula, (result:boolean) => {
        if(result){
          this.toastUtil.showToast("PriceFormula saved.");
          this.onClose();
        }else{
          this.toastUtil.showToast("Saving PriceFormula failed!");
        }
      });
    }
  }

  onDelete(){
    if(this.coursePriceFormula && this.coursePriceFormula.id){
      this.utils.showAlertConfirm(this.alertCtrl, "Delete this priceFormula?", null, null, "Cancel", null, "Delete", () => {
        this.coursePriceFormulaService.deleteCoursePriceFormula(this.userId, this.coursePriceFormula.id, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("PriceFormula deleted.");
            this.onClose();
          }else{
            this.toastUtil.showToast("Delete priceFormula failed.");
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
