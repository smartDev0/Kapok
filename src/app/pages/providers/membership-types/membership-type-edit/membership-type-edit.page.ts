import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, NavController} from "@ionic/angular";
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {NgForm} from "@angular/forms";
import {ProviderMemberTypeWithDetails} from "../../../../models/MembershipTypeWithDetails";
import {MemberType} from "../../../../models/code/MemberType";
import {CodeTableService} from "../../../../services/code-table-service.service";
import {DateTimeUtils} from "../../../../services/date-time-utils.service";

@Component({
  selector: 'app-membership-type-edit',
  templateUrl: './membership-type-edit.page.html',
  styleUrls: ['./membership-type-edit.page.scss'],
})
export class MembershipTypeEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  @ViewChild("formRef") formRef:NgForm;
  submitted:boolean = false;
  providerId:number = null;
  membershipTypeId:number = null;
  membershipType:ProviderMemberTypeWithDetails = null;
  callback:any = null;
  memberTypes:MemberType[] = null;
  expiredInMonthsError = null;
  expiredInDaysError = null;
  currentDateTime:string;
  confirmedLeave:boolean;

  constructor(public appSession:AppSession, public providerService:ProvidersService, public appConstants:AppConstants,
              public alertCtrl: AlertController, public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, private utils:Utils, private codeTableService:CodeTableService,
              private dateTimeUtils:DateTimeUtils,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.membershipTypeId = this.router.getCurrentNavigation().extras.state.membershipTypeId;
        this.membershipType = this.router.getCurrentNavigation().extras.state.membershipType;
      }
    });


    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    if(!this.appSession.l_isSiteAdmin() && !this.appSession.l_isAdministrator(this.providerId)){
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    this.codeTableService.getMemberType((memberTypes:MemberType[]) => {
      this.memberTypes = memberTypes;
    });

    this.currentDateTime = this.dateTimeUtils.getCurrentLocalTime();
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
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

  updatePageContent(){
    this.providerService.s_getProviderMembershipTypeDetails(this.membershipTypeId, (membershipType:ProviderMemberTypeWithDetails) => {
      this.membershipType = membershipType;
      if(this.membershipType){
        this.membershipType.expiredOnDayOfYear = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.membershipType.expiredOnDayOfYear);
      }
    });
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
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

  l_save(formRef:NgForm){
    console.log("save called good.");
    this.submitted = true;
    this.expiredInMonthsError = null;
    this.expiredInDaysError = null;

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
    }else{
      if(this.membershipType.expiredInMonths>1000){
        this.expiredInMonthsError = this.translateUtil.translateKey("Expire in months maximum 1000.");
        return;
      }
      if(this.membershipType.expiredInDays>1000){
        this.expiredInDaysError = this.translateUtil.translateKey("Expire in days maximum 1000.");
        return;
      }

      if(this.membershipType.expiredOnDayOfYear){
        this.membershipType.expiredOnDayOfYear = this.utils.changeTimeZoneFromISOToLocalForServer(this.membershipType.expiredOnDayOfYear);
      }

      this.providerService.s_saveProviderMemberType(this.appSession.l_getUserId(), this.membershipType, (result:boolean) => {
        this.confirmedLeave = true;
        if(this.callback){
          this.callback();
        }
        this.navCtrl.pop();
      });
    }
  }

  onSave(){
    console.log('To submit form.');
    if(!this.formRef){
      console.log("Can not find formRef!");
    }else{
      this.formRef.ngSubmit.emit("ngSubmit");
      console.log('Save clicked finished.');
    }
  }


  async openMenu() {
    let actionSheet = await this.actCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            this.onSave();
          }
        },
      ]
    });
    actionSheet.present();
  }
}
