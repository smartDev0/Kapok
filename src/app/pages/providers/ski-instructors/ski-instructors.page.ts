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
import {InstructorWithDetails} from "../../../models/InstructorWithDetails";
import {CallbackValuesService} from "../../../services/callback-values.service";
import {CallbackValue} from "../../../models/transfer/CallbackValue";
import {Provider} from '../../../models/Provider';

@Component({
  selector: 'app-ski-instructors',
  templateUrl: './ski-instructors.page.html',
  styleUrls: ['./ski-instructors.page.scss'],
})
export class SkiInstructorsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private actionSheet:any;

  public showSearchBar:boolean = false;
  public keyIndex:number = 0;
  public searchKey:string = null;

  private toWaitScroll:boolean = false;

  providerId:number = null;
  provider:Provider = null;
  instructors:InstructorWithDetails[] = null;
  disableModifyButtons:boolean = true;
  providerCourseTypeId:number = null;
  fromCommand:number;
  forChoose:boolean;
  activatedOnly:boolean = false;
  CALLBACK_HOOKED_COMPONENT:string = null;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, private callbackValues:CallbackValuesService,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.providerCourseTypeId = this.router.getCurrentNavigation().extras.state.providerCourseTypeId;

        this.fromCommand = this.router.getCurrentNavigation().extras.state.press;
        if(!this.fromCommand){
          this.fromCommand = this.router.getCurrentNavigation().extras.state.fromCommand;
        }
        this.CALLBACK_HOOKED_COMPONENT = this.router.getCurrentNavigation().extras.state.CALLBACK_HOOKED_COMPONENT;
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
    this.providersService.s_getProviderById(this.providerId, (provider:Provider) => {
      this.provider = provider;
    });

    if(this.fromCommand && this.fromCommand===this.appConstants.PAGE_FOR_CHOOSE){
      this.forChoose = true;
      this.activatedOnly = true;
    }else{
      this.forChoose = false;
      this.activatedOnly = false;
    }
    this.updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    this.providersService.s_getAllProviderInstructorWithDetailsForProvider(this.providerId, this.activatedOnly, (instructors:InstructorWithDetails[]) => {
      this.instructors = instructors;
      this.sortInstructorsByName();
    });
  }

  sortInstructorsByName(){
    if(!this.instructors){
      return;
    }
    console.log("Good sortCourseByTime.");
    this.instructors.sort((t1,t2) => {
      if(t1.name>t2.name){
        return 1;
      }else{
        return -1;
      }
    });
  }

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
    if(!this.instructors){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;

      for(let instructor of this.instructors) {
        if((instructor.name && instructor.name.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (instructor.userName && instructor.userName.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (instructor.email && instructor.email.toLowerCase().indexOf(val.toLowerCase()) > -1)){
          instructor.hide = false;
        }else{
          instructor.hide = true;
        }
      }
    }else{
      this.searchKey = null;
      for(let instructor of this.instructors) {
        instructor.hide = false;
      }
    }

    // this.checkSearchBarTimeout();
  }

  onChooseInstructor(instructor:InstructorWithDetails){
    console.log("This callback should be passed back by CallbackValueService.");
    if(this.CALLBACK_HOOKED_COMPONENT){
      let values:any[] = [];
      values['instructor'] = instructor;
      let callbackValue = new CallbackValue(this.CALLBACK_HOOKED_COMPONENT, values);
      this.callbackValues.callbackDataSubject.next(callbackValue);
    }
    this.onClose();
  }

  onViewDetails(instructorId){
    console.log("Good onViewDetails, instructorId: " + instructorId);
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: this.providerId, instructorId: instructorId
      }
    };
    this.router.navigate(['ski-instructor-details'], navigationExtras);
  }

  onAdd(){
    console.log("Good onAdd.");
    let instructor = new InstructorWithDetails();
    instructor.providerId = this.providerId;
    instructor.activated = true;
    let navigationExtras: NavigationExtras = {
      state: {
        instructor:instructor,
        providerId:this.providerId,
      }
    };
    this.router.navigate(['ski-instructor-edit'], navigationExtras);
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
