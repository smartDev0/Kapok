import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent,
  NavController,
} from "@ionic/angular";
import {AppSession} from "../../../../../services/app-session.service";
import {AppConstants} from "../../../../../services/app-constants.service";
import {ToastUtil} from "../../../../../services/toast-util.service";
import {ProvidersService} from "../../../../../services/providers-service.service";
import {Utils} from "../../../../../services/utils.service";
import {TranslateUtil} from "../../../../../services/translate-util.service";
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from "@angular/forms";
import {ProviderMemberWithDetails} from "../../../../../models/ProviderMemberWithDetails";
import {ProviderMemberTypeWithDetails} from "../../../../../models/MembershipTypeWithDetails";
import {GeneralResponse} from '../../../../../models/transfer/GeneralResponse';
import {MembershipPaymentService} from '../../../../../services/membershipPayment/membership-payment.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.page.html',
  styleUrls: ['./membership.page.scss'],
})
export class MembershipPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;
  @ViewChild("formRef") formRef:NgForm;
  public submitted:boolean;

  public userId:number;
  public providerId:number;
  public membership:ProviderMemberWithDetails;
  public selectedMembershipType:ProviderMemberTypeWithDetails;
  providerMemberTypes:ProviderMemberTypeWithDetails[];

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil, public alertCtrl:AlertController,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private actionsheetCtrl:ActionSheetController, private navCtrl:NavController,
              private route: ActivatedRoute, public router:Router, private memberPaymentService:MembershipPaymentService,
              ) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();

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
      this.toastUtil.showToastTranslate("providerId is empty!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    if(!this.userId){
      this.toastUtil.showToastTranslate("userId is empty!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    this.updatePageContent();
  }

  updatePageContent(){
    if(!this.providerId || !this.userId){
      console.log("Empty userId!");
      this.onClose();
    }

    this.providerService.s_getMembershipTypesForProviderId(this.providerId, true, (providerMemberTypes:ProviderMemberTypeWithDetails[]) => {
      this.providerMemberTypes = providerMemberTypes;
      this.providerMemberTypes = this.providerMemberTypes.filter(
        mType => {
          return mType.activated===true;
        });
        this.updateDefaultType();
    });

    this.providerService.s_getMemberDetailsForProviderIdUserId(this.providerId, this.userId, (membership:ProviderMemberWithDetails) => {
      this.membership = membership;
      if(this.membership){
        this.updateDefaultType();
      }
    });
  }

  ionViewWillLeave(){
    if(this.actionSheet){
      this.actionSheet.dismiss();
    }
  }

  updateDefaultType(){
    if(this.membership && this.providerMemberTypes && this.providerMemberTypes.length===1){
      this.membership.providerMemberTypeId = this.providerMemberTypes[0].id;
    }
    if(this.membership){
      this.memberTypeChanged(this.membership.providerMemberTypeId);
    }
  }

  memberTypeChanged(mTypeId:number){
    console.log("mTypeId: " + mTypeId);
    if(mTypeId && this.providerMemberTypes){
      for(let mt of this.providerMemberTypes){
        if(mt.id===mTypeId){
          this.selectedMembershipType = mt;
          return;
        }
      }
    }else{
      this.selectedMembershipType = null;
    }
  }

  onClose(){
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  saveMembership(){
    console.log("Good saveMembership().");
    this.memberPaymentService.s_saveMembership(this.appSession.l_getUserId(), this.membership, (genResponse:GeneralResponse) => {
      if(!genResponse){
        this.onClose();
        return;
      }

      if(genResponse.code<0 && genResponse.message){
        this.toastUtil.showToast(genResponse.message);
      }else if(genResponse.code===0){
        this.toastUtil.showToast("Membership saved.");
        this.membership = genResponse.resultObject;
      }
      this.onClose();
    });
  }

  onSave(){
    if(!this.formRef){
      console.log("Can not find formRef!");
    }else{
      this.formRef.ngSubmit.emit("ngSubmit");
      console.log('Save clicked finished.');
    }
  }

  onRegisterMember(){
    console.log("Good onRegisterMember.");
    if(!this.membership){
      this.membership = new ProviderMemberWithDetails();
      this.membership.providerId = this.providerId;
      this.membership.userId = this.userId;
    }
    this.updateDefaultType();
  }

  async openMenu() {
    let buttons:any = [];

    if(!this.membership){
      buttons.push(
        {
          text: this.translateUtil.translateKey('Register member'),
          handler: () => {
            console.log('Register member.');
            this.onRegisterMember();
          }
        },
      );
    }

    buttons.push(
      {
        text: this.translateUtil.translateKey('SAVE'),
        handler: () => {
          console.log('To submit form.');
          this.onSave();
        }
      },
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
