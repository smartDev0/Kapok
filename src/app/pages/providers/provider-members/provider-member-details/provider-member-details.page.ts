import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../../BasicUserIdPage';
import {ActionSheetController, AlertController, IonContent, NavController} from '@ionic/angular';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {ProviderMemberWithDetails} from '../../../../models/ProviderMemberWithDetails';
import {AppSession} from '../../../../services/app-session.service';
import {ProvidersService} from '../../../../services/providers-service.service';
import {Utils} from '../../../../services/utils.service';
import {AppConstants} from '../../../../services/app-constants.service';
import {TranslateUtil} from '../../../../services/translate-util.service';
import {ToastUtil} from '../../../../services/toast-util.service';

@Component({
  selector: 'app-provider-member-details',
  templateUrl: './provider-member-details.page.html',
  styleUrls: ['./provider-member-details.page.scss'],
})
export class ProviderMemberDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  providerId:number = null;
  memberId:number = null;
  member:ProviderMemberWithDetails = null;
  disableModifyButtons:boolean = true;

  constructor(private navCtrl: NavController, appSession:AppSession,
              private providerService:ProvidersService, public utils:Utils,
              public appConstants:AppConstants, private alertCtrl:AlertController,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actCtrl: ActionSheetController,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.memberId = this.router.getCurrentNavigation().extras.state.memberId;
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
    this.providerService.s_getMemberDetailsForMemberId(this.memberId, (member:ProviderMemberWithDetails) => {
      this.member = member;
    });
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

  presentPopover(myEvent) {
    // let popover = this.popoverCtrl.create(PopoverMemberDetailsPage, {});
    // popover.present({
    //   ev: myEvent
    // });
    //
    // popover.onDidDismiss((selection) => {
    //   console.log("Got back selection: " + selection);
    //   this.openPage(selection);
    // });
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
      return this.translateUtil.translateKey('YES');
    }else{
      return this.translateUtil.translateKey('NO');
    }
  }

  openPage(selection:string) {

  }

  onEdit() {
    // provider-member-edit
    let navigationExtras: NavigationExtras = {
      state: {
        memberId: this.memberId, providerId:this.providerId
      }
    };
    this.router.navigate(['provider-member-edit', this.providerId+"_"+this.memberId], navigationExtras);
  }

  onDelete(){
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Delete member?'), null, null,
        this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('Delete'),
        (data) => {
          this.l_delete();
    });
  }

  l_delete(){
    this.providerService.s_deleteMember(this.appSession.l_getUserId(), this.memberId, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Member deleted.");
      }
      this.onClose();
    });
  }


  onClose(){
    this.navCtrl.pop();
  }

  async openMenu() {
    let buttons:any = [];
    if(this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin()){
      buttons.push(
          {
            text: this.translateUtil.translateKey('Edit'),
            handler: () => {
              console.log('Edit clicked');
              this.onEdit();
            },
          },
          {
            text: this.translateUtil.translateKey('Delete'),
            handler: () => {
              console.log("Delete clicked!");
              this.onDelete();
            }
          },
      );
    }else{
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
    }

    this.actionSheet = await this.actCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
