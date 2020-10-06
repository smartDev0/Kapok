import {Component, OnInit, ViewChild} from '@angular/core';
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController} from "@ionic/angular";
import {AppConstants} from "../../../../services/app-constants.service";
import {TripServiceService} from "../../../../services/trip-service.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {Utils} from "../../../../services/utils.service";
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ProviderContext} from "../../../../models/transfer/ProviderContext";
import {TripRegistration} from "../../../../models/trip/TripRegistration";
import {StudentUtil} from '../../../../services/student-util.service';
import {CourseRegistration} from "../../../../models/CourseRegistration";
import {Trip} from '../../../../models/trip/Trip';

@Component({
  selector: 'app-trip-registration-details',
  templateUrl: './trip-registration-details.page.html',
  styleUrls: ['./trip-registration-details.page.scss'],
})
export class TripRegistrationDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  showBackBtn:number = 1;

  private fromLink:number = null;
  private userId:number;
  private providerId:number;
  private tripRegistrationId:number;
  public tripRegistration:TripRegistration;
  public trip:Trip = null;
  public tripHillId:number = null;

  public readonly LESSONCMD_GROUP = "group";
  public readonly LESSONCMD_PRIVATE = "private";

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              public utils:Utils, public translateUtil:TranslateUtil, private tripService:TripServiceService,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController,
              private actionsheetCtrl:ActionSheetController, public studentUtil:StudentUtil,
              private alertCtrl:AlertController, private ionRouterOutlet:IonRouterOutlet,) {
    super(appSession, router, appConstants);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.tripRegistrationId = this.router.getCurrentNavigation().extras.state.tripRegistrationId;
        this.fromLink = this.router.getCurrentNavigation().extras.state.fromLink;
        this.showBackBtn = this.router.getCurrentNavigation().extras.state.showBackBtn;
        if(!this.showBackBtn){
          this.showBackBtn = 1;
        }
      }
    });
  }

  ngOnInit() {
    if(!this.providerId){
      this.providerId = parseInt(this.route.snapshot.paramMap.get('providerId'));
      this.tripRegistrationId = parseInt(this.route.snapshot.paramMap.get('tripRegistrationId'));
      this.fromLink = parseInt(this.route.snapshot.paramMap.get('fromLink'));
    }
  }

  ionViewWillEnter() {
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    if(!this.tripRegistrationId){
      return;
    }

    this.appSession.checkProviderContext(false, this.providerId, (context:ProviderContext) => {
      if(context){
      }
    });

    this.tripService.s_getTripRegistrationById(this.tripRegistrationId, (tripRegistration:TripRegistration) => {
      this.tripRegistration = tripRegistration;
      if(this.tripRegistration && this.tripRegistration.tripId){
        this.tripService.s_getTripDetailsById(this.tripRegistration.tripId, false, this.userId, (trip:Trip)=>{
          this.trip = trip;
          if(this.trip){
            this.tripHillId = this.trip.tripHillId;
          }
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

  onViewTrip(tripId:number){
    if(!tripId){
      return;
    }
    let navigationExtras: NavigationExtras = {
      state: {
        tripId:tripId,
        providerId:this.providerId
      }
    };
    this.router.navigate(['trip-details'], navigationExtras);
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      // this.navCtrl.pop();
      this.onViewTripEvents();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
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

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  onCancelTripRegistration(){
    console.log("Good onCancel().");
    this.utils.showAlertConfirm(this.alertCtrl, "Cancel Trip Registration?", "You will not be able to modify it or undo the cancel.",
      null, "No", null, "Yes", () => {
        this.tripService.s_cancelTripRegistration(this.userId, this.tripRegistrationId, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("Trip registration cancelled.");
          }else{
            this.toastUtil.showToast("Cancel failed!");
          }
          this.onClose();
        });
      });
  }

  onViewCourseRegistration(courseRegistration:CourseRegistration){
    console.log("Good onViewCourseRegistration.");
    if(!courseRegistration || !courseRegistration.id){
      return;
    }
    if(!this.userId){
      return;
    }
    if(courseRegistration.userId!==this.userId && !this.appSession.l_isAdministrator(this.providerId) && !this.appSession.l_isSiteAdmin()){
      return;
    }

    let navigationExtras: NavigationExtras = {
      state: {
        registrationId: courseRegistration.id, providerId:this.providerId
      }
    };
    this.router.navigate(['ski-course-registration-details'], navigationExtras);
  }

  onEdit(){
    console.log("Good addTrip().");
    let navigationExtras: NavigationExtras = {
      state: {
        tripRegistration:this.tripRegistration,
        providerId:this.providerId
      }
    };
    this.router.navigate(['trip-registration-edit'], navigationExtras);
  }

  async openMenu() {
    let buttons = [];
    if((this.fromLink>0) || (this.userId>0 && (this.userId===this.tripRegistration.userId || this.appSession.l_hasAboveInstructorAccess(this.providerId)))){
      buttons.push(
        {
          text: this.translateUtil.translateKey('Edit'),
          handler: () => {
            this.onEdit();
          }
        },
        {
          text: this.translateUtil.translateKey('Cancel Registration'),
          handler: () => {
            this.onCancelTripRegistration();
          }
        }
      );
    }
    buttons.push(
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
