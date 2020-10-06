import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent, ModalController,
  NavController,
} from "@ionic/angular";
import {Utils} from "../../../services/utils.service";
import {AppSession} from "../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AppConstants} from "../../../services/app-constants.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {AdminUser} from "../../../models/AdminUser";

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.page.html',
  styleUrls: ['./administrators.page.scss'],
})
export class AdministratorsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  providerId:number = null;
  adminUsers:AdminUser[];

  disableModifyButtons:boolean = true;

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil, public alertCtrl:AlertController,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private actionsheetCtrl:ActionSheetController, private navCtrl:NavController, public modalCtrl: ModalController,
              private route: ActivatedRoute, public router:Router, ) {
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
    this.providerService.s_getAdministratorsByProviderId(this.appSession.l_getUserId(), this.providerId, (adminUsers:AdminUser[]) => {
      this.adminUsers = adminUsers;
    });
  }

  onViewDetails(event, adminUserId){
    console.log("onViewDetails: adminUserId: " +adminUserId);
    let navigationExtras: NavigationExtras = {
      state: {
        adminUserId: adminUserId, providerId:this.providerId
      }
    };
    this.router.navigate(['administrator-details'], navigationExtras);
  }

  onAdd(){
    console.log("Good onAdd.");
    let navigationExtras: NavigationExtras = {
      state: {
        adminUserId:null, providerId: this.providerId
      }
    };
    this.router.navigate(['administrator-edit'], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  openPage(selection:string) {
    // let options = {enableBackdropDismiss: false};
    switch(selection){
      case "events": {

        break;
      }
      default: {
        console.log("Unknown selection: " + selection);
        break;
      }
    }
  }

  onClose(){
    this.navCtrl.pop();
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
