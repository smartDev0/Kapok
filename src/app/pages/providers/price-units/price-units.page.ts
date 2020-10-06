import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, IonContent, NavController} from "@ionic/angular";
import {Utils} from "../../../services/utils.service";
import {AppSession} from "../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {AppConstants} from "../../../services/app-constants.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {PriceUnit} from "../../../models/payment/coursePayment/PriceUnit";
import {Provider} from "../../../models/Provider";
import {PriceUnitService} from "../../../services/coursePayment/price-unit-service.service";

@Component({
  selector: 'app-price-units',
  templateUrl: './price-units.page.html',
  styleUrls: ['./price-units.page.scss'],

  providers: [
    PriceUnitService,
  ],
})
export class PriceUnitsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  providerId:number = null;
  provider:Provider = null;
  priceUnits:PriceUnit[] = null;
  callback:any = null;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, public priceUnitService:PriceUnitService,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils,) {
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
    this.priceUnitService.s_getPriceUnitsByProviderId(this.appSession.l_getUserId(), this.providerId, (priceUnits:PriceUnit[]) => {
      this.priceUnits = priceUnits;
    });
  }

  onViewDetails(event, priceUnitId){
    console.log("Good onViewDetails, couponId: " + priceUnitId);
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, priceUnitId: priceUnitId
      }
    };
    this.router.navigate(['price-unit-details', this.providerId+"_"+priceUnitId], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  onCreatePriceUnit(){
    let priceUnit = new PriceUnit();
    priceUnit.providerId = this.providerId;
    priceUnit.title = "New priceUnit";
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, priceUnit:priceUnit
      }
    };
    this.router.navigate(['price-unit-edit'], navigationExtras);
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
          this.onCreatePriceUnit();
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
