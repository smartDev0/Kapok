import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, IonContent, NavController} from "@ionic/angular";
import {Utils} from "../../../services/utils.service";
import {AppSession} from "../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {AppConstants} from "../../../services/app-constants.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {ProviderCourseTypeWithDetails} from "../../../models/ProviderCourseTypeWithDetails";

@Component({
  selector: 'app-provider-course-type',
  templateUrl: './provider-course-type.page.html',
  styleUrls: ['./provider-course-type.page.scss'],
})
export class ProviderCourseTypePage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  providerId:number;
  providerCourseTypes:ProviderCourseTypeWithDetails[]=[];
  callback:any;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils,) {
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
    this.providersService.s_getProviderCourseTypesByProviderId(this.providerId, false, (pcTypes:ProviderCourseTypeWithDetails[]) => {
      this.providerCourseTypes = pcTypes;
    });
  }

  onViewDetails(pCourseType:ProviderCourseTypeWithDetails){
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, providerCourseType:pCourseType
      }
    };
    this.router.navigate(['provider-course-type-details'], navigationExtras);
  }

  onAddPCType(){
    console.log("Good onAddPCType().");
    let pcType = new ProviderCourseTypeWithDetails();
    pcType.providerId = this.providerId;
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, providerCourseType:pcType
      }
    };
    this.router.navigate(['provider-course-type-details'], navigationExtras);
  }

  l_close(){
    this.navCtrl.pop();
  }

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('Close'),
          handler: () => {
            console.log('To submit form.');
            this.l_close();
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
