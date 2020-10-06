import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AppSession} from '../../../services/app-session.service';
import {Mountain} from '../../../models/Mountain';
import {IonContent, NavController,} from '@ionic/angular';
import {ProvidersService} from '../../../services/providers-service.service';
import {Utils} from '../../../services/utils.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {NavigationExtras, Router} from '@angular/router';
import {AppConstants} from '../../../services/app-constants.service';
import {ToastUtil} from "../../../services/toast-util.service";
import {ConfigureForClient} from "../../../models/transfer/ConfigureForClient";
import {DomSanitizer} from "@angular/platform-browser";
import {SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-available-mountains',
  templateUrl: './available-mountains.page.html',
  styleUrls: ['./available-mountains.page.scss'],

  encapsulation: ViewEncapsulation.None,
})
export class AvailableMountainsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private actionSheet:any;

  public showSearchBar:boolean = false;
  public keyIndex:number = 0;
  public mountains:Mountain[];

  public searchKey:string = null;
  public searchKeys:string[] = null;

  public searchTagKey:string;
  public searchTagKeys:string[] = null;

  public banner:SafeHtml;

  constructor(public providersService:ProvidersService, public translateUtil:TranslateUtil, public utils:Utils,
              public appSession:AppSession, private router: Router, private navCtrl: NavController, public appConstants:AppConstants,
              public toastUtil:ToastUtil, private sanitizer: DomSanitizer) {
    this.appSession.getClientConfigure((clientConf:ConfigureForClient) => {
      if (!clientConf) {
        this.toastUtil.showToast("Using default values for client!");
        return;
      }else{
        this.banner = sanitizer.bypassSecurityTrustHtml(clientConf.bannerContent) ;
      }
      console.log("banner content: " + this.appSession.clientConfigure.bannerContent);
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.searchKey = null;
    this.updatePageContent();
  }

  updatePageContent(){
    this.providersService.s_getMountainsWithSchool(false, (mountains:Mountain[]) => {
      this.mountains = mountains;
      this.sortMountains(this.mountains);
    });
  }

  sortMountains(mountains:Mountain[]){
    if(!mountains || mountains.length===0){
      return mountains;
    }
    mountains.sort((m1:Mountain,m2:Mountain) => {
      let count1:number = 0;
      let count2:number = 0;
      for(let school1 of m1.schoolCounts){
        if(school1.tripCount){
          count1 = count1 + school1.tripCount; //school.courseCount;
        }
      }
      for(let school2 of m2.schoolCounts){
        if(school2.tripCount){
          count2 = count2 +  + school2.tripCount; //school.courseCount;
        }
      }
      if(count1>count2){
        return -1;
      }else{
        return 1;
      }
    });
  }

  hasContent(mountain:Mountain){
    if(!mountain || !mountain.schoolCounts){
      return false;
    }
    let count = 0;
    for(let school of mountain.schoolCounts){
      if(school.tripCount){
        count = count + school.tripCount;
      }
      if(school.courseCount){
        count = count + school.courseCount ;
      }
    }
    if(count===0){
      return false;
    }
    return true;
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  onClickMountain(mountain:Mountain){
    console.log("Good onClickMountain.");
    if(!mountain || !mountain.id || !mountain.schoolCounts){
      return;
    }
    if(mountain.schoolCounts.length===1){
      if(mountain.schoolCounts[0].id>0){
        let schCount = mountain.schoolCounts[0];
        this.onViewSchoolDetails(schCount.id, mountain.id, schCount.tripHillId);
        return;
      }
    }
    if(mountain.schoolCounts.length>1){
      this.toastUtil.showToast("Please choose school in the list.");
    }
  }

  onViewSchoolDetails(providerId:number, mountainId:number, tripHillId:number){
    console.log("onViewDetails, providerId: " + providerId + ", mountainId: " + mountainId + ", tripHillId: " + tripHillId);
    this.router.navigate(['available-mountains','availabilities', providerId, mountainId, tripHillId]);
  }

  onShowComments(providerId:number){
    console.log("onShowComments, providerId: " + providerId);
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:providerId,
        entityTypeId:this.appConstants.COMMENT_TYPE_PROVIDER,
        entityId: providerId,
        title: this.translateUtil.translateKey("School reviews"),
        showRate:true,
      }
    };
    this.router.navigate(['comments'], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
        () => {
          this.content.scrollToTop(300);
        },
        100
    );
  }

  manageMountains(){
    console.log("Good manageMountains().");
    let navigationExtras: NavigationExtras = {
      state: {
      }
    };
    this.router.navigate(['mountains'], navigationExtras);
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

  onClearSearch(){
    this.getItems(null);
    this.showSearchBar = false;
  }

  onClearTagSearch(){
    this.getTagItems(null);
    this.showSearchBar = false;
  }

  getItems(ev: any) {
    if(!this.mountains){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;
      let valStr = val.toLowerCase();
      let keys = valStr.split(/[\s,;]+/);
      this.searchKeys = keys;

      for(let mountain of this.mountains) {
        for(let key of keys) {
          if (mountain.name && mountain.name.toLowerCase().indexOf(key.toLowerCase()) > -1) {
            mountain.hide = false;
            continue;
          }

          mountain.hide = true;
          for (let sCounts of mountain.schoolCounts) {
            if (sCounts.schoolName && sCounts.schoolName.toLowerCase().indexOf(key.toLowerCase()) > -1) {
              mountain.hide = false;
              break;
            }
          }
        }
      }
    }else{
      this.searchKey = null;
      this.searchKeys = null;
      for(let mountain of this.mountains) {
        mountain.hide = false;
      }
    }
    this.sortMountains(this.mountains);
    //this.checkSearchBarTimeout();;
  }

  getTagItems(ev: any) {
    if(!this.mountains){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchTagKey = val;
      let valStr = val.toLowerCase();
      let keys = valStr.split(/[\s,;]+/);
      this.searchTagKeys = keys;

      for(let mountain of this.mountains) {
        for(let key of keys) {
          mountain.hide = true;
          for (let sCounts of mountain.schoolCounts) {
            if(sCounts.tags && sCounts.tags.toString().toLowerCase().indexOf(key.toLowerCase())>=0){
              mountain.hide = false;
              break;
            }
          }
        }
      }
    }else{
      this.searchTagKey = null;
      this.searchTagKeys = null;
      for(let mountain of this.mountains) {
        mountain.hide = false;
      }
    }
    this.sortMountains(this.mountains);
    //this.checkSearchBarTimeout();;
  }
}
