import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, NavController} from "@ionic/angular";
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {PriceUnitService} from "../../../../services/coursePayment/price-unit-service.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {PriceUnit} from "../../../../models/payment/coursePayment/PriceUnit";
import {NgForm} from "@angular/forms";
import {ProviderCourseTypeWithDetails} from "../../../../models/ProviderCourseTypeWithDetails";
import {LearnType} from "../../../../models/code/LearnType";
import {ProviderMemberTypeWithDetails} from "../../../../models/MembershipTypeWithDetails";
import {TripHill} from "../../../../models/TripHill";
import {CodeTableService} from "../../../../services/code-table-service.service";
import {DateTimeUtils} from "../../../../services/date-time-utils.service";

@Component({
  selector: 'app-price-unit-edit',
  templateUrl: './price-unit-edit.page.html',
  styleUrls: ['./price-unit-edit.page.scss'],

  providers: [
    PriceUnitService,
  ],
})
export class PriceUnitEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  lockCourseType:boolean;
  providerId:number;
  priceUnitId:number;
  priceUnit:PriceUnit;
  submitted:boolean;
  callback:any;
  currentDateTime:string;
  providerCourseTypes:ProviderCourseTypeWithDetails[];
  learnTypes:LearnType[];
  providerMemberTypes:ProviderMemberTypeWithDetails[];
  tripHills:TripHill[];
  confirmedLeave:boolean;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, public priceUnitService:PriceUnitService,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils, private alertCtrl:AlertController,
              private codeTableService:CodeTableService, private dateTimeUtils:DateTimeUtils,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.currentDateTime = this.dateTimeUtils.getCurrentLocalTime();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.lockCourseType = this.router.getCurrentNavigation().extras.state.lockCourseType;
        this.priceUnit = this.router.getCurrentNavigation().extras.state.priceUnit;
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


    if(!this.priceUnit){
      this.l_updateCouponById();
    }
    this.providersService.s_getProviderCourseTypesByProviderId(this.providerId, true, (pcTypes:ProviderCourseTypeWithDetails[]) => {
      this.providerCourseTypes = pcTypes;
    });
    this.codeTableService.getLearnType((types:LearnType[]) => {
      this.learnTypes = types;
    });
    this.providersService.s_getMembershipTypesForProviderId(this.providerId, true, (providerMemberTypes:ProviderMemberTypeWithDetails[]) => {
      this.providerMemberTypes = providerMemberTypes;
    });
    if(this.appSession.l_getUserId()){
      this.providersService.s_getTripHillsForProviderId(this.appSession.l_getUserId(), this.providerId, (hills:TripHill[]) => {
        this.tripHills = hills;
      });
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

  l_updateCouponById(){
    this.priceUnitService.s_getPriceUnitDetailsById(this.appSession.l_getUserId(), this.priceUnitId, (priceUnit:PriceUnit) => {
      this.priceUnit = priceUnit;
    });
  }

  deleteTime(fieldName){
    this.priceUnit[fieldName] = null;
  }

  savePriceUnit(formRef:NgForm) {
    console.log("savePriceUnit called good.");
    this.submitted = true;

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
    }else{
      this.priceUnitService.s_savePriceUnit(this.appSession.l_getUserId(), this.priceUnit, (savedPriceUnit:PriceUnit) => {
        this.confirmedLeave = true;
        this.priceUnit = savedPriceUnit;
        if(this.callback){
          this.callback(this.priceUnit);
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
    this.l_updateCouponById();
  }

  l_close(){
    this.priceUnitId = null;
    this.priceUnit = null;
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
