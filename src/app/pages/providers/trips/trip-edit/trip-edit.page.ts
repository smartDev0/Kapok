import {Component, OnInit, ViewChild} from '@angular/core';
import {AppSession} from '../../../../services/app-session.service';
import {AppConstants} from '../../../../services/app-constants.service';
import {ToastUtil} from '../../../../services/toast-util.service';
import {ProvidersService} from '../../../../services/providers-service.service';
import {Utils} from '../../../../services/utils.service';
import {TranslateUtil} from '../../../../services/translate-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController, Platform} from '@ionic/angular';
import {DateTimeUtils} from '../../../../services/date-time-utils.service';
import {BasicUserIdPage} from '../../../BasicUserIdPage';
import {TripServiceService} from '../../../../services/trip-service.service';
import {Trip} from '../../../../models/trip/Trip';
import {ProviderContext} from '../../../../models/transfer/ProviderContext';
import {NgForm} from '@angular/forms';
import {TripHill} from '../../../../models/TripHill';
import * as moment from 'moment';

@Component({
  selector: 'app-trip-edit',
  templateUrl: './trip-edit.page.html',
  styleUrls: ['./trip-edit.page.scss'],
})
export class TripEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  public userId:number;
  public providerId:number;
  public submitted:boolean;
  public tripId:number;
  public trip:Trip;
  public currentDateTime:string;
  public confirmedLeave:boolean;
  public tripHills:TripHill[];
  public deadlineError:string;

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public platform:Platform,
              private actionsheetCtrl:ActionSheetController, public dateTimeUtils:DateTimeUtils,
              private ionRouterOutlet:IonRouterOutlet, private tripService:TripServiceService,
              private alertCtrl:AlertController,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if(this.router.getCurrentNavigation()&& this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.tripId = this.router.getCurrentNavigation().extras.state.tripId;
        this.trip = this.router.getCurrentNavigation().extras.state.trip;
      }
    });
  }


  ngOnInit() {
  }

  ionViewWillEnter() {
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    this.providerService.s_getTripHillsForProviderId(this.userId, this.providerId, (tripHills:TripHill[]) => {
      this.tripHills = tripHills;
    });

    this.currentDateTime = this.dateTimeUtils.getCurrentLocalTime();
    this.appSession.checkProviderContext(false, this.providerId, (context:ProviderContext) => {
      if(context){
      }
    });

    if(!this.trip){
      this.tripService.s_getTripDetailsById(this.tripId, false, null, (trip:Trip) => {
        this.trip = trip;
      });
    }else{
      this.tripId = this.trip.id;
    }
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  saveTrip(formRef:NgForm) {
    console.log("save called good.");
    this.submitted = true;

    let deadline = moment(this.trip.deadLine);
    if(deadline.isBefore(new Date())){
      this.deadlineError = "Deadline can not be in the past.";
      return;
    }else{
      this.deadlineError = null;
    }

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
      return;
    }

    this.tripService.s_saveTrip(this.appSession.l_getUserId(), this.trip, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Trip saved successfully.");
      }else{
        this.toastUtil.showToast("Failed saving trip!");
      }
      this.onClose();
    });
  }

  ionViewCanLeave(){
    if (this.formRef.dirty && !this.confirmedLeave) {
      this.onCancelPage();
      return false;
    }else{
      return true;
    }
  }

  onCancelPage(){
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null, this.translateUtil.translateKey('CANCEL'), null,
          this.translateUtil.translateKey('DISCARD'),
          (data) => {
            this.confirmedLeave = true;
            this.navCtrl.pop();
          });
    }else{
      this.navCtrl.pop();
    }
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

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            console.log('To submit form.');
            if(!this.formRef){
              console.log("Can not find formRef!");
            }else{
              this.formRef.ngSubmit.emit("ngSubmit");
              console.log('Save clicked finished.');
            }
          }
        },
        {
          text: this.translateUtil.translateKey('Close'),
          handler: () => {
            console.log('To submit form.');
            this.onClose();
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
