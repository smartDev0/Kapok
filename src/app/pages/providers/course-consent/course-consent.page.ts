import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../BasicUserIdPage';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet,
  LoadingController,
  NavController,
  PopoverController
} from '@ionic/angular';
import {AppSession} from '../../../services/app-session.service';
import {AppConstants} from '../../../services/app-constants.service';
import {ToastUtil} from '../../../services/toast-util.service';
import {ProvidersService} from '../../../services/providers-service.service';
import {Utils} from '../../../services/utils.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {ImageService} from '../../../services/image-service.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {CodeTableService} from '../../../services/code-table-service.service';
import {Consent} from '../../../models/Consent';

@Component({
  selector: 'app-course-consent',
  templateUrl: './course-consent.page.html',
  styleUrls: ['./course-consent.page.scss'],
})
export class CourseConsentPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  providerId:number = null;
  consent:Consent = null;

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil, public alertCtrl:AlertController,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil, private imageService:ImageService,
              private actionsheetCtrl:ActionSheetController, private navCtrl:NavController, private popCtrl:PopoverController,
              private route: ActivatedRoute, public router:Router, public loadingCtrl: LoadingController, private codeTableService:CodeTableService,
              private ionRouterOutlet:IonRouterOutlet,) {
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
      this.toastUtil.showToastTranslate("Can not find provider!");
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
    if(!this.providerId){
      return null;
    }

    this.providerService.s_getProvideConsent(this.providerId, (consent:Consent) => {
      this.consent = consent;
      if(!this.consent){
        this.consent = new Consent();
        this.consent.providerId = this.providerId;
      }
    });
  }

  onViewConsent(){
    console.log("Good onViewConsent().");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: this.providerId,
      }
    };
    this.router.navigate(['consent-view'], navigationExtras);
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  private onSave(){
    console.log("Good onSave(). consent: " + this.consent.consent);
    this.providerService.s_saveProviderConsent(this.providerId, this.consent, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Consent saved.");
      }
      this.onClose();
    });
  }

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            console.log('To submit form.');
            this.onSave();
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
