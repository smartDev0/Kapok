import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, AlertController, IonContent, NavController} from "@ionic/angular";
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ProvidersService} from "../../../services/providers-service.service";
import {AppConstants} from "../../../services/app-constants.service";
import {AppSession} from "../../../services/app-session.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ProviderMemberTypeWithDetails} from "../../../models/MembershipTypeWithDetails";

@Component({
  selector: 'app-membership-types',
  templateUrl: './membership-types.page.html',
  styleUrls: ['./membership-types.page.scss'],
})
export class MembershipTypesPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  providerId:number;
  memberships:ProviderMemberTypeWithDetails[];
  callback:any;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public alertCtrl: AlertController, public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController,) {
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
    this.providersService.s_getMembershipTypesForProviderId(this.providerId, false, (memberships:ProviderMemberTypeWithDetails[]) => {
      this.memberships = memberships;
    });
  }

  onViewDetails(providerMemberTypeId){
    console.log("Good onViewDetails, providerMemberTypeId: " + providerMemberTypeId);
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: this.providerId, membershipTypeId: providerMemberTypeId
      }
    };
    this.router.navigate(['membership-type-details'], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  onClose(){
    this.navCtrl.pop();
  }

  onAdd(){
    console.log("Good onAdd().");
    let membershipType = new ProviderMemberTypeWithDetails();
    membershipType.providerId = this.providerId;

    let navigationExtras: NavigationExtras = {
      state: {
        providerId: this.providerId, membershipType: membershipType,
      }
    };
    this.router.navigate(['membership-type-edit'], navigationExtras);
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Add'),
        handler: () => {
          console.log('Add clicked');
          this.onAdd();
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
