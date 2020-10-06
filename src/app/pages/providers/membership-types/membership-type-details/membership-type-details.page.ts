import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, AlertController, IonContent, NavController} from "@ionic/angular";
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {ProviderMemberTypeWithDetails} from "../../../../models/MembershipTypeWithDetails";
import {PriceUnit} from "../../../../models/payment/coursePayment/PriceUnit";
import {PriceUnitService} from "../../../../services/coursePayment/price-unit-service.service";
import {Utils} from "../../../../services/utils.service";

@Component({
  selector: 'app-membership-type-details',
  templateUrl: './membership-type-details.page.html',
  styleUrls: ['./membership-type-details.page.scss'],

  providers: [
    PriceUnitService,
  ],
})
export class MembershipTypeDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  providerId:number = null;
  membershipTypeId:number = null;
  membershipType:ProviderMemberTypeWithDetails = null;

  constructor(public appSession:AppSession, public providerService:ProvidersService, public appConstants:AppConstants,
              public alertCtrl: AlertController, public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, private utils:Utils, private priceUnitService:PriceUnitService,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.membershipTypeId = this.router.getCurrentNavigation().extras.state.membershipTypeId;
        this.membershipType = this.router.getCurrentNavigation().extras.state.membershipType;
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
    if(!this.appSession.l_isSiteAdmin() && !this.appSession.l_isAdministrator(this.providerId)){
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    if(!this.membershipTypeId){
      if(!this.membershipType){
        this.toastUtil.showToastTranslate("Empty membershipType!");
        this.router.navigate([this.appConstants.ROOT_PAGE]);
        return;
      }else{
        this.membershipTypeId = this.membershipType.id;
      }
    }else{
      this.updatePageContent();
    }
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    this.providerService.s_getProviderMembershipTypeDetails(this.membershipTypeId, (membershipType:ProviderMemberTypeWithDetails) => {
      this.membershipType = membershipType;
    });
  }

  onClose(){
    this.navCtrl.pop();
  }

  onDeleteMembershipType(){
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to delete this membership type?'), null,
      null, this.translateUtil.translateKey('No'), null, this.translateUtil.translateKey('Yes'),
      (data) => {
        this.l_deleteMembershipType(this.membershipTypeId);
      });
  }

  l_deleteMembershipType(membershipTypeId:number){
    console.log("Delete membershipTypeId by id: " + membershipTypeId);
    this.providerService.s_deleteProviderMembershipType(this.appSession.l_getUserId(), membershipTypeId, (result:boolean) => {
      if(result){
        this.toastUtil.showToastTranslate("Membership Type removed.");
      }
      this.updatePageContent();
    });
  }

  onEdit() {
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: this.providerId, membershipTypeId: this.membershipTypeId,
      }
    };
    this.router.navigate(['membership-type-edit'], navigationExtras);
  }

  onAddCoursePrice(){
    console.log("Good onAddCoursePrice().");

    let priceUnit = new PriceUnit();
    priceUnit.providerId = this.providerId;
    priceUnit.providerMemberTypeId = this.membershipType.id;
    priceUnit.title = this.membershipType.name + " price";
    priceUnit.enabled = true;
    console.log("priceUnit.title" + priceUnit.title);
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, priceUnit:priceUnit, lockCourseType:true
      }
    };
    this.router.navigate(['price-unit-edit'], navigationExtras);
  }

  onViewPriceUnitDetails(priceUnit:PriceUnit){
    console.log("Good onViewPriceUnitDetails, id: " + priceUnit.id);
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, priceUnit:priceUnit
      }
    };
    this.router.navigate(['price-unit-edit'], navigationExtras);
  }

  onDeleteCoursePrice(priceId:number){
    console.log("Good onDeleteCoursePrice, priceId: " + priceId);
    if(!this.appSession.l_getUserId() || !priceId){
      return false;
    }
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to delete this price?'),
      null, null, this.translateUtil.translateKey('No'), null, this.translateUtil.translateKey('Yes'),
      (data) => {
        this.priceUnitService.s_deletePriceUnit(this.appSession.l_getUserId(), priceId, (result: boolean) => {
          if (result) {
            this.toastUtil.showToastTranslate("PriceUnit deleted.");
          }
          this.updatePageContent();
        });
      });
  }

  async openMenu() {
    let buttons:any = [];
    if(this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin() || this.appSession.l_isInstructor(this.providerId)){
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
            this.onDeleteMembershipType();
          },
        }
      );
    }

    this.actionSheet = await this.actCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
