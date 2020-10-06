
import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet,
  NavController,
} from '@ionic/angular';
import {TranslateUtil} from "../../../services/translate-util.service";
import {AppConstants} from "../../../services/app-constants.service";
import {Utils} from "../../../services/utils.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {ActivatedRoute, Router} from '@angular/router';
import {AppSession} from "../../../services/app-session.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {Provider} from '../../../models/Provider';
import {CodeTableService} from "../../../services/code-table-service.service";

@Component({
  selector: 'app-available-schools',
  templateUrl: './available-schools.page.html',
  styleUrls: ['./available-schools.page.scss'],
})

export class AvailableSchoolsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private actionSheet:any;

  public userId:number;
  public providers:Provider[];

  private keyIndex:number = 0;
  public showSearchBar:boolean = false;
  public searchKey:string = null;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providersService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController,
              private actionsheetCtrl:ActionSheetController, private codeTableService:CodeTableService,
              private alertCtrl:AlertController,
              private ionRouterOutlet:IonRouterOutlet,) {
    super(appSession, router, appConstants);
    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {

      }
    });
  }

  ngOnInit() {
    console.log("Good ngOnInit().");
  }

  ionViewWillEnter() {
    console.log("Good ionViewWillEnter().");
    this.searchKey = null;

    this.updatePageContent(true);
  }

  ionViewDidEnter(){
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(refresh:boolean){
    this.providersService.s_getAllProviders(true, (providers:Provider[]) => {
      this.providers = providers;
    });
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

  getItems(ev: any) {
    if(!this.providers){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;
      let valStr = val.toLowerCase();
      let keys = valStr.split(/[\s,;]+/);
      for(let provider of this.providers){
        provider.hide = false;
        for(let key of keys){
          let foundKey = false;
          if(provider.name && provider.name.toLowerCase().indexOf(key)>=0){
            foundKey = true;
          }
          if(!foundKey){
            provider.hide = true;
            break;
          }
        }
      }
    }else{
      this.searchKey = null;
      for(let provider of this.providers){
        provider.hide = false;
      }
    }
    this.onScrollUp();
    // this.checkSearchBarTimeout();
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

  onViewDetails(provider:Provider){
    console.log("Good onViewDetails.");
    if(!provider){
      return;
    }
    console.log("Good onViewDetails, provider: " + provider.id);
    this.router.navigate(['available-mountains','availabilities', provider.id, -1, -1]);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

}
