import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  NavController,
} from '@ionic/angular';
import {BasicUserIdPage} from '../../BasicUserIdPage';
import {Provider} from '../../../models/Provider';
import {ProvidersService} from '../../../services/providers-service.service';
import {AppConstants} from '../../../services/app-constants.service';
import {ToastUtil} from '../../../services/toast-util.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {AppSession} from '../../../services/app-session.service';
import {Utils} from '../../../services/utils.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.page.html',
  styleUrls: ['./provider.page.scss'],
})
export class ProviderPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private actionSheet:any;

  providers:Provider[] = null;
  provider:Provider = null;
  getOption = null;  // Other option: "myProviders" or "allProviders";

  public showSearchBar:boolean = false;
  private keyIndex:number = 0;
  searchKey:string = null;

  constructor(public utils:Utils, private navCtrl: NavController,
              public alertCtrl: AlertController, appSession:AppSession,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              public appConstants:AppConstants, public providerService:ProvidersService,
              private actionsheetCtrl: ActionSheetController,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.params.subscribe(params => {
      console.log("ProviderPage.queryParameters.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.getOption = this.router.getCurrentNavigation().extras.state.getOption;
        console.log("ProviderPage getOption: " + this.getOption);
      }
    });
    this.providers = [];
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    console.log("Good ionViewWillEnter.");
    this.searchKey = null;
    this.updatePageContent();
  }

  ionViewDidEnter() {
    console.log("Good ionViewDidEnter.");
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent() {
    if(this.getOption && this.getOption==="allProviders"){
      this.providerService.s_getAllProviders(false, (providers:Provider[]) => {
        this.providers = providers;
      });
    }else if(this.appSession.l_getUserId()){
      // myProviders:
      this.providerService.s_getProvidersHasAccountOrCourseRegistrationForUserId(this.appSession.l_getUserId(), (providers:Provider[]) => {
        this.providers = providers;
      });
    }
  }

  toggleSearchBar(){
    this.showSearchBar = !this.showSearchBar;
    this.focusButton();
    //this.checkSearchBarTimeout();;
  }

  focusButton(){
    if(this.showSearchBar && this.search){
      setTimeout(() => {
        this.search.setFocus();
      }, 500);
    }
  }

  onClearSearch(){
    this.getItems(null);
    this.showSearchBar = false;
  }

  checkSearchBarTimeout(){
    this.keyIndex = this.keyIndex +1;
    setTimeout(
        (keyIndex) => {
          if(keyIndex===this.keyIndex){
            this.showSearchBar = false;
          }
        },
        this.appConstants.SEARCH_BAR_SHOW_DELAY,
        this.keyIndex
    );
  }

  getItems(ev: any) {
    if(!this.providers){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;

      for(let providerParam of this.providers) {
        if(providerParam.name && providerParam.name.toLowerCase().indexOf(val.toLowerCase()) > -1){
          providerParam.hide = false;
        }else{
          providerParam.hide = true;
        }
      }
    }else{
      this.searchKey = null;
      for(let providerParam of this.providers) {
        providerParam.hide = false;
      }
    }

    //this.checkSearchBarTimeout();;
  }

  onViewDetails(providerId){
    if(!this.appSession.l_getUserId()){
      return;
    }
    console.log("Good onViewDetails.");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: providerId,
      }
    };
    this.router.navigate(['provider-home', providerId], navigationExtras);
  }

  onClose(){
    this.navCtrl.pop();
  }

  doInfinite(infiniteScroll) {

  }

  onAddProvider(){
    console.log("Good onAddProvider().");
    let newProvider = new Provider();
    newProvider.ownerUserId = this.appSession.l_getUserId();
    let navigationExtras: NavigationExtras = {
      state: {
        provider:newProvider
      }
    };
    this.router.navigate(['provider-edit'], navigationExtras);
  }

  async openMenu() {
    let buttons = [];

    if(this.appSession.l_isSiteAdmin()){
      buttons.push(
          {
            text: this.translateUtil.translateKey('ADD'),
            handler: () => {
              console.log('Add clicked');
              this.onAddProvider();
            }
          }
      );
    }

    buttons.push(
        {
          text: this.translateUtil.translateKey('CLOSE'),
          handler: () => {
            console.log('CLOSE clicked');
            this.onClose();
          }
        },
    );

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons,
    });
    this.actionSheet.present();
  }
}
