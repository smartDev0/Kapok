import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, ModalController, NavController} from "@ionic/angular";
import {CodeTableService} from "../../../../services/code-table-service.service";
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {DateTimeUtils} from "../../../../services/date-time-utils.service";
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AppConstants} from "../../../../services/app-constants.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {ProviderMemberWithDetails} from "../../../../models/ProviderMemberWithDetails";
import {ProviderMemberTypeWithDetails} from "../../../../models/MembershipTypeWithDetails";
import {NgForm} from "@angular/forms";
import {UserInfo} from "../../../../models/UserInfo";
import * as moment from 'moment';
import {GeneralResponse} from "../../../../models/transfer/GeneralResponse";
import {MembershipPaymentService} from "../../../../services/membershipPayment/membership-payment.service";
import {SearchUserComponent} from "../../search-user/search-user.component";

@Component({
  selector: 'app-provider-member-edit',
  templateUrl: './provider-member-edit.page.html',
  styleUrls: ['./provider-member-edit.page.scss'],

  providers: [
    MembershipPaymentService,
  ],
})
export class ProviderMemberEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  providerId:number;
  memberId:number;
  member:ProviderMemberWithDetails;
  memberTypeId:number;
  submitted:boolean;
  startTime:any;
  expireTime:any;
  currentDateTime:string;
  providerMemberTypes:ProviderMemberTypeWithDetails[];
  confirmedLeave:boolean;

  constructor(public appSession:AppSession, public providerService:ProvidersService, public appConstants:AppConstants,
              public alertCtrl: AlertController, public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, private utils:Utils, private codeTableService:CodeTableService,
              private dateTimeUtils:DateTimeUtils, public memberPaymentService:MembershipPaymentService,
              private modalController:ModalController, ) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.member = this.router.getCurrentNavigation().extras.state.member;
        this.memberId = this.router.getCurrentNavigation().extras.state.memberId;
      }
    });

    this.currentDateTime = this.dateTimeUtils.getCurrentLocalTime();
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    // For creating event;
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    if(!this.member){
      this.l_updateMemberById();
    }else{
      this.memberId = this.member.id;
      this.memberTypeId = this.member.providerMemberTypeId;
      this.startTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.member.startDate);
      this.expireTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.member.expireDate);
    }

    this.providerService.s_getMembershipTypesForProviderId(this.providerId, true, (providerMemberTypes:ProviderMemberTypeWithDetails[]) => {
      this.providerMemberTypes = providerMemberTypes;
    });
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

  l_updateMemberById(){
    this.providerService.s_getMemberDetailsForMemberId(this.memberId, (member:ProviderMemberWithDetails) => {
      this.member = member;
      this.memberId = this.member?this.member.id:null;
      if(this.member){
        this.memberTypeId = this.member.providerMemberTypeId;
        this.startTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.member.startDate);
        this.expireTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.member.expireDate);
      }
      if(this.formRef){
        this.formRef.reset();
      }
    });
  }

  async onSearchUser(){
    console.log("Good onSearchUser().");
    const modal = await this.modalController.create({
      component: SearchUserComponent,
      componentProps: { }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if(data){
      let selectedUser:UserInfo = data;
      if(selectedUser){
        console.log("selectedUser.id: " + selectedUser.id);
        this.member.userId = selectedUser.id;
        this.member.userName = selectedUser.userName;
      }
    }
  }

  deleteTime(fieldName){
    this.member[fieldName] = null;
  }

  saveMember(formRef:NgForm) {
    console.log("save called good.");
    this.submitted = true;

    if(!this.member.userId){
      this.toastUtil.showToastTranslate("Please search user for creating member.");
      return;
    }

    if(!this.providerId){
      this.toastUtil.showToastTranslate("current providerId is empty!");
      return;
    }else{
      this.member.providerId = this.providerId;
    }

    if(this.startTime && this.expireTime && (moment(this.startTime).isAfter(moment(this.expireTime)))){
      this.toastUtil.showToastTranslate("Start Time can not be after Expire Time.");
      return;
    }

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
    }else{
      this.member.startDate = this.utils.changeTimeZoneFromISOToLocalForServer(this.startTime);
      this.member.expireDate = this.utils.changeTimeZoneFromISOToLocalForServer(this.expireTime);

      if(this.memberTypeId && this.member.providerMemberTypeId && this.memberTypeId!==this.member.providerMemberTypeId){
        // actually changing membership type; let it to be new (without id), and then save it;
        this.member.paymentStatusId = this.appConstants.PAYMENT_UNPAID_ID;
        this.member.paymentStatusName = "Unpaid";
      }
      this.member.providerMemberTypeId = this.memberTypeId;
      this.member.providerMemberTypeName = null;

      // if new membership and not paid, create invoice and do the payment;
      this.memberPaymentService.s_createUpdateMembership(this.appSession.l_getUserId(), this.member, (genResponse:GeneralResponse) => {
        this.confirmedLeave = true;

        if(!genResponse){
          this.l_close();
          return;
        }
        if(genResponse.message){
          this.toastUtil.showToast(genResponse.message);
        }

        let invoice = genResponse.resultObject;
        if(genResponse.code===0 && invoice && invoice.id){
          let navigationExtras: NavigationExtras = {
            state: {
              invoiceId: invoice.id, providerId:this.providerId
            }
          };
          this.router.navigate(['membership-payment-details'], navigationExtras);
        }else{
          this.l_close();
        }
      });
    }
  }

  onCancelPage(){
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null, this.translateUtil.translateKey('CANCEL'),
        null, this.translateUtil.translateKey('DISCARD'),
        (data) => {
          this.confirmedLeave = true;
          this.navCtrl.pop();
        });
    }else{
      this.navCtrl.pop();
    }
  }

  // onCancel() {
  //   if(this.callback){
  //     this.callback();
  //   }
  //   this.l_close();
  // }

  l_reset(){
    if(!this.member.id || this.member.id<=0){
      this.member = new ProviderMemberWithDetails();
    }else{
      this.l_updateMemberById();
    }
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

  isMemberOwner(){
    if(this.member.userId && this.member.userId===this.appSession.l_getUserId()){
      return true;
    }
    return false;
  }

  onSave(){
    if(!this.formRef){
      console.log("Can not find formRef!");
    }else{
      this.formRef.ngSubmit.emit("ngSubmit");
      console.log('Save clicked finished.');
    }
  }

  async openMenu() {
    let buttonList = [];
    if(this.isMemberOwner() || this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin()){
      buttonList.push(
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            console.log('To submit form.');
            this.onSave();
          }
        });
    }

    this.actionSheet = await this.actCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttonList,
    });
    this.actionSheet.present();
  }
}
