import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../BasicUserIdPage';
import {ActionSheetController, AlertController, IonContent, NavController} from '@ionic/angular';
import {AppSession} from '../../../services/app-session.service';
import {ProvidersService} from '../../../services/providers-service.service';
import {AppConstants} from '../../../services/app-constants.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {ToastUtil} from '../../../services/toast-util.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {PaymentService} from '../../../services/payment-service.service';
import {Utils} from '../../../services/utils.service';
import {Provider} from '../../../models/Provider';
import {PreApprovedPayment} from '../../../models/payment/coursePayment/PreApprovedPayment';

@Component({
  selector: 'app-pre-payments',
  templateUrl: './pre-payments.page.html',
  styleUrls: ['./pre-payments.page.scss'],

  providers: [
    PaymentService,
  ],
})
export class PrePaymentsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private actionSheet:any;

  providerId:number = null;
  provider:Provider = null;
  prePayments:PreApprovedPayment[] = null;
  searchKey:string = null;
  callback:any = null;

  public showSearchBar:boolean = false;
  public keyIndex:number = 0;

  constructor(public appSession:AppSession, public providerService:ProvidersService, public appConstants:AppConstants,
              public alertCtrl: AlertController, public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, private paymentService:PaymentService, public utils:Utils, ) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.searchKey = null;
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
    this.providerService.s_getPrePaymentsByProviderId(this.appSession.l_getUserId(), this.providerId, (prePayments:PreApprovedPayment[]) => {
      this.prePayments = prePayments;
    });
  }


  toggleSearchBar(){
    this.showSearchBar = !this.showSearchBar;
    this.focusButton();
    //this.checkSearchBarTimeout();;
  }

  focusButton(){
    if(this.showSearchBar && this.search){
      setTimeout(() => {
        this.search.setFocus();
      }, 500);
    }
  }

  onClearSearch(){
    this.getItems(null);
    this.showSearchBar = false;
  }

  checkSearchBarTimeout(){
    this.keyIndex = this.keyIndex +1;
    setTimeout(
        (keyIndex) => {
          if(keyIndex===this.keyIndex){
            this.showSearchBar = false;
          }
        },
        this.appConstants.SEARCH_BAR_SHOW_DELAY,
        this.keyIndex
    );
  }

  getItems(ev: any) {
    if(!this.prePayments){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;

      for(let prePayment of this.prePayments) {
        if(prePayment.email && prePayment.email.toLowerCase().indexOf(val.toLowerCase()) > -1){
          prePayment.hide = false;
        }else{
          prePayment.hide = true;
        }
      }
    }else{
      this.searchKey = null;
      for(let prePayment of this.prePayments) {
        prePayment.hide = false;
      }
    }

    //this.checkSearchBarTimeout();;
  }

  onScrollUp(){
    setTimeout(
        () => {
          this.content.scrollToTop(300);
        },
        100
    );
  }

  onEditPrePayment(event, prePaymentId){
    console.log("Good onEditPrePayment, prePaymentId: " + prePaymentId);
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, prePaymentId: prePaymentId
      }
    };
    this.router.navigate(['pre-payment-edit', this.providerId+"_"+prePaymentId], navigationExtras);
  }

  onCreatePrePayment(){
    let prePayment = new PreApprovedPayment();
    prePayment.providerId = this.providerId;
    prePayment.enabled = true;
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, prePayment:prePayment
      }
    };
    this.router.navigate(['pre-payment-edit', this.utils.getTime()], navigationExtras);
  }

  onDeletePrePay(prePayId:number){
    console.log("Good onDeletePrePay, prePayId: " + prePayId);
    if(!prePayId){
      return;
    }
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to remove this preApprovedPayment?'), null, null,
        this.translateUtil.translateKey('No'), null, this.translateUtil.translateKey('Yes'),
        (data) => {
          this.providerService.s_deletePrePayment(this.appSession.l_getUserId(), prePayId, (result:boolean) => {
            if(result){
              this.toastUtil.showToastTranslate("Remove preApprovedPayment successfully.");
            }else{
              this.toastUtil.showToastTranslate("Failed removing preApprovedPayment.");
            }
            this.updatePageContent();
          });
        });
  }

  onClose(){
    this.navCtrl.pop();
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
        {
          text: this.translateUtil.translateKey('Create'),
          handler: () => {
            console.log('Create clicked');
            this.onCreatePrePayment();
          },
        }
    );
    buttons.push(
        {
          text: this.translateUtil.translateKey('CLOSE'),
          // role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('CLOSE clicked');
            this.onClose();
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
