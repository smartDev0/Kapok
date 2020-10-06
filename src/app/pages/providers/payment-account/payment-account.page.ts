import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../BasicUserIdPage';
import {ActionSheetController, AlertController, IonContent, NavController} from '@ionic/angular';
import {AppSession} from '../../../services/app-session.service';
import {ProvidersService} from '../../../services/providers-service.service';
import {AppConstants} from '../../../services/app-constants.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {ToastUtil} from '../../../services/toast-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {PaymentAccount} from '../../../models/payment/PaymentAccount';
import {PaymentService} from '../../../services/payment-service.service';
import {Utils} from '../../../services/utils.service';

@Component({
  selector: 'app-payment-account',
  templateUrl: './payment-account.page.html',
  styleUrls: ['./payment-account.page.scss'],

  providers: [
    PaymentService,
  ],
})
export class PaymentAccountPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  providerId:number = null;
  paymentAccount:PaymentAccount = null;
  submitted:boolean = false;
  inEdit = false;


  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public alertCtrl: AlertController, public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, private paymentService:PaymentService, public utils:Utils, ) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.submitted = false;
    this.inEdit = false;

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
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    this.updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    this.paymentService.s_getPaymentAccountForProviderId(this.appSession.l_getUserId(), this.providerId, (paymentAccount:PaymentAccount) => {
      this.paymentAccount = paymentAccount;
    });
  }

  saveProvider(formRef:NgForm) {
    console.log("saveEvent called good.");
    this.submitted = true;

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
    }else{
      if(!this.paymentAccount.providerId){
        this.paymentAccount.providerId = this.providerId;
      }
      this.paymentService.s_savePaymentAccount(this.appSession.l_getUserId(), this.providerId, this.paymentAccount, (resultAccount:PaymentAccount) => {
        this.paymentAccount = resultAccount;
        this.inEdit = false;
      });
    }
  }

  onCancel() {
    if (this.formRef.dirty) {
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
    this.updatePageContent();
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

  async openMenu() {
    let buttons = [];
    buttons.push(
        {
          text: this.translateUtil.translateKey('Edit'),
          handler: () => {
            console.log('Edit clicked.');
            if(!this.paymentAccount){
              this.paymentAccount = new PaymentAccount();
            }
            this.inEdit = true;
          }
        }
    );

    buttons.push(
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            console.log('To submit form.');
            if (!this.formRef) {
              console.log("Can not find formRef!");
            } else {
              this.formRef.ngSubmit.emit("ngSubmit");
              console.log('Save clicked finished.');
            }
          }
        }
    );

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
