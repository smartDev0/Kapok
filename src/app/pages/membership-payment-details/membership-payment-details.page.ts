import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, NavController, Platform} from "@ionic/angular";
import {Utils} from "../../services/utils.service";
import {AppSession} from "../../services/app-session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../services/app-constants.service";
import {TranslateUtil} from "../../services/translate-util.service";
import {ToastUtil} from "../../services/toast-util.service";
import {ProvidersService} from "../../services/providers-service.service";
import {MembershipInvoice} from "../../models/payment/membershipPayment/membership-invoice";
import {MembershipPaymentService} from "../../services/membershipPayment/membership-payment.service";
import {PaymentService} from "../../services/payment-service.service";
import {GeneralResponse} from "../../models/transfer/GeneralResponse";
import {PaymentAction} from "../../models/payment/PaymentAction";
declare function require(path: string): any;

@Component({
  selector: 'app-membership-payment-details',
  templateUrl: './membership-payment-details.page.html',
  styleUrls: ['./membership-payment-details.page.scss'],

  providers: [
    PaymentService,
    MembershipPaymentService,
  ],
})
export class MembershipPaymentDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  invoiceId:number;
  invoice:MembershipInvoice;
  providerId:number;
  callback:any = null;
  notReady = true;
  onProcessing:boolean = false;
  finishedProcessing:boolean = false;

  constructor(public utils:Utils, private navCtrl: NavController, private memberPaymentService:MembershipPaymentService,
              public alertCtrl: AlertController, appSession:AppSession, private paymentService:PaymentService,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              public appConstants:AppConstants, public providerService:ProvidersService,
              private actionsheetCtrl: ActionSheetController,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.invoiceId = this.router.getCurrentNavigation().extras.state.invoiceId;
      }
    });


  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(!this.invoiceId){
      this.toastUtil.showToastTranslate("Can not find invoiceId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    if(!this.providerId){
      this.toastUtil.showToastTranslate("Can not find providerId!");
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
    this.memberPaymentService.s_getMembershipInvoiceById(this.appSession.l_getUserId(), this.invoiceId, (invoice:MembershipInvoice) => {
      this.invoice = invoice;

      if(this.invoice && this.invoice.statusId===this.appConstants.PAYMENT_UNPAID_ID && this.invoice.amount>0){
        this.preparePay();
      }
    });
  }

  preparePay(){
    console.log("Good onPay().");
    this.l_processPayment();
  }

  onClose(){
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

  l_processPayment(){
    let l_this = this;
    this.paymentService.s_generateClientTokent(l_this.appSession.l_getUserId(), l_this.providerId, (generalResponse:GeneralResponse) => {
      if(!generalResponse){
        l_this.toastUtil.showToastTranslate("Get payment failed!");
        return;
      }
      if(generalResponse.code!==0){
        l_this.toastUtil.showToastTranslate("Get payment failed: " + generalResponse.message);
        return;
      }
      let clientTokent:string = generalResponse.resultObject;
      if(!clientTokent){
        l_this.toastUtil.showToastTranslate("Get payment failed, result is null!");
        return;
      }

      // if(clientTokent){
      //   let button = document.querySelector('#submit-button');
      //   let dropin = require('braintree-web-drop-in');
      //   let payAmount = this.invoice.amount;
      //
      //   dropin.create({
      //     authorization: clientTokent,
      //     container: '#dropin-container',
      //     env: "sandbox",
      //     card: {
      //       cardholderName: {required: true},
      //     },
      //     paypal: {
      //       commit: true,
      //       intent: 'sale',
      //       flow: 'checkout', // Required, vault
      //       amount: payAmount, // Required
      //       currency: 'CAD', // Required
      //       displayName: this.translateUtil.translateKey('Kapok-Tree store'),
      //     },
      //   }, function (createErr, instance) {
      //     console.log("Inside create dropin.");
      //
      //     // Stop if there was a problem creating the client.
      //     // This could happen if there is a network error or if the authorization
      //     // is invalid.
      //     if(createErr){
      //       console.log("createErr: " + createErr);
      //       if(createErr._braintreeWebError){
      //         console.log("createErr._braintreeWebError.message: " + createErr._braintreeWebError.message);
      //       }
      //     }
      //     if(!instance){
      //       return;
      //     }
      //
      //     instance.on('paymentMethodRequestable', function (event) {
      //       console.log(event.type); // The type of Payment Method, e.g 'CreditCard', 'PayPalAccount'.
      //       if(event.type && event.type==='CreditCard'){
      //         console.log("CreditCard, wait for user click button.");
      //         l_this.notReady = false;
      //         return;
      //       }else{
      //         console.log(event.paymentMethodIsSelected); // True if a customer has selected a payment method when paymentMethodRequestable fires.
      //         console.log("process dropin Paypal checkout.");
      //         l_this.l_processPaymentOnServer(instance, payAmount, l_this);
      //       }
      //     });
      //     instance.on('noPaymentMethodRequestable', function () {
      //       button.setAttribute('disabled', 'true');
      //     });
      //
      //
      //     // For VISA;
      //     button.addEventListener('click', function () {
      //       console.log("Here is to submit request to server.");
      //       l_this.l_processPaymentOnServer(instance, payAmount, l_this);
      //     });
      //   });
      // }

    });
  }

  l_processPaymentOnServer(instance, amount, l_this){
    console.log("Here is to submit request to server.");

    instance.requestPaymentMethod(function (requestPaymentMethodErr, payload) {
      if(requestPaymentMethodErr){
        l_this.toastUtil.showToast(requestPaymentMethodErr);
        return;
      }

      // Submit payload.nonce to your server
      if(payload && payload.nonce){
        let paymentAction = new PaymentAction();
        paymentAction.providerId = l_this.providerId;
        paymentAction.userId = l_this.appSession.l_getUserId();
        paymentAction.paymentNonce = payload.nonce;
        paymentAction.invoiceId = l_this.invoiceId;
        l_this.memberPaymentService.s_membershipCheckOut(l_this.appSession.l_getUserId(), paymentAction, (result:boolean) => {
          if(result){
            l_this.invoice.statusId = l_this.appConstants.PAYMENT_FULLY_ID;
            l_this.toastUtil.showToastTranslate("Checkout succeed. Please check you confirmation email.", 5000);
            if(l_this.callback){
              l_this.callback(l_this.invoice);
            }
            l_this.onClose();
          }else{
            l_this.invoice.statusId = l_this.appConstants.PAYMENT_FAILED_ID;
            l_this.toastUtil.showToastTranslate("Checkout failed!");
            if(l_this.callback){
              l_this.callback(l_this.invoice);
            }
            l_this.onClose();
          }
        });
      }else{
        l_this.invoice.statusId = l_this.appConstants.PAYMENT_FAILED_ID;
        l_this.toastUtil.showToastTranslate("Can not find payment method!");
        if(l_this.callback){
          l_this.callback(l_this.invoice);
        }
        l_this.onClose();
      }
      l_this.notReady = true;
    });
  }

  onDone(){
    console.log("Good onDone.");
    this.onClose();
  }

  onCancelPayment(){
    if(!this.invoiceId){
      this.onClose();
      return;
    }

    console.log("Good onCancelPayment.");
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to cancel the payment and registration?'),
      null, null, this.translateUtil.translateKey('No'), null, this.translateUtil.translateKey('Yes'),
      (data) => {
        console.log("Payment cancelled.");
        this.toastUtil.showToastTranslate("Payment cancelled.");
        this.onClose();
      });
  }

  openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Cancel Payment'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('Cancel clicked');
          this.onCancelPayment();
        }
      }
    );

    this.actionSheet = this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
