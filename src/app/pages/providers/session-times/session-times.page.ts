import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionTime} from "../../../models/SessionTime";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AppSession} from "../../../services/app-session.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {
  ActionSheetController,
  AlertController, IonContent,
  IonRouterOutlet,
  LoadingController, ModalController, NavController,
} from "@ionic/angular";
import {ProvidersService} from "../../../services/providers-service.service";
import {Utils} from "../../../services/utils.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {AppConstants} from "../../../services/app-constants.service";
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {Provider} from "../../../models/Provider";
import {ProviderContext} from "../../../models/transfer/ProviderContext";
import * as moment from 'moment';
import {SessionsCalendarComponent} from "./sessions-calendar/sessions-calendar.component";

@Component({
  selector: 'app-session-times',
  templateUrl: './session-times.page.html',
  styleUrls: ['./session-times.page.scss'],
})
export class SessionTimesPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;
  private actionSheet:any;
  public loading:any = null;

  public readonly SORT_BY_NAME = 1;
  public readonly SORT_BY_TIME = 2;
  public readonly SORT_BY_INSTRUCTOR_NAME = 3;

  private keyIndex:number = 0;
  public showSearchBar:boolean = false;
  public searchKey:string = null;

  sessionTimes:SessionTime[] = null;

  userId:number;
  providerId:number;
  fromCommand:number;
  instructorId:number;
  provider:Provider;
  futureOnly:boolean = true;

  sortOption:number = this.SORT_BY_NAME;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providersService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController,
              private actionsheetCtrl:ActionSheetController, private modalCtrl:ModalController,
              private alertCtrl:AlertController,
              private ionRouterOutlet:IonRouterOutlet, private loadingCtrl:LoadingController,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);
    this.userId = appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.fromCommand = this.router.getCurrentNavigation().extras.state.fromCommand;
        this.instructorId = this.router.getCurrentNavigation().extras.state.instructorId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log("Good ionViewWillEnter().");
    this.searchKey = null;
    this.showLoading();
    this.l_preparePage();
  }

  ionViewDidEnter(){
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
    this.dismissLoading();
  }

  async showLoading(){
    console.log("showLoading called.");
    this.dismissLoading();

    if(!this.loading) {
      this.loading = await this.loadingCtrl.create({
        message: 'Loading, please wait...',
        spinner: 'crescent',
        // duration: 20000
      });
    }
    await this.loading.present();
  }

  dismissLoading(){
    console.log("dismissLoading called.");
    setTimeout(
      () => {
        if(this.loading){
          this.loading.dismiss();
        }
        this.loading = null;
      },
      500
    );
  }

  private l_preparePage(){
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.providersService.s_getProviderById(this.providerId, (provider:Provider) => {
        this.provider = provider;
      });

      this.appSession.checkProviderContext(false, this.providerId, (context:ProviderContext) => {
        if(this.userId>0){
          this.updatePageContent(true);
        }else{
          this.toastUtil.showToastTranslate("Please login first!");
          this.router.navigate([this.appConstants.ROOT_PAGE]);
          return;
        }
      });
    }

    if(!this.fromCommand){
      console.log("fromCommand is null!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    console.log("Good l_preparePage.");
    if((!this.appSession.l_getUserInfo())){
      this.router.navigate(['login']);
      return;
    }
  }

  updatePageContent(refresh:boolean){
    if(refresh){
      this.sessionTimes = [];
    }

    if(this.fromCommand===this.appConstants.PAGE_FOR_MEMBER){
      if(this.providerId>0 && this.userId>0){
        this.providersService.getLearningSessionsForUserId(this.providerId, this.userId, this.futureOnly, (sessionTimes:SessionTime[]) => {
          this.sessionTimes = sessionTimes;
          this.dismissLoading();
        });
      }
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_INSTRUCTOR){
      if(this.providerId>0 && this.instructorId>0){
        this.providersService.s_getSessionsForInstructorId(this.providerId, this.instructorId, this.futureOnly, (sessionTimes:SessionTime[]) => {
          this.sessionTimes = sessionTimes;
          this.dismissLoading();
        });
      }
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_PROVIDER){
      if(this.providerId>0){
        this.providersService.getAllSessionsForProviderId(this.providerId, this.futureOnly, (sessionTimes:SessionTime[]) => {
          this.sessionTimes = sessionTimes;
          this.dismissLoading();
        });
      }
    }
    else{
      console.log("Unknown fromCommand!");
      this.dismissLoading();
      return;
    }
  }

  showAllTitle(){
    if(this.fromCommand===this.appConstants.PAGE_FOR_PROVIDER){
      return "All ";
    }else{
      return "";
    }
  }

  showPast(){
    console.log("Good showPast().");
    this.futureOnly = false;
    this.updatePageContent(true);
  }

  showFuture(){
    console.log("Good showPast().");
    this.futureOnly = true;
    this.updatePageContent(true);
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

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  getItems(ev: any) {
    if(!this.sessionTimes){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;
      let valStr = val.toLowerCase();
      for(let sessionTime of this.sessionTimes){
        if(sessionTime.id && sessionTime.id.toString().toLowerCase().indexOf(valStr)>=0){
          sessionTime.hide = false;
        }else if(sessionTime.courseName && sessionTime.courseName.toLowerCase().indexOf(valStr)>=0){
          sessionTime.hide = false;
        }else if(sessionTime.name && sessionTime.name.toLowerCase().indexOf(valStr)>=0){
          sessionTime.hide = false;
        }else if(sessionTime.instructorName && sessionTime.instructorName.toLowerCase().indexOf(valStr)>=0){
          sessionTime.hide = false;
        }else if(sessionTime.tripHillName && sessionTime.tripHillName.toLowerCase().indexOf(valStr)>=0){
          sessionTime.hide = false;
        }else if(sessionTime.tripHillName && sessionTime.studentName.toLowerCase().indexOf(valStr)>=0){
          sessionTime.hide = false;
        }else if(sessionTime.tripHillName && sessionTime.studentEmail.toLowerCase().indexOf(valStr)>=0){
          sessionTime.hide = false;
        }else if(sessionTime.tripHillName && sessionTime.guestName.toLowerCase().indexOf(valStr)>=0){
          sessionTime.hide = false;
        }else if(sessionTime.tripHillName && sessionTime.guestEmail.toLowerCase().indexOf(valStr)>=0){
          sessionTime.hide = false;
        }else{
          sessionTime.hide = true;
        }
      }
    }else{
      this.searchKey = null;
      for(let sessionTime of this.sessionTimes){
        sessionTime.hide = false;
      }
    }
    this.onScrollUp();
  }

  onViewDetails(sessionTime:SessionTime){
    console.log("Good onViewDetails, sessionTime.id: " + sessionTime.id);
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId,
        sessionTime:sessionTime
      }
    };
    this.router.navigate(['session-time'], navigationExtras);
  }

  async onShowSessionTimesCalendar(){
    console.log("Good onShowSessionTimesCalendar.");
    if(!this.userId){
      this.utils.showOkAlert(this.alertCtrl, "Please login first.", "If you don't have an account yet, please register one.");
      return;
    }else{
      const modal = await this.modalCtrl.create({
        component: SessionsCalendarComponent,
        componentProps: {providerId: this.providerId, instructorId: this.instructorId},
      });
      await modal.present();
    }
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  goHome(){
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  sortSessionsByStartTime(){
    console.log("Good sortSessionsByStartTime.");
    if(!this.sessionTimes || this.sessionTimes.length===1){
      return;
    }
    this.sessionTimes.sort((t1,t2) => {
      if(!t1.startTime){
        return -1;
      }else if(t2.startTime){
        return 1;
      }else{
        let startT1 = moment(t1.startTime);
        let startT2 = moment(t2.startTime);
        if(startT1.isAfter(startT2)){
          return -1;
        }else{
          return 1;
        }
      }
    });
  }

  sortSessionsByInstructorName(){
    console.log("Good sortSessionsByInstructorName.");
    if(!this.sessionTimes || this.sessionTimes.length===1){
      return;
    }
    this.sessionTimes.sort((t1,t2) => {
      let nameT1 = (t1.instructorName?t1.instructorName.toLowerCase():"");
      let nameT2 = (t2.instructorName?t2.instructorName.toLowerCase():"");
      if(!nameT1 || nameT1>nameT2){
        return 1;
      }else{
        return -1;
      }
    });
  }

  sortSessionsByName(){
    console.log("Good sortSessionsByName.");
    if(!this.sessionTimes || this.sessionTimes.length===1){
      return;
    }
    this.sessionTimes.sort(function(a, b) {
      let nameA = a.name.toLowerCase(); // ignore upper and lowercase
      let nameB = b.name.toLowerCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
  }

  sortSessionTimes(){
    if(this.sortOption===this.SORT_BY_TIME){
      this.sortSessionsByStartTime();
    }else if(this.sortOption===this.SORT_BY_NAME){
      this.sortSessionsByName();
    }else if(this.sortOption===this.SORT_BY_INSTRUCTOR_NAME){
      this.sortSessionsByInstructorName();
    }else{
      console.log("Unknown sort option!");
    }
    this.onScrollUp();
  }

  async changeSortOption(){
    console.log("Good changeSortOption().");
    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Sort by'),
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: this.translateUtil.translateKey('Name'),
          value: this.SORT_BY_NAME,
          checked: false
        },
        {
          name: 'radio2',
          type: 'radio',
          label: this.translateUtil.translateKey('Time'),
          value: this.SORT_BY_TIME,
        },
        {
          name: 'radio3',
          type: 'radio',
          label: this.translateUtil.translateKey('Instructor'),
          value: this.SORT_BY_INSTRUCTOR_NAME,
        },
      ],
      buttons: [
        {
          text: this.translateUtil.translateKey('CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey('Sort'),
          handler: (data) => {
            console.log('Confirm Ok');
            console.log("Show clicked. data: " + data);
            this.sortOption = data;
            this.sortSessionTimes();
          }
        }
      ]
    });
    await alert.present();
  }

  async searchSessionTimesByUserDate(){
    console.log("Good searchSessionTimesByUserDate()");

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Search session for user email'),
      inputs: [
        {
          label: this.translateUtil.translateKey('Email'),
          name: "email",
          type: 'email',
          placeholder: 'email',
          value: null,
        },
      ],
      buttons: [
        {
          text: this.translateUtil.translateKey('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey('Search'),
          handler: (data) => {
            if(data && data.email){
              let email = data.email;
              this.searchSessionTimesForEmail(email);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  searchSessionTimesForEmail(email){
    this.providersService.searchSessionTimesForStudentEmail(this.providerId, email, true, (sessionTimes:SessionTime[]) => {
      if(sessionTimes){
        this.sessionTimes = sessionTimes;
      }
    });
  }

  async openMenu() {
    let buttons:any = [];
    if(this.appSession.l_isSiteAdmin() || this.appSession.l_isAdministrator(this.providerId)) {
      buttons.push(
        {
          text: this.translateUtil.translateKey('Search by email'),
          handler: () => {
            console.log('searchCoursesByUser clicked');
            this.searchSessionTimesByUserDate();
          },
        }
      );
    }
    buttons.push(
      {
        text: this.translateUtil.translateKey('Sort'),
        handler: () => {
          console.log('Sort clicked');
          this.changeSortOption();
        },
      }
    );
    // if(this.futureOnly){
    //   buttons.push(
    //     {
    //       text: this.translateUtil.translateKey('Show Past'),
    //       handler: () => {
    //         console.log('Show past clicked');
    //         this.showPast();
    //       },
    //     }
    //   );
    // }else{
    //   buttons.push(
    //     {
    //       text: this.translateUtil.translateKey('Show Past'),
    //       handler: () => {
    //         console.log('Show past clicked');
    //         this.showPast();
    //       },
    //     }
    //   );
    // }

    // buttons.push(
    //   {
    //     text: this.translateUtil.translateKey('View in calendar'),
    //     handler: () => {
    //       console.log('calendar clicked');
    //       this.onShowSessionTimesCalendar();
    //     },
    //   }
    // );

    buttons.push(
      {
        text: this.translateUtil.translateKey('Home'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('Home clicked');
          this.goHome();
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
