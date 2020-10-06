import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../../BasicUserIdPage';
import {ActionSheetController, AlertController, IonContent, NavController} from '@ionic/angular';
import {NgForm} from '@angular/forms';
import {AppSession} from '../../../../services/app-session.service';
import {ProvidersService} from '../../../../services/providers-service.service';
import {AppConstants} from '../../../../services/app-constants.service';
import {TranslateUtil} from '../../../../services/translate-util.service';
import {ToastUtil} from '../../../../services/toast-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentService} from '../../../../services/payment-service.service';
import {Utils} from '../../../../services/utils.service';
import {PreApprovedPayment} from '../../../../models/payment/coursePayment/PreApprovedPayment';

@Component({
  selector: 'app-pre-payment-edit',
  templateUrl: './pre-payment-edit.page.html',
  styleUrls: ['./pre-payment-edit.page.scss'],

  providers: [
    PaymentService,
  ],
})
export class PrePaymentEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  providerId:number;
  prePaymentId:number;
  prePayment:PreApprovedPayment;
  submitted:boolean;
  callback:any;
  confirmedLeave:boolean;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public alertCtrl: AlertController, public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, private paymentService:PaymentService, public utils:Utils, ) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.submitted = false;

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.prePayment = this.router.getCurrentNavigation().extras.state.prePayment;
        this.prePaymentId = this.router.getCurrentNavigation().extras.state.prePaymentId;
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

    if(!this.prePayment){
      this.l_updatePageContent();
    }else{
      this.prePaymentId = this.prePayment.id;
    }
  }

  ionViewCanLeave(){
    if (this.formRef.dirty && !this.confirmedLeave) {
      this.onCancelPage();
      return false;
    }else{
      return true;
    }
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  l_updatePageContent(){
    if(!this.prePaymentId){
      return;
    }
    this.providersService.s_getPrePaymentById(this.appSession.l_getUserId(), this.prePaymentId, (prePayment:PreApprovedPayment) => {
      this.prePayment = prePayment;
    });
  }

  onDeletePrePayment(prePayId:number){
    console.log("Good onDeletePrePayment().");
    if(!prePayId){
      return;
    }
  }

  savePrePayment(formRef:NgForm) {
    console.log("savePriceUnit called good.");
    this.submitted = true;

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
    }else{
      this.providersService.s_savePrePayment(this.appSession.l_getUserId(), this.prePayment, (resultPrePay:PreApprovedPayment) => {
        this.confirmedLeave = true;
        this.prePayment = resultPrePay;
        if(this.prePayment){
          this.prePaymentId = this.prePayment.id;
        }
        if(this.callback){
          this.callback(this.prePayment);
        }
        this.l_close();
      });
    }
  }

  onCancelPage(){
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null,
        this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DISCARD'),
        (data) => {
          this.confirmedLeave = true;
          this.navCtrl.pop();
        });

    }else{
      this.navCtrl.pop();
    }
  }

  // onCancel() {
  //   if (this.formRef.dirty) {
  //     let alert = this.alertCtrl.create();
  //     alert.setTitle(this.translateUtil.translateKey('DISCARD_CHANGED'));
  //     alert.addButton(this.translateUtil.translateKey('CANCEL'));
  //     alert.addButton({
  //       text: this.translateUtil.translateKey('DISCARD'),
  //       handler: data => {
  //         this.l_reset();
  //         this.l_close();
  //       }
  //     });
  //     alert.present();
  //   }else{
  //     // this.l_reset();
  //     this.l_close();
  //   }
  // }

  l_reset(){
    this.l_updatePageContent();
  }

  l_close(){
    this.prePaymentId = null;
    this.prePayment = null;
    this.navCtrl.pop();
  }

  onScrollUp(){
    setTimeout(
        () => {
          this.content.scrollToTop(300)
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
            if(!this.formRef){
              console.log("Can not find formRef!");
            }else{
              this.formRef.ngSubmit.emit("ngSubmit");
              console.log('Save clicked finished.');
            }
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
