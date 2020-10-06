import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, NavController} from "@ionic/angular";
import {AppSession} from "../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {AppConstants} from "../../../services/app-constants.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {Provider} from "../../../models/Provider";
import {ProviderMemberWithDetails} from "../../../models/ProviderMemberWithDetails";
import {SearchUserRequest} from "../../../models/transfer/SearchUserRequest";
import {GeneralPaginationResponse} from "../../../models/transfer/GeneralPaginationResponse";
import {DateTimeUtils} from "../../../services/date-time-utils.service";
import {Utils} from '../../../services/utils.service';

@Component({
  selector: 'app-provider-members',
  templateUrl: './provider-members.page.html',
  styleUrls: ['./provider-members.page.scss'],
})
export class ProviderMembersPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  public showSearchBar:boolean = false;
  public keyIndex:number = 0;
  public searchKey:string = null;

  private actionSheet:any;

  providerId:number = null;
  provider:Provider = null;
  members:ProviderMemberWithDetails[] = null;
  callback:any = null;
  disableModifyButtons:boolean = true;
  reqObj:SearchUserRequest = null;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public alertCtrl: AlertController, public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, private dateTimeUtils:DateTimeUtils, public utils:Utils,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.members = [];

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.searchKey = null;
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
    this.members = [];
    this.reqObj = new SearchUserRequest();

    this.providersService.s_getMembersForProviderId(this.providerId, this.reqObj, (pageResponse:GeneralPaginationResponse) => {
      if(!pageResponse){
        this.reqObj.noMoreResult = true;
        return;
      }
      let results:ProviderMemberWithDetails[] = pageResponse.pageResults;

      if(results && results.length>0){
        this.members = this.members.concat(results);

        this.reqObj.start = pageResponse.start + results.length;
        // this.sortMembersByUserName();
      }else{
        this.reqObj.noMoreResult = true;
        return;
      }
    });
  }

  // sortMembersByUserName(){
  //   if(!this.members){
  //     return;
  //   }
  //   console.log("Good sortCourseByTime.");
  //   this.members.sort((t1,t2) => {
  //     if(t1.userName<t2.userName){
  //       return 1;
  //     }else{
  //       return -1;
  //     }
  //   })
  // }


  toggleSearchBar(){
    this.showSearchBar = !this.showSearchBar;
    this.focusButton();
    // this.checkSearchBarTimeout();
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
    if(!this.members){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;

      for(let member of this.members) {
        if((member.userName && member.userName.toLowerCase().indexOf(val.toLowerCase()) > -1)){
          member.hide = false;
        }else{
          member.hide = true;
        }
      }
    }else{
      this.searchKey = null;
      for(let member of this.members) {
        member.hide = false;
      }
    }

    // this.checkSearchBarTimeout();
  }

  doInfinite(infiniteScroll) {
    if(this.reqObj.noMoreResult){
      infiniteScroll.complete();
      return;
    }

    // get pagination comments;
    // this.updatePageContent(false);

    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }

  onViewDetails(event, memberId){
    console.log("Good onViewDetails, entityId: " + memberId);
    // provider-member-edit
    let navigationExtras: NavigationExtras = {
      state: {
        memberId:memberId, providerId:this.providerId
      }
    };
    this.router.navigate(['provider-member-details', this.providerId+"_"+memberId], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  l_getYesNo(value:boolean){
    if(value){
      return this.translateUtil.translateKey("YES");
    }else{
      return this.translateUtil.translateKey("NO");
    }
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

  onAddMember(){
    let newMember = new ProviderMemberWithDetails();
    newMember.providerId = this.providerId;
    newMember.userId = null;
    newMember.startDate = this.dateTimeUtils.getCurrentLocalTime();
    newMember.activated = true;
    newMember.providerMemberTypeId = null;

    // provider-member-edit
    let navigationExtras: NavigationExtras = {
      state: {
        member:newMember, providerId:this.providerId
      }
    };
    this.router.navigate(['provider-member-edit', this.utils.getTime()], navigationExtras);
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
          this.onAddMember();
        },
      }
    );
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

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
