import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../services/user-service.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {AppConstants} from "../../../services/app-constants.service";
import {IonContent, IonRouterOutlet, NavController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {Consent} from "../../../models/Consent";
import {AppSession} from "../../../services/app-session.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {ToastUtil} from "../../../services/toast-util.service";

@Component({
  selector: 'app-consent-view',
  templateUrl: './consent-view.page.html',
  styleUrls: ['./consent-view.page.scss'],
})
export class ConsentViewPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  providerId:number = null;
  consent:Consent = null;

  constructor(public appSession:AppSession, public navCtrl: NavController, private userService: UserService, public translateUtil: TranslateUtil,
              private ionRouterOutlet: IonRouterOutlet, private route: ActivatedRoute, public router: Router, public appConstants: AppConstants,
              private providerService:ProvidersService, private toastUtil:ToastUtil,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(false);

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
      }
    });
  }

  ngOnInit() {
    if(!this.providerId){
      this.providerId = parseInt(this.route.snapshot.paramMap.get('providerId'));
    }
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

  onClose() {
    if (this.ionRouterOutlet.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }
}
