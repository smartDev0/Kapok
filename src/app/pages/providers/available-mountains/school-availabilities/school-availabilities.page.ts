import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {AppSession} from "../../../../services/app-session.service";
import {ActionSheetController, IonContent} from "@ionic/angular";
import {Provider} from "../../../../models/Provider";
import {AppConstants} from "../../../../services/app-constants.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {Utils} from "../../../../services/utils.service";
import {Subscription} from "rxjs";
import {TranslateUtil} from "../../../../services/translate-util.service";

@Component({
  selector: 'app-school-availabilities',
  templateUrl: './school-availabilities.page.html',
  styleUrls: ['./school-availabilities.page.scss'],
})
export class SchoolAvailabilitiesPage extends BasicUserIdPage implements OnInit, OnDestroy{
  @ViewChild(IonContent) content: IonContent;
  private sub:Subscription;

  private actionSheet:any;
  // private toWaitScroll:boolean = false;

  providerId:number = null;
  provider:Provider = null;
  mountainId:number = null;
  tripHillId:number = null;
  callback:any = null;

  constructor(public appSession:AppSession, public appConstants:AppConstants, private providersService:ProvidersService,
              private toastUtil:ToastUtil, private route: ActivatedRoute, public utils:Utils,
              public translateUtil:TranslateUtil, public actionSheetController: ActionSheetController, router: Router) {
    super(appSession, router, appConstants);
    super.l_checkUserId(false);

    console.log("Good SchoolAvailabilitiesPage.constructor()");
  }

  ngOnInit() {
    console.log("Good SchoolAvailabilitiesPage.ngOnInit()");

    this.providerId = parseInt(this.route.snapshot.paramMap.get('providerId'));
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty provider!");
      return;
    }
    this.mountainId = parseInt(this.route.snapshot.paramMap.get('mountainId'));
    // if(!this.mountainId){
    //   this.toastUtil.showToastTranslate("Empty mountain!");
    //   return;
    // }
    this.tripHillId = parseInt(this.route.snapshot.paramMap.get('tripHillId'));
    // if(!this.tripHillId){
    //   this.toastUtil.showToastTranslate("Empty trip hill!");
    //   return;
    // }

    /**
     * Must do the checkProviderContext to initialize provderContext for following pages access!!
     */
    this.appSession.checkProviderContext(true, this.providerId, null, null);
  }

  ngOnDestroy(){
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  updatePageContent(){
    if(this.providerId){
      this.providersService.s_getProviderById(this.providerId, (provider:Provider) => {
        if(provider){
          this.utils.replaceIconUrl(provider);
        }
        this.provider = provider;
      });
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  ionViewWillEnter() {
    this.updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  onViewTripEvents(){
    console.log("Good onViewTripEvents().");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId,
        tripHillId:this.tripHillId,
      }
    };
    this.router.navigate(['trips', this.providerId, this.tripHillId], navigationExtras);
  }

  onViewAvailableTime(){
    console.log("Good onViewAvailableTime().");
    this.router.navigate(['dates', this.providerId, this.mountainId]);
  }

  onViewAvailablePrograms(){
    console.log("Good onViewAvailablePrograms().");
    // ski-courses
    let navigationExtras: NavigationExtras = {
      state: {
        fromCommand:this.appConstants.PAGE_FOR_AVAILABLE,
        providerId:this.providerId,
        mountainId:this.mountainId,
        courseTypeId: this.appConstants.CODE_COURSE_GROUP,
        privateOnly: false,
      }
    };
    this.router.navigate(['ski-courses', this.utils.getTime()], navigationExtras);
  }

  onViewInstructors(){
    console.log("Good onViewInstructors().");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, mountainId:this.mountainId
      }
    };
    this.router.navigate(['show-instructors', this.providerId+"_"+this.mountainId], navigationExtras);
  }

  onViewPackages(){
    console.log("Good onViewPackages().");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, mountainId:this.mountainId
      }
    };
    this.router.navigate(['show-provider-course-types', this.providerId+"_"+this.mountainId], navigationExtras);
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Home'),
        handler: () => {
          console.log('Home clicked.');
          this.router.navigate([this.appConstants.ROOT_PAGE]);
        },
      }
    );

    const actionSheet = await this.actionSheetController.create({
      // header: 'Actions',
      buttons: buttons,
    });
    await actionSheet.present();
  }
}
