import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, ModalController, NavController} from "@ionic/angular";
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ToastUtil} from "../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {AdminUser} from "../../../../models/AdminUser";

@Component({
  selector: 'app-administrator-details',
  templateUrl: './administrator-details.page.html',
  styleUrls: ['./administrator-details.page.scss'],
})
export class AdministratorDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  callback:any = null;
  adminUserId:number = null;
  adminUser:AdminUser = null;
  disableModifyButtons:boolean = true;

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil, public alertCtrl:AlertController,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private actionsheetCtrl:ActionSheetController, private navCtrl:NavController, public modalCtrl: ModalController,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.adminUserId = this.router.getCurrentNavigation().extras.state.adminUserId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(!this.adminUserId){
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
    this.providerService.s_getAdministratorDetailsById(this.appSession.l_getUserId(), this.adminUserId, (adminUser:AdminUser) => {
      this.adminUser = adminUser;
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

  onEdit() {
    let navigationExtras: NavigationExtras = {
      state: {
        adminUserId:this.adminUserId, providerId:this.adminUser.providerId
      }
    };
    this.router.navigate(['administrator-edit'], navigationExtras);
  }

  onDelete(){
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Delete administrator?'), null, null,
      this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('Delete'),
      (data) => {
        this.l_delete();
      });
  }

  l_delete(){
    this.providerService.s_deleteAdministrator(this.appSession.l_getUserId(), this.adminUserId, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Administrator deleted.");
      }
      this.onClose();
    });
  }

  onClose(){
    this.navCtrl.pop();
  }

  async openMenu() {
    let buttons:any = [];
    if(this.appSession.l_isSiteAdmin()){
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
    }
    buttons.push(
      {
        text: this.translateUtil.translateKey('Cancel'),
        handler: () => {
          console.log('Cancel clicked');
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
