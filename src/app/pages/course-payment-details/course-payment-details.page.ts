import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController, IonContent, IonRouterOutlet,
  LoadingController,
  ModalController,
  NavController
} from "@ionic/angular";
import {AppSession} from "../../services/app-session.service";
import {ProvidersService} from "../../services/providers-service.service";
import {Utils} from "../../services/utils.service";
import {CoursePaymentService} from "../../services/coursePayment/course-payment-service.service";
import {TranslateUtil} from "../../services/translate-util.service";
import {UserService} from "../../services/user-service.service";
import {ToastUtil} from "../../services/toast-util.service";
import {PaymentService} from "../../services/payment-service.service";
import {AppConstants} from "../../services/app-constants.service";
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {CourseRegistrationInvoice} from "../../models/payment/coursePayment/CourseRegistrationInvoice";
import {PaymentAction} from "../../models/payment/PaymentAction";
import {ConfigureForClient} from "../../models/transfer/ConfigureForClient";
import {GeneralResponse} from "../../models/transfer/GeneralResponse";
import {VerifyPreApprovedPaymentRequest} from "../../models/transfer/VerifyPreApprovedPaymentRequest";
import {CourseCalculationDetailsPage} from "./course-calculation-details/course-calculation-details.page";
import {TimerUtil} from "../../utils/timer-util";
import {Provider} from '../../models/Provider';
import {PaymentProcessUtil} from '../../services/coursePayment/payment-process-util.service';
declare function require(path: string): any;

@Component({
  selector: 'app-course-payment-details',
  templateUrl: './course-payment-details.page.html',
  styleUrls: ['./course-payment-details.page.scss'],

  providers: [
    PaymentService,
  ],
})
export class CoursePaymentDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  private actionSheet:any;
  private myModal:any;

  providerId:number;
  provider:Provider = null;

  payOnline = false;
  payOffline = false;

  callback:any = null;
  timerUtil:TimerUtil = null;
  notReady = true;
  finishedProcessing:boolean = false;
  cancelled:boolean = false;

  public initialBrainTree:boolean = false;
  public initialLoading:any = null;
  public loading:any = null;

  registrationId = null;

  constructor(private navCtrl: NavController, appSession:AppSession, private loadingCtrl:LoadingController,
              public providersService:ProvidersService, public utils:Utils, public coursePaymentService:CoursePaymentService,
              public translateUtil:TranslateUtil, public userService:UserService, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, public paymentService:PaymentService, public modalCtrl: ModalController,
              private alertCtrl:AlertController, public appConstants:AppConstants, private route: ActivatedRoute, router: Router,
              public modalController: ModalController, public ionRouterOutlet:IonRouterOutlet, private paymentProcessUtil:PaymentProcessUtil) {
    super(appSession, router, appConstants);
    super.l_checkUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
      }
    });
  }

  ngOnInit() {
    if(!this.providerId){
      this.providerId = +this.route.snapshot.paramMap.get('providerId');
    }
  }

  ionViewWillEnter(){
    if(this.providerId){
      this.providersService.s_getProviderById(this.providerId, (provider:Provider) =>{
        this.provider = provider;
        this.payOnline = this.provider.payOnline;
        this.payOffline = this.provider.payOffline;

        if(!this.payOnline && !this.payOffline){
          this.utils.showOkAlert(this.alertCtrl, "Provider has not setup payment method yet.", null);
        }
      });
    }
  }

  ionViewDidEnter() {
    if(!this.coursePaymentService.invoice){
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
    if(this.coursePaymentService.invoice && this.coursePaymentService.invoice.amount>0){
      if(this.coursePaymentService.invoice.statusId===this.appConstants.PAYMENT_UNPAID_ID ||
        this.coursePaymentService.invoice.statusId===this.appConstants.PAYMENT_TOPAY_OFFLINE_ID ||
        this.coursePaymentService.invoice.statusId===this.appConstants.PAYMENT_TOPAY_ONLINE_ID) {

        if(this.provider.payOffline){
          this.preparePay();
        }else{
          this.appSession.getClientConfigure((clientConf:ConfigureForClient) => {
            this.utils.showAlertConfirm(
              this.alertCtrl,
              this.translateUtil.translateKey('You have ' + clientConf.InvoiceExpireMinutes +
                ' minutes to do the payment, or registration to course will be cancelled. Continue?'),
              null, null,
              this.translateUtil.translateKey('No'),
              () => {
                this.onClose();
              },
              this.translateUtil.translateKey('Yes'),
              (data) => {
                this.preparePay();
                console.log("this.appSession.clientConfigure.InvoiceExpireMinutes: " + clientConf.InvoiceExpireMinutes);
                this.timerUtil = new TimerUtil(this, clientConf.InvoiceExpireMinutes,
                  this.l_checkingCallback, this.l_timeOutCallback);
              });
          });
        }
      }
    }else{
      console.log("No current invoice.");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  ionViewCanLeave(){
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
    if(this.myModal){
      this.myModal.dismiss();
    }
    if(this.initialLoading){
      this.initialBrainTree = false;
      this.initialLoading.dismiss();
    }
    if(this.loading){
      this.loading.dismiss();
    }

    if(!this.coursePaymentService.invoice ||
        this.coursePaymentService.invoice.statusId!==this.appConstants.PAYMENT_UNPAID_ID ||
        // this.coursePaymentService.invoice.statusId!=this.appConstants.PAYMENT_OFFLINE_ID) ||
        this.coursePaymentService.invoice.amount===0 ||
        this.finishedProcessing || this.cancelled){
      return true;
    }
    if(this.coursePaymentService.invoice){
      this.onCancelPayment();
    }

    return false;
  }


  l_checkingCallback(context_this:any){
    console.log("Good l_checkingCallback.");
    if(!context_this.coursePaymentService.invoice || !context_this.coursePaymentService.invoice.id){
      context_this.coursePaymentService.invoice = null;
      context_this.timerUtil.stop(context_this.timerUtil);
      // context_this.timerUtil = null;
      context_this.router.navigate([context_this.appConstants.ROOT_PAGE]);
      return;
    }

    context_this.coursePaymentService.s_getCourseInvoiceById(context_this.appSession.l_getUserId(), context_this.coursePaymentService.invoice.id,
      (invoice:CourseRegistrationInvoice) => {
        console.log("Good s_getCourseInvoiceById.");
        if(!invoice || invoice.statusId === context_this.appConstants.PAYMENT_CANCELLED_ID || invoice.statusId === context_this.appConstants.PAYMENT_FAILED_ID ||
          invoice.statusId === context_this.appConstants.PAYMENT_CLIENT_TIMEOUT_ID || invoice.statusId === context_this.appConstants.PAYMENT_SERVER_TIMEOUT_ID){
          console.log("payment invoice is NOT succeed!");
          context_this.toastUtil.showToastTranslate("payment invoice is NOT succeed!");

          context_this.coursePaymentService.invoice = null;
          context_this.timerUtil.stop(context_this.timerUtil);
          // context_this.timerUtil = null;

          context_this.router.navigate([context_this.appConstants.ROOT_PAGE]);
          return;
        }else if(invoice.statusId === context_this.appConstants.PAYMENT_FULLY_ID || invoice.statusId === context_this.appConstants.PAYMENT_TOPAY_OFFLINE_ID ||
          invoice.statusId === context_this.appConstants.PAYMENT_WAIVED_ID ){
          context_this.toastUtil.showToastTranslate("payment invoice is succeed.");

          let navigationExtras: NavigationExtras = {
            state: {
              registrationId:context_this.coursePaymentService.invoice.registrationId,
              providerId:context_this.providerId,
              showBackBtn: -1,
            }
          };
          context_this.router.navigate(['ski-course-registration-details'], navigationExtras);

          context_this.coursePaymentService.invoice = null;
          context_this.timerUtil.stop(context_this.timerUtil);
          // context_this.timerUtil = null;

          context_this.router.navigate([context_this.appConstants.ROOT_PAGE]);
        }else{
          context_this.coursePaymentService.invoice = null;
          context_this.timerUtil.stop(context_this.timerUtil);
          // context_this.timerUtil = null;
          context_this.router.navigate([context_this.appConstants.ROOT_PAGE]);
        }
      });
  }

  l_timeOutCallback(context_this:any){
    console.log("Good l_timeOutCallback.");
    context_this.timerUtil.stop(context_this.timerUtil);
    // context_this.timerUtil = null;

    if(!context_this.coursePaymentService.invoice){
      context_this.router.navigate([context_this.appConstants.ROOT_PAGE]);
      return;
    }

    context_this.coursePaymentService.s_getCourseInvoiceById(context_this.appSession.l_getUserId(), context_this.coursePaymentService.invoice.id,
      (invoice:CourseRegistrationInvoice) => {
        if(invoice && invoice.statusId === context_this.appConstants.PAYMENT_FULLY_ID || invoice.statusId === context_this.appConstants.PAYMENT_TOPAY_OFFLINE_ID ||
          invoice.statusId === context_this.appConstants.PAYMENT_WAIVED_ID || invoice.statusId === context_this.appConstants.PAYMENT_PRE_APPROVED){
          context_this.coursePaymentService.invoice = null;
          context_this.timerUtil.stop(context_this.timerUtil);
          // context_this.timerUtil = null;
          let navigationExtras: NavigationExtras = {
            state: {
              registrationId:context_this.coursePaymentService.invoice.registrationId,
              providerId:context_this.providerId,
              showBackBtn: -1,
            }
          };
          this.router.navigate(['ski-course-registration-details'], navigationExtras);
          return;
        }else{
          // let paymentAction = new PaymentAction();
          // paymentAction.userId = context_this.appSession.l_getUserId();
          // paymentAction.invoiceId = context_this.coursePaymentService.invoice.id;
          // paymentAction.statusId = context_this.appConstants.PAYMENT_CLIENT_TIMEOUT_ID;
          // context_this.coursePaymentService.s_cancelPaymentByClient(context_this.providerId, context_this.appSession.l_getUserId(),
          //   context_this.coursePaymentService.invoice.id, (result:boolean) => {
          //     context_this.toastUtil.showToastTranslate("payment invoice is timed out!");
          //     context_this.coursePaymentService.invoice = null;
          //     context_this.cancelled = true;
          //     context_this.router.navigate([context_this.appConstants.ROOT_PAGE]);
          // });

          context_this.coursePaymentService.invoice = null;
          context_this.timerUtil.stop(context_this.timerUtil);
          // context_this.timerUtil = null;
          context_this.router.navigate([context_this.appConstants.ROOT_PAGE]);
          return;
        }
      });
  }


  async onViewAmountDetails(){
    console.log("Good onViewAmountDetails().");
    if(this.coursePaymentService.invoice){
      const modal = await this.modalController.create({
        component: CourseCalculationDetailsPage,
        componentProps: {invCal:this.coursePaymentService.invoice.invoiceCalculation},
      });
      await modal.present();
      // const { data } = await modal.onDidDismiss();
    }else{
      this.toastUtil.showToastTranslate("Empty invoice calculation!");
    }
  }

  onClose(){
    if(this.coursePaymentService.invoice && this.paymentProcessUtil.isCourseRequirePayment(this.coursePaymentService.invoice.statusId)){
      this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to cancel the registration and payment?", null, null, "Cancel", null, "Yes",
        (data) => {
          console.log("Cancel payment from client.");
          this.l_cancalPayment();
          this.l_close();
        }
      );
    }else{
      this.l_close();
    }
  }

  l_close(){
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

  l_cancalPayment(){
    console.log("Cancel payment from client.");
    this.coursePaymentService.s_cancelPaymentByClient(this.providerId, this.appSession.l_getUserId(), this.coursePaymentService.invoice.id, (result: boolean) => {
      if (result) {
        this.toastUtil.showToastTranslate("Payment cancelled.");
      } else {
        this.toastUtil.showToastTranslate("Payment cancelling failed.");
      }
      this.coursePaymentService.invoice = null;
    });
    this.cancelled = true;
  }

  onPayOffline(){
    console.log("Good onPayOffline().");
    if(!this.payOffline){
      this.utils.showOkAlert(this.alertCtrl, "Current provider does not accept pay offline.", null);
    }

    let payAmount = this.coursePaymentService.invoice.amount;
    console.log("payAmount: " + payAmount + ", no payment needed, send to processing.");
    let paymentAction = new PaymentAction();
    paymentAction.providerId = this.providerId;
    paymentAction.userId = this.appSession.l_getUserId();
    paymentAction.invoiceId = this.coursePaymentService.invoice.id;
    paymentAction.statusId = this.appConstants.PAYMENT_TOPAY_OFFLINE_ID;
    this.l_sendPayment(this, paymentAction);

    if(!this.coursePaymentService.invoice.alerted){
      this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey("Success"),
        this.translateUtil.translateKey("Course registered successfully. Check your confirmation email for details."));
      this.coursePaymentService.invoice.alerted = true;
    }
  }

  preparePay(){
    console.log("Good onPay().");
    this.l_initialPayment();
  }

  l_scrollToId(id:string):boolean{
    console.log("l_scrollToId, id: " + id);
    let element = document.getElementById(id);
    if(!element){
      return false;
    }
    let yOffset = document.getElementById(id).offsetTop;
    console.log("scrollX: " + yOffset);

    setTimeout(
      () => {
        this.content.scrollByPoint(0, yOffset, 100);
      },
      300
    );

    return true;
  }

  async l_initialPayment(){
    if(!this.payOnline){
      return;
    }

    let l_this = this;
    l_this.initialLoading = await l_this.loadingCtrl.create({
      message: this.translateUtil.translateKey('Loading...'),
      spinner: 'crescent',
      // duration: 2000
    });
    l_this.initialBrainTree = true;
    await l_this.initialLoading.present();

    this.paymentService.s_generateClientTokent(l_this.appSession.l_getUserId(), l_this.providerId, (generalResponse:GeneralResponse) => {
      if(!generalResponse){
        l_this.toastUtil.showToastTranslate("Get payment failed!");
        return;
      }
      if(generalResponse.code!==0){
        l_this.toastUtil.showToast(this.translateUtil.translateKey("Get payment failed: ") + generalResponse.message);
        return;
      }
      let clientTokent:string = generalResponse.resultObject;
      if(!clientTokent){
        l_this.toastUtil.showToastTranslate("Get payment failed, result is null!");
        return;
      }

      if(clientTokent){
        let button = document.querySelector('#payOnline-button');
        let dropin = require('braintree-web-drop-in');
        let payAmount = l_this.coursePaymentService.invoice.amount;
        // console.log("clientTokent: " + clientTokent);
        console.log("payment amount: " + payAmount);

        // For zero payment; auto send out;
        if(payAmount<=0){
          l_this.notReady = false;
          button.addEventListener('click', function () {
            console.log("payAmount: " + payAmount + ", no payment needed, send to processing.");
            let paymentAction = new PaymentAction();
            paymentAction.providerId = l_this.providerId;
            paymentAction.userId = l_this.appSession.l_getUserId();
            paymentAction.invoiceId = l_this.coursePaymentService.invoice.id;
            paymentAction.statusId = l_this.appConstants.PAYMENT_WAIVED_ID;
            l_this.l_sendPayment(l_this, paymentAction);
          });
          return;
        }

        dropin.create({
          // authorization: 'CLIENT_AUTHORIZATION',
          authorization: clientTokent,
          container: '#dropin-container',
          env: "sandbox",
          card: {
            cardholderName: {required: true},
            // overrides: {
            //   styles: {
            //     input: {
            //       color: 'blue',
            //       'font-size': '9px'
            //     },
            //     '.number': {
            //       'font-family': 'monospace'
            //       // Custom web fonts are not supported. Only use system installed fonts.
            //     },
            //     '.invalid': {
            //       color: 'red'
            //     }
            //   }
            // }
          },
          paypal: {
            commit: true,
            intent: 'sale',
            flow: 'checkout', // Required, vault
            amount: payAmount, // Required
            currency: 'CAD', // Required
            displayName: 'Kapok-Tree store',

            // enableShippingAddress: true,
            // shippingAddressEditable: false,
            // shippingAddressOverride: {
            //   recipientName: 'Buyer03',
            //   line1: '1234 Main St.',
            //   line2: 'Unit 1',
            //   city: 'Chicago',
            //   countryCode: 'US',
            //   postalCode: '60652',
            //   state: 'IL',
            //   phone: '123.456.7890'
            // },
          },
        }, function (createErr, instance) {
          console.log("Inside create dropin.");

          l_this.initialBrainTree = false;
          if(l_this.initialLoading){
            l_this.initialLoading.dismiss();
          }

          l_this.l_scrollToId("dropin-container");

          // Stop if there was a problem creating the client.
          // This could happen if there is a network error or if the authorization
          // is invalid.
          if(createErr){
            console.log("createErr: " + createErr);
            if(createErr._braintreeWebError){
              console.log("createErr._braintreeWebError.message: " + createErr._braintreeWebError.message);
            }
            return;
          }
          if(!instance){
            return;
          }

          instance.on('paymentMethodRequestable', function (event) {
            console.log(event.type); // The type of Payment Method, e.g 'CreditCard', 'PayPalAccount'.
            if(event.type && event.type==='CreditCard'){
              console.log("CreditCard, wait for user click button.");
              l_this.notReady = false;
              l_this.l_scrollToId("payNow-button");
              return;
            }else{
              console.log(event.paymentMethodIsSelected); // True if a customer has selected a payment method when paymentMethodRequestable fires.
              console.log("process dropin Paypal checkout.");
              l_this.l_processPaymentOnServer(instance, payAmount, l_this);
            }
          });
          instance.on('noPaymentMethodRequestable', function () {
            l_this.notReady = true;
          });

          // For VISA;
          button.addEventListener('click', function () {
            console.log("Here is to submit request to server.");
            l_this.l_processPaymentOnServer(instance, payAmount, l_this);
          });
        });
      }
    });
  }

  async l_processPaymentOnServer(instance, amount, l_this){
    l_this.onProcessing = true;
    l_this.timerUtil.stop(l_this.timerUtil);
    // l_this.timerUtil = null;

    // block page here;
    // if(!this.loading){
    l_this.loading = await l_this.loadingCtrl.create({
      message: this.translateUtil.translateKey('Processing...'),
      spinner: 'crescent',
      // duration: 2000
    });
    await l_this.loading.present();


    console.log("Before requestPaymentMethod.");
    instance.requestPaymentMethod(function (requestPaymentMethodErr, payload) {
      console.log("Get back requestPaymentMethod.");
      if(requestPaymentMethodErr){
        l_this.toastUtil.showToast(requestPaymentMethodErr);
        if(l_this.loading) {
          l_this.loading.dismiss();
        }
        return;
      }
      // Submit payload.nonce to your server
      console.log("payload.nonce: " + (payload?payload.nonce:"null payload!"));
      if(payload && payload.nonce){

        let paymentAction = new PaymentAction();
        paymentAction.providerId = l_this.providerId;
        paymentAction.userId = l_this.appSession.l_getUserId();
        paymentAction.paymentNonce = payload.nonce;
        paymentAction.invoiceId = l_this.coursePaymentService.invoice.id;
        paymentAction.statusId = l_this.appConstants.PAYMENT_TOPAY_ONLINE_ID;
        l_this.l_sendPayment(l_this, paymentAction);
      }else{
        if(l_this.loading) {
          l_this.loading.dismiss();
        }
        l_this.coursePaymentService.invoice.statusId = l_this.appConstants.PAYMENT_FAILED_ID;
        l_this.toastUtil.showToast("Can not find payment method!");
        l_this.onClose();
      }
    });
  }

  l_sendPayment(l_this, paymentAction:PaymentAction){
    if(!paymentAction.statusId){
      this.toastUtil.showToastTranslate("PaymentAction must have status!");
      console.log("PaymentAction must have status!");
      // return;
    }

    if(!l_this.coursePaymentService.invoice){
      l_this.toastUtil.showToastTranslate("Can not find invoice!");
      return;
    }

    l_this.registrationId = l_this.coursePaymentService.invoice.registrationId;
    l_this.coursePaymentService.s_courseCheckOut(l_this.providerId, l_this.appSession.l_getUserId(), paymentAction, (genResponse:GeneralResponse) => {
      if(l_this.loading) {
        l_this.loading.dismiss();
      }

      l_this.onProcessing = false;
      l_this.finishedProcessing = true;

      if(l_this.coursePaymentService.invoice){
        l_this.coursePaymentService.invoice = null;
      }

      if(genResponse && genResponse.code===0){
        l_this.toastUtil.showToastTranslate("Checkout succeed. Please check you confirmation email.", 5000);
        if(l_this.appSession.l_getUserId()){
          let navigationExtras: NavigationExtras = {
            state: {
              registrationId:l_this.registrationId,
              providerId:l_this.providerId,
              showBackBtn: -1,
            }
          };
          l_this.router.navigate(['ski-course-registration-details'], navigationExtras);
        }else{
          l_this.router.navigate([l_this.appConstants.ROOT_PAGE]);
        }
      }else{
        l_this.utils.showOkAlert(this.alertCtrl, l_this.translateUtil.translateKey("Checkout failed!"), (genResponse==null?"":genResponse.message));
        l_this.onClose();
      }
    });
  }

  async onPreApprovedPayment(){
    console.log("Good onPreApprovedPayment().");
    let alert = await this.alertCtrl.create({
      header: 'Prompt!',
      inputs: [
        {
          name: this.translateUtil.translateKey('Email'),
          type: 'text',
        },
        {
          name: this.translateUtil.translateKey('Code'),
          type: 'text',
        }
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
          text: this.translateUtil.translateKey('Verify'),
          handler: data => {
            if(data.Email && data.Code) {
              console.log("Code: " + data.Code);
              this.l_verifyAndPrepay(data.Email, data.Code);
            } else {
              this.toastUtil.showToastTranslate("Please enter email and code to verify!");
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async l_verifyAndPrepay(email:string, code:string){
    if(!email || !code){
      return;
    }

    this.loading = await this.loadingCtrl.create({
      message: this.translateUtil.translateKey('Processing...'),
      spinner: 'crescent',
      // duration: 2000
    });
    await this.loading.present();

    let verifyRequest = new VerifyPreApprovedPaymentRequest(this.providerId, email, code, this.coursePaymentService.invoice.id);
    this.coursePaymentService.s_verifyPreApprovedPayment(verifyRequest, (genResponse:GeneralResponse) => {
      if(genResponse && genResponse.resultObject){
        let preApprovedPaymnetId = genResponse.resultObject;
        console.log("Got preApprovedPaymnetId: " + preApprovedPaymnetId);

        let paymentAction = new PaymentAction();
        paymentAction.providerId = this.providerId;
        paymentAction.userId = this.appSession.l_getUserId();
        paymentAction.invoiceId = this.coursePaymentService.invoice.id;
        paymentAction.statusId = this.appConstants.PAYMENT_PRE_APPROVED;
        paymentAction.prePaymentId = preApprovedPaymnetId;
        this.l_sendPayment(this, paymentAction);
      }else{
        if(this.loading){
          this.loading.dismiss();
        }

        this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey('Can not find valid pre payment by provided information! ' + genResponse.message), null);
      }
    });
  }

  onCancelPayment(){
    if(!this.coursePaymentService.invoice){
      this.onClose();
      return;
    }

    console.log("Good onCancelPayment.");
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to cancel the payment and registration?'), null, null,
      this.translateUtil.translateKey('No'), null, this.translateUtil.translateKey('Yes'),
      (data) => {
        console.log("Cancel payment from client.");
        this.l_cancalPayment();
        this.l_close();
      }
    );
  }

  async openMenu() {
    let buttons:any = [];
    if(this.coursePaymentService.invoice && this.coursePaymentService.invoice.amount>0 &&
      this.coursePaymentService.invoice.statusId===this.appConstants.PAYMENT_UNPAID_ID){
      buttons.push(
        {
          text: this.translateUtil.translateKey('PreApproved Payment'),
          // role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('PreApproved clicked');
            this.onPreApprovedPayment();
          }
        }
      );
    }
    buttons.push(
      {
        text: this.translateUtil.translateKey('Close'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('Close clicked');
          this.onClose();
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
