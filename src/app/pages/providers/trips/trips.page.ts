import {Component, OnInit, ViewChild} from '@angular/core';
import {AppSession} from '../../../services/app-session.service';
import {AppConstants} from '../../../services/app-constants.service';
import {ToastUtil} from '../../../services/toast-util.service';
import {Utils} from '../../../services/utils.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController, Platform,} from '@ionic/angular';
import {TripServiceService} from '../../../services/trip-service.service';
import {BasicUserIdPage} from '../../BasicUserIdPage';
import {Trip} from '../../../models/trip/Trip';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import * as moment from 'moment';
import {Provider} from '../../../models/Provider';
import {ProvidersService} from '../../../services/providers-service.service';
import {ProviderCourseTypeWithDetails} from '../../../models/ProviderCourseTypeWithDetails';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],

  providers: [
    SocialSharing,
  ],
})
export class TripsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  public readonly LESSONCMD_GROUP = "group";
  public readonly LESSONCMD_PRIVATE = "private";

  private userId:number;
  private actionSheet:any;
  private providerId;
  private tripHillId;
  public trips:Trip[];
  private futureOnly:boolean = true;
  public provider:Provider;
  public trip:Trip;
  public tripProviderCourseTypes:ProviderCourseTypeWithDetails[];

  public readonly SORT_BY_COURSE_NAME = 1;
  public readonly SORT_BY_COURSE_TIME = 2;
  sortOption:number = this.SORT_BY_COURSE_TIME;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              public utils:Utils, public translateUtil:TranslateUtil, private tripService:TripServiceService,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController,
              private actionsheetCtrl:ActionSheetController, public platform:Platform, private providerService:ProvidersService,
              private alertCtrl:AlertController, private socialSharing: SocialSharing,
              private ionRouterOutlet:IonRouterOutlet,) {
    super(appSession, router, appConstants);
    console.log("Good constructor().");

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.tripHillId = this.router.getCurrentNavigation().extras.state.tripHillId;
      }
    });
  }

  ngOnInit() {
    if(!this.providerId){
      this.providerId = parseInt(this.route.snapshot.paramMap.get('providerId'));
      this.tripHillId = parseInt(this.route.snapshot.paramMap.get('tripHillId'));
    }
  }

  ionViewWillEnter() {
    console.log("Good ionViewWillEnter().");
    this.updatePageContent();
  }

  ionViewDidEnter(){
  }

  ionViewWillLeave() {
  }

  showAdminFunction(){
    if(this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin()){
      return true;
    }
    return false;
  }

  updatePageContent(){
    if(!this.providerId){
      return;
    }
    this.tripService.s_getTripsForProviderId(this.providerId, this.tripHillId, this.futureOnly, (trips:Trip[]) => {
      this.trips = trips;
      if(!this.trips || this.trips.length===0){
        return;
      }
      if(!this.appSession.l_hasAboveInstructorAccess(this.providerId)){
        this.trips = this.trips.filter(trip => trip.enabled===true);
      }
      this.sortTrips();
    });

    if(this.providerId){
      this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
        this.provider = provider;
      });

      this.providerService.s_getProviderCourseTypesByProviderId(this.providerId, true, (pcTypes:ProviderCourseTypeWithDetails[]) => {
        this.tripProviderCourseTypes = [];
        for(let pcType of pcTypes){
          if(pcType.forTrip){
            this.tripProviderCourseTypes.push(pcType);
          }
        }
      });
    }
  }

  onViewDetails(trip:Trip){
    console.log("Good onViewDetails.");
    let navigationExtras: NavigationExtras = {
      state: {
        tripId:trip.id,
        providerId:this.providerId
      }
    };
    this.router.navigate(['trip-details'], navigationExtras);
  }

  onLogicalDeleteTrip(tripId:number){
    console.log("Good onCancel().");
    if(!this.userId || !tripId){
      return;
    }

    this.utils.showAlertConfirm(this.alertCtrl, "Delete this trip?", "You will not be able to modify it or undo the delete.",
      null, "No", null, "Yes", () => {
        this.tripService.s_logicalDeleteTrip(this.userId, tripId, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("Trip deleted.");
          }else{
            this.toastUtil.showToast("Delete failed!");
          }
          this.onClose();
        });
      });
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  addTrip(){
    console.log("Good addTrip().");
    let trip = new Trip();
    trip.providerId = this.providerId;
    trip.createdDate = new Date();
    trip.lastUpdatedDate = new Date();
    trip.enabled = true;

    let navigationExtras: NavigationExtras = {
      state: {
        trip:trip,
        providerId:this.providerId
      }
    };
    this.router.navigate(['trip-edit'], navigationExtras);
  }

  shareSheetShare() {
    if(!this.providerId){
      return;
    }

    let url = "https://www.kapok-tree.com/#/trips/" + this.providerId + "/" + this.tripHillId;
    console.log("url: " + url);
    if(this.platform.is('cordova')){
      this.socialSharing.share("Trips link. ", "Sharing trips", null, url).then(() => {
        console.log("shareSheetShare: Success");
      }).catch(() => {
        console.error("shareSheetShare: failed");
      });
    }else{
      this.utils.showOkAlertForSharing(this.alertCtrl, "Sharing from browser", "If you are on browser, please copy and share the link below.", url);
    }
  }


  sortByTime(){
    console.log("Good sortByTime.");
    if(!this.trips){
      return;
    }
    this.trips.sort((t1,t2) => {
      if(!t1.time){
        return -1;
      }
      if(!t2.time){
        return 1;
      }
      let startT1 = moment(t1.time);
      let startT2 = moment(t2.time);
      if(!startT1 || startT1.isBefore(startT2)){
        return -1;
      }else{
        return 1;
      }
    });
  }

  sortByName(){
    console.log("Good sortByName.");
    if(!this.trips){
      return;
    }
    this.trips.sort((t1,t2) => {
      let nameT1 = (t1.title?t1.title.toLowerCase():"");
      let nameT2 = (t2.title?t2.title.toLowerCase():"");
      if(!nameT1 || nameT1>nameT2){
        return 1;
      }else{
        return -1;
      }
    });
  }


  sortTrips(){
    if(this.sortOption===this.SORT_BY_COURSE_TIME){
      this.sortByTime();
    }else if(this.sortOption===this.SORT_BY_COURSE_NAME){
      this.sortByName();
    }else{
      console.log("Unknown sort option!");
    }
  }

  async changeSortCourseOption(){
    console.log("Good changeSortCourseOption().");
    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Sort by'),
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: this.translateUtil.translateKey('Name'),
          value: this.SORT_BY_COURSE_NAME,
          checked: false
        },
        {
          name: 'radio2',
          type: 'radio',
          label: this.translateUtil.translateKey('Time'),
          value: this.SORT_BY_COURSE_TIME,
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
            this.sortTrips();
          }
        }
      ]
    });
    await alert.present();
  }

  getTotalTicketCount(trip:Trip){
    if(!trip){
      return '';
    }
    let ticketMember = trip.ticketsMemberCount? trip.ticketsMemberCount:0;
    let ticketNonMember = trip.ticketsNonMemberCount? trip.ticketsNonMemberCount:0;
    return ticketMember + ticketNonMember;
  }

  async openMenu() {
    let buttons:any = [];
    if(this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin()){
      if(this.futureOnly){
        buttons.push(
          {
            text: this.translateUtil.translateKey('Show Past'),
            handler: () => {
              console.log('Show Past');
              this.futureOnly = false;
              this.updatePageContent();
            },
          }
        );
      }else{
        buttons.push(
          {
            text: this.translateUtil.translateKey('Future only'),
            handler: () => {
              console.log('Future only');
              this.futureOnly = true;
              this.updatePageContent();
            },
          }
        );
      }
    }
    buttons.push(
      {
        text: this.translateUtil.translateKey('Sort'),
        handler: () => {
          console.log('Sort clicked');
          this.changeSortCourseOption();
        },
      }
    );
    buttons.push(
      {
        text: this.translateUtil.translateKey('Share'),
        handler: () => {
          console.log('Share clicked');
          this.shareSheetShare();
        },
      }
    );
    if(this.showAdminFunction()){
      buttons.push(
        {
          text: this.translateUtil.translateKey('Add Trip'),
          handler: () => {
            console.log('Add Trip');
            this.addTrip();
          },
        }
      );
    }
    buttons.push(
        {
          text: this.translateUtil.translateKey('Close'),
          handler: () => {
            console.log('Close clicked');
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

  onChooseCourseTime(providerCourseType:ProviderCourseTypeWithDetails, trip:Trip){
    console.log("Good onChooseCourseTime.");

    let navigationExtras: NavigationExtras = {
      state: {
        provider: this.provider,
        providerCourseType: providerCourseType,
        trip:trip,
      }
    };
    this.router.navigate(['choose-course-time'], navigationExtras);
  }


  async showChooseCoursePopup(trip:Trip){
    let header = "Lesson Type";

    let tripPcTypesInputs = [];
    let first = true;
    for(let pcType of this.tripProviderCourseTypes){
      tripPcTypesInputs.push(
        {
          type: 'radio',
          label: pcType.name,
          value: pcType,
          checked: first
        }
      );
      first = false;
    }
    const alert = await this.alertCtrl.create({
      header: header,
      inputs: tripPcTypesInputs,
      buttons: [
        {
          text: this.translateUtil.translateKey("No, thanks"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey("Book"),
          handler: (data) => {
            console.log("Selected Choose. Data: " + data);
            this.onChooseCourseTime(data, trip);
          }
        }
      ]
    });
    await alert.present();
  }
}
