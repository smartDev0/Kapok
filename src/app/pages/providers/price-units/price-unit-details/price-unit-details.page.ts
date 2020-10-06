import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, NavController} from "@ionic/angular";
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {PriceUnitService} from "../../../../services/coursePayment/price-unit-service.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {PriceUnit} from "../../../../models/payment/coursePayment/PriceUnit";

@Component({
  selector: 'app-price-unit-details',
  templateUrl: './price-unit-details.page.html',
  styleUrls: ['./price-unit-details.page.scss'],

  providers: [
    PriceUnitService,
  ],
})
export class PriceUnitDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  providerId:number;
  priceUnitId:number = null;
  priceUnit:PriceUnit = null;
  callback:any = null;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, public priceUnitService:PriceUnitService,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils, private alertCtrl:AlertController,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.priceUnitId = this.router.getCurrentNavigation().extras.state.priceUnitId;
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

    if(!this.priceUnitId){
      this.toastUtil.showToastTranslate("Empty priceUnitId!");
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
    this.priceUnitService.s_getPriceUnitDetailsById(this.appSession.l_getUserId(), this.priceUnitId, (priceUnit:PriceUnit) => {
      this.priceUnit = priceUnit;
    });
  }

  openPage(selection:string) {
    // let options = {enableBackdropDismiss: false};
    switch(selection){
      case "applyMembers": {
        console.log("applyMembers clicked.");
        break;
      }
      default: {
        console.log("Unknown selection: " + selection);
        break;
      }
    }
  }

  isModifyDisabled(){
    // // Update disable buttons;
    // if(this.eventsService.event.ownerUserId==this.userId){
    //   this.disableModifyButtons = false;
    // }else{
    //   this.disableModifyButtons = true;
    // }
    // return this.disableModifyButtons;
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  l_getYesNo(value:boolean){
    if(value){
      return this.translateUtil.translateKey("YES");
    }else{
      return this.translateUtil.translateKey("NO");
    }
  }

  onEdit() {
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, priceUnitId:this.priceUnitId
      }
    };
    this.router.navigate(['price-unit-edit', this.providerId+"_"+this.priceUnitId], navigationExtras);
  }

  onDelete(){
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Delete this priceUnit?'), null, null,
      this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('Delete'),
      (data) => {
        this.l_delete();
      });
  }

  l_delete(){
    if(!this.appSession.l_getUserId() || !this.priceUnitId){
      return false;
    }
    this.priceUnitService.s_deletePriceUnit(this.appSession.l_getUserId(), this.priceUnitId, (result:boolean) => {
      if(result){
        this.toastUtil.showToastTranslate("PriceUnit deleted.");
      }
      this.priceUnitId = null;
      this.priceUnit = null;
      this.onClose();
    });
  }

  onClose(){
    this.navCtrl.pop();
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Edit'),
        handler: () => {
          console.log('Edit clicked');
          this.onEdit();
        },
      }
    );
    buttons.push(
      {
        text: this.translateUtil.translateKey('Delete'),
        handler: () => {
          console.log('Delete clicked');
          this.onDelete();
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
