import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppSession} from '../../../../services/app-session.service';
import {AppConstants} from '../../../../services/app-constants.service';
import {ToastUtil} from '../../../../services/toast-util.service';
import {Utils} from '../../../../services/utils.service';
import {TranslateUtil} from '../../../../services/translate-util.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController, Platform,} from '@ionic/angular';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {TripServiceService} from '../../../../services/trip-service.service';
import {BasicUserIdPage} from '../../../BasicUserIdPage';
import {ProviderContext} from '../../../../models/transfer/ProviderContext';
import {Trip} from '../../../../models/trip/Trip';
import {TripRegistration} from '../../../../models/trip/TripRegistration';
import {ReportResponse} from '../../../../models/transfer/ReportResponse';
import * as moment from 'moment';
import {TripHill} from "../../../../models/TripHill";
import {ProvidersService} from "../../../../services/providers-service.service";

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
  providers: [
    SocialSharing,
  ],
})
export class TripDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  private userId:number;
  public providerId:number;
  private tripId:number;
  public trip:Trip;
  public tripHill:TripHill;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              public utils:Utils, public translateUtil:TranslateUtil, private tripService:TripServiceService,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController,
              private socialSharing: SocialSharing, private actionsheetCtrl:ActionSheetController,
              private alertCtrl:AlertController, private ionRouterOutlet:IonRouterOutlet, public platform:Platform,
              private providerService:ProvidersService) {
    super(appSession, router, appConstants);

    this.userId = this.appSession.l_getUserId();
    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.tripId = this.router.getCurrentNavigation().extras.state.tripId;
      }
    });
  }

  ngOnInit() {
    if(!this.providerId){
      this.providerId = parseInt(this.route.snapshot.paramMap.get('providerId'));
    }
    if(!this.tripId){
      this.tripId = parseInt(this.route.snapshot.paramMap.get('tripId'));
    }
  }

  ionViewWillEnter() {
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    if(!this.tripId){
      return;
    }

    this.appSession.checkProviderContext(false, this.providerId, (context:ProviderContext) => {
      if(context){
      }
    });

    let allRegistrations = false;
    if(this.userId && (this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin())){
      allRegistrations = true;
    }
    this.tripService.s_getTripDetailsById(this.tripId, allRegistrations, this.userId, (trip:Trip) => {
      this.trip = trip;
      if(this.trip && this.trip.tripHillId){
        this.providerService.s_getTripHillById(this.trip.tripHillId, (tripHill:TripHill) => {
          this.tripHill = tripHill;
        });
      }
    });
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  ionViewCanLeave(){
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onScrollUp(){
    setTimeout(
        () => {
          this.content.scrollToTop(300);
        },
        10
    );
  }

  onValidate(registration:TripRegistration){
    console.log("Good onValidate().");

    if(!registration || !registration.id){
      return false;
    }

    if(!this.userId){
      this.toastUtil.showToast("Please login first.");
      return false;
    }

    if(!this.appSession.l_hasAboveInstructorAccess(this.providerId) &&
        (!registration.userId || !this.userId || registration.userId!==this.userId)){
      this.toastUtil.showToast("User can only view own registration.");
      return false;
    }

    return true;
  }

  onViewRegistrationDetails(event, registration:TripRegistration){
    console.log("Good onViewRegDetails, registration.id: " + registration.id);
    if(!registration || !registration.id){
      return;
    }

    let valid = this.onValidate(registration);
    if(!valid){
      return;
    }

    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId,
        tripRegistrationId: registration.id,
      }
    };
    this.router.navigate(['trip-registration-details'], navigationExtras);
  }

  showAdminFunction(){
    if(this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin()){
      return true;
    }
    return false;
  }

  onRegister(){
    console.log("Good onRegister().");
    if(!this.trip || !this.trip.id){
      this.toastUtil.showToast("Please save this trip first.");
      return;
    }

    if(this.trip.deadLine && moment(this.trip.deadLine).isBefore(new Date())){
      this.utils.showOkAlert(this.alertCtrl, "Registration closed", "Sorry, this trip is closed for registration because the deadline is passed.");
      return;
    }

    if(!this.userId){
      this.utils.showAlertConfirm(this.alertCtrl, "Login?", null, "You need to login to keep track and manage your registrations",
        "Continue", () => {
          this.l_onRegister();
        },
        "Login", () => {
          let navigationExtras: NavigationExtras = {
            state: {
              // for registering membership;
              providerId:this.providerId,
              memberRegistration:true,
            }
          };
          this.router.navigate(['login'], navigationExtras);
        });
    }else{
      this.l_onRegister();
    }
  }

  l_onRegister(){
    let tripRegistration = new TripRegistration();
    tripRegistration.tripId = this.trip.id;
    tripRegistration.ticketByAgeGroup = this.tripHill.ticketByAgeGroup;
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId,
        tripRegistration:tripRegistration,
      }
    };
    this.router.navigate(['trip-registration-edit', this.utils.getTime()], navigationExtras);
  }

  onEdit(){
    let navigationExtras: NavigationExtras = {
      state: {
        tripId:this.tripId,
        providerId:this.providerId
      }
    };
    this.router.navigate(['trip-edit'], navigationExtras);
  }

  onGoHome(){
    console.log("Going home page.");
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  downloadRegistrationSpreadsheet(){
    console.log("Good downloadRegistrationSpreadsheet.");
    this.l_generate();
  }

  l_generate(){
    console.log("l_generate() generate report now.");
    this.tripService.s_generateTripRegistrationsReport(this.appSession.l_getUserId(), this.tripId, (response:ReportResponse) => {
      console.log("Got content back.");
      if(response && response.result){
        this.toastUtil.showToastTranslate("Report generated.");
      }else{
        // this.toastUtil.showToastTranslate("No registration found.");
        this.utils.showOkAlert(this.alertCtrl, "No registration found.", null);
      }
      if(response && response.fileContent && response.fileName){
        this.utils.downloadFile(response.fileName, response.fileContent);
      }else{
        console.log("Empty bytes content!");
      }
    });
  }

  onLogicalDeleteTrip(){
    console.log("Good onCancel().");
    this.utils.showAlertConfirm(this.alertCtrl, "Delete this trip?", "You will not be able to modify it or undo the delete.",
      null, "No", null, "Yes", () => {
        this.tripService.s_logicalDeleteTrip(this.userId, this.tripId, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("Trip deleted.");
          }else{
            this.toastUtil.showToast("Delete failed!");
          }
          this.onClose();
        });
      });
  }

  onDuplicate(){
    console.log("Good onDuplicate().");
    let newTrip = new Trip();
    newTrip.id = null;
    newTrip.title = this.trip.title + " duplicate";
    newTrip.providerId = this.trip.providerId;
    newTrip.tripHillId = this.trip.tripHillId;
    newTrip.location = this.trip.location;
    newTrip.time = this.trip.time;
    newTrip.description = this.trip.description;
    newTrip.conditionStr = this.trip.conditionStr;
    newTrip.minCount = this.trip.minCount;
    newTrip.maxCount = this.trip.maxCount;
    newTrip.enabled = true;
    newTrip.deadLine = this.trip.deadLine;
    newTrip.tripHillName = this.trip.tripHillName;
    newTrip.ticketsMemberCount = 0;
    newTrip.ticketsNonMemberCount = 0;
    newTrip.createdDate = new Date();
    newTrip.lastUpdatedDate = new Date();

    let navigationExtras: NavigationExtras = {
      state: {
        trip:newTrip,
        providerId:this.providerId
      }
    };
    this.router.navigate(['trip-edit'], navigationExtras);
  }

  shareSheetShare() {
    if(!this.providerId){
      return;
    }

    let url = "https://www.kapok-tree.com/#/trip-details/" + this.providerId + '/' + this.tripId;
    console.log("url: " + url);
    if(this.platform.is('cordova')){
      this.socialSharing.share("Trip " + this.utils.formatDateOnlyWithWeek((this.trip).time), "Sharing trips", null, url).then(() => {
        console.log("shareSheetShare: Success");
      }).catch(() => {
        console.error("shareSheetShare: failed");
      });
    }else{
      this.utils.showOkAlertForSharing(this.alertCtrl, "Sharing from browser", "If you are on browser, please copy and share the link below.", url);
    }
  }

  async openMenu() {
    let buttons = [];
    if(this.showAdminFunction()){
      buttons.push(
          {
            text: this.translateUtil.translateKey('Duplicate'),
            handler: () => {
              this.onDuplicate();
            }
          }
      );
      buttons.push(
        {
          text: this.translateUtil.translateKey('Edit'),
          handler: () => {
            this.onEdit();
          }
        }
      );
      buttons.push(
        {
          text: this.translateUtil.translateKey('Delete'),
          handler: () => {
            this.onLogicalDeleteTrip();
          }
        }
      );
      buttons.push(
          {
            text: this.translateUtil.translateKey('Registrations Report'),
            // role: 'cancel', // will always sort to be on the bottom
            handler: () => {
              console.log('Download spreadsheet clicked');
              this.downloadRegistrationSpreadsheet();
            },
          }
      );
    }

    buttons.push(
      // {
      //   text: this.translateUtil.translateKey('Register'),
      //   handler: () => {
      //     this.onRegister();
      //   }
      // },
      {
        text: this.translateUtil.translateKey('Share'),
        handler: () => {
          this.shareSheetShare();
        }
      },
      {
        text: this.translateUtil.translateKey('Home'),
        handler: () => {
          this.onGoHome();
        }
      },
      {
        text: this.translateUtil.translateKey('Close'),
        handler: () => {
          console.log('To submit form.');
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
