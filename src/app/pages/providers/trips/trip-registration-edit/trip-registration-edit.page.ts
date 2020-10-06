import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppSession} from '../../../../services/app-session.service';
import {AppConstants} from '../../../../services/app-constants.service';
import {ToastUtil} from '../../../../services/toast-util.service';
import {ProvidersService} from '../../../../services/providers-service.service';
import {Utils} from '../../../../services/utils.service';
import {TranslateUtil} from '../../../../services/translate-util.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet, IonSlides,
  ModalController,
  NavController,
  Platform
} from '@ionic/angular';
import {DateTimeUtils} from '../../../../services/date-time-utils.service';
import {TripServiceService} from '../../../../services/trip-service.service';
import {BasicUserIdPage} from '../../../BasicUserIdPage';
import {NgForm} from '@angular/forms';
import {TripRegistration} from '../../../../models/trip/TripRegistration';
import {ProviderContext} from '../../../../models/transfer/ProviderContext';
import {Rental} from '../../../../models/trip/Rental';
import {Subscription} from 'rxjs';
import {CallbackValuesService} from '../../../../services/callback-values.service';
import {StudentUtil} from '../../../../services/student-util.service';
import {GeneralResponse} from '../../../../models/transfer/GeneralResponse';

@Component({
  selector: 'app-trip-registration-edit',
  templateUrl: './trip-registration-edit.page.html',
  styleUrls: ['./trip-registration-edit.page.scss'],
})
export class TripRegistrationEditPage extends BasicUserIdPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent;
  // @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  @ViewChild('slides') slides: IonSlides;
  isSlideBegin:boolean = false;
  isSlideEnd:boolean = false;
  @ViewChild("formRef_1") formRef_1:NgForm;
  @ViewChild("formRef_2") formRef_2:NgForm;
  forms:NgForm[] = [];
  submits:boolean[] = [];
  finalSubmit:boolean = false;
  // Optional parameters to pass to the swiper instance.
  // See http://idangero.us/swiper/api/ for valid options.
  slideOpts = {
    initialSlide: 0,
    allowTouchMove: false,
    speed: 400,
  };

  public userId:number;
  public providerId:number;
  public tripRegistrationId:number;
  public tripRegistration:TripRegistration;

  public currentDateTime:string;
  public confirmedLeave:boolean;
  public repeatEmail:string;
  public shoeSizes:string[];
  public emailRepeatError:string;
  public memberTicketsError:string = null;

  private subscription:Subscription;

  public readonly LESSONCMD_GROUP = "group";
  public readonly LESSONCMD_PRIVATE = "private";

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public platform:Platform,
              private actionsheetCtrl:ActionSheetController, public dateTimeUtils:DateTimeUtils, public studentUtil:StudentUtil,
              private ionRouterOutlet:IonRouterOutlet, private tripService:TripServiceService, private callbackValues:CallbackValuesService,
              private alertCtrl:AlertController,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(false);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.tripRegistrationId = this.router.getCurrentNavigation().extras.state.tripRegistrationId;
        this.tripRegistration = this.router.getCurrentNavigation().extras.state.tripRegistration;
        if(this.tripRegistration){
          this.repeatEmail = this.tripRegistration.email;
        }
      }
    });

    this.initShowSize();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.slides.scrollbar = true;
    this.slides.pager = false;

    this.forms = [];
    this.forms.push(this.formRef_1);
    this.forms.push(this.formRef_2);
    this.checkBeginEnd();

    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    this.currentDateTime = this.dateTimeUtils.getCurrentLocalTime();
    this.appSession.checkProviderContext(false, this.providerId, (context:ProviderContext) => {
      if(context){
      }
    });

    if(!this.tripRegistration){
      if(!this.tripRegistrationId){
        return null;
      }
      this.tripService.s_getTripRegistrationById(this.tripRegistrationId, (tripRegistration:TripRegistration) => {
        this.tripRegistration = tripRegistration;
        if(this.tripRegistration){
          this.repeatEmail = this.tripRegistration.email;
        }
      });
    }else{
      this.tripRegistrationId = this.tripRegistration.id;
    }
  }

  ionViewCanLeave(){
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goPrevious(){
    console.log("Good goPrevious.");
    this.slides.slidePrev().then((value:void) => {
      this.checkBeginEnd();
    });
  }

  continueSlide(){
    this.slides.getActiveIndex().then((index:number) => {
      console.log("activeIndex: " + index);
      if(index>=0){
        this.submits[index] = true;
        let currentForm:NgForm = this.forms[index];
        if(!currentForm){
          return;
        }

        if(!currentForm.valid){
          console.log("Form is not valid");
        }else{
          console.log("Good, form is valid, go to next slide.");

          // customer form field validation;
          if(index===1){
            let valid1 = this.onForm1_Validate();
            if(!valid1){
              return;
            }
          }else if(index===2){
            let valid2 = this.onForm2_Validate();
            if(!valid2){
              return;
            }
          }

          if(index<this.forms.length-1){
            this.goNext();
          }else{
            this.submit();
          }
        }
      }
    });
  }

  goNext(){
    console.log("Good goNext.");
    this.slides.slideNext().then((value:void) => {
      this.checkBeginEnd();
    });
    this.onScrollUp();
  }

  checkBeginEnd(){
    this.isSlideBegin = true;
    if(!this.slides){
      this.isSlideBegin = true;
    }else{
      this.slides.isBeginning().then((istrue) => {
        this.isSlideBegin = istrue;
      });
    }

    this.isSlideEnd = true;
    if(!this.slides){
      this.isSlideEnd = true;
    }else{
      this.slides.isEnd().then((istrue) => {
        this.isSlideEnd = istrue;
      });
    }
  }

  submit(){
    console.log("Good submit.");
    this.finalSubmit = true;

    this.saveTripRegistration();
  }

  onViewConsent(){
    console.log("Good onViewConsent().");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: this.providerId,
      }
    };
    this.router.navigate(['consent-view'], navigationExtras);
  }

  initShowSize(){
    this.shoeSizes = [];
    for(let i = 1; i<=13; i++){
      this.shoeSizes.push(i.toString());
      if(i<13){
        this.shoeSizes.push((i+0.5).toString());
      }
    }
  }

  onDeleteRental(rental:Rental){
    console.log("Good onDeleteRental()");
    if(!rental){
      return;
    }
    if(!this.tripRegistration.rentals || this.tripRegistration.rentals.length===0){
      return;
    }

    this.utils.showAlertConfirm(this.alertCtrl, "Delete this rental?", null, null, "Cancel", null, "Delete",
      () => {
        for(let i = 0; i < this.tripRegistration.rentals.length; i++){
          let rt = this.tripRegistration.rentals[i];
          if(rt===rental){
            this.tripRegistration.rentals.splice(i, 1);
          }
        }
        if(rental.id>0){
          this.tripService.s_deleteRental(rental.id, (result:boolean) => {
            if(result){
              this.toastUtil.showToast("Rental deleted.");
            }else{
              this.toastUtil.showToast("Delete rental failed.");
            }
          });
        }
      });
  }

  isOnEmailChange(){
    if(!this.tripRegistration.id || this.repeatEmail!==this.tripRegistration.email){
      return true;
    }else{
      return false;
    }
  }

  onCheckRepeatEmail(){
    if(this.tripRegistration.email !== this.repeatEmail){
      this.emailRepeatError = "Repeat email is not the same with email!";
      return false;
    }
    this.emailRepeatError = null;
    return true;
  }

  onForm1_Validate(){
    console.log("Good onForm1_Validate().");

    if(!this.tripRegistration.consent){
      this.toastUtil.showToast("Please read and agree to terms to continue.");
      return false;
    }

    if(!this.onCheckRepeatEmail()){
      return false;
    }

    return true;
  }

  onForm2_Validate(){
    console.log("Good onForm2_Validate().");
    return true;
  }

  public getMemberTicketsNumber(){
    if(this.tripRegistration && this.tripRegistration.clubMember===true){
      if(!this.tripRegistration.ticketByAgeGroup){
        return this.tripRegistration.overallMemberTickets;
      }
      return this.tripRegistration.ticketsMemberGrp1 + this.tripRegistration.ticketsMemberGrp2 +
        this.tripRegistration.ticketsMemberGrp3 + this.tripRegistration.ticketsMemberGrp4;
    }
    return 0;
  }

  saveTripRegistration() {
    console.log("save called good.");

    if(this.userId){
      this.tripRegistration.userId = this.userId;
    }

    if(!this.tripRegistration.needRental){
      this.tripRegistration.rentals = null;
    }

    let message = "You have successfully registered the trip. Thanks!";
    if(this.tripRegistration.id>0){
      message = "Registration saved.";
    }
    this.tripService.s_saveTripRegistration(this.userId, this.tripRegistration, (response:GeneralResponse) => {
      if(!response){
        this.toastUtil.showToast("Trip registration saving failed!");
      }

      if(response.code === 0){
        this.toastUtil.showToast("Trip registration saved successfully!");
        if(response.resultId && response.resultId>0){
          this.tripRegistration.id = response.resultId;
        }
        // this.showChooseCoursePopup(true);
        this.utils.showOkAlert(this.alertCtrl, message, null);
      }else{
        this.utils.showOkAlert(this.alertCtrl, "Registration failed.", response.message);
      }
      this.onClose();
    });
  }

  onCheckRental(){
    if(this.tripRegistration.needRental && !this.tripRegistration.rentals){
      this.onAddRental();
    }
  }

  onAddRental(){
    console.log("Good onAddRental().");
    let rental = new Rental();
    rental.tripRegistrationId = this.tripRegistration.id;
    rental.createdDate = new Date();
    rental.lastUpdatedDate = new Date();
    if(!this.tripRegistration.rentals){
      this.tripRegistration.rentals = [];
    }
    this.tripRegistration.rentals.push(rental);
  }

  onCancelPage(){
    if (true) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null, this.translateUtil.translateKey('CANCEL'), null,
          this.translateUtil.translateKey('DISCARD'),
          (data) => {
            this.confirmedLeave = true;
            this.onClose();
          });
    }else{
      this.onClose();
    }
  }

  onClose(){
    if(this.tripRegistration && this.tripRegistration.id){
      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.providerId,
          tripRegistrationId: this.tripRegistration.id,
          fromLink:2,
        }
      };
      this.router.navigate(['trip-registration-details'], navigationExtras);
    }else{
      if(this.ionRouterOutlet.canGoBack()){
        this.navCtrl.pop();
      }else{
        this.router.navigate([this.appConstants.ROOT_PAGE]);
      }
    }
  }

  onScrollUp(){
    setTimeout(
        () => {
          this.content.scrollToTop(0);
        },
        10
    );
  }

  changeClubMember(){
    this.tripRegistration.ticketsMemberGrp1 = null;
    this.tripRegistration.ticketsMemberGrp2 = null;
    this.tripRegistration.ticketsMemberGrp3 = null;
    this.tripRegistration.ticketsMemberGrp4 = null;
    this.tripRegistration.ticketsNonMemberGrp1 = null;
    this.tripRegistration.ticketsNonMemberGrp2 = null;
    this.tripRegistration.ticketsNonMemberGrp3 = null;
    this.tripRegistration.ticketsNonMemberGrp4 = null;
  }

  getCommandName(){
    let command = "Save";
    if(!this.tripRegistration || !this.tripRegistration.id){
      command = "Submit";
    }
    return command;
  }

  // onSubmit(){
  //   if(!this.formRef){
  //     console.log("Can not find formRef!");
  //   }else{
  //     this.formRef.ngSubmit.emit("ngSubmit");
  //     console.log('Save clicked finished.');
  //   }
  // }
  //
  // async openMenu() {
  //   let command = "Save";
  //   if(!this.tripRegistration.id){
  //     command = "Submit";
  //   }
  //   this.actionSheet = await this.actionsheetCtrl.create({
  //     cssClass: 'action-sheets-basic-page',
  //     buttons: [
  //       {
  //         text: command,
  //         handler: () => {
  //           console.log('To submit form.');
  //           this.onSubmit();
  //         }
  //       },
  //       {
  //         text: this.translateUtil.translateKey('Close'),
  //         handler: () => {
  //           console.log('To submit form.');
  //           this.onClose();
  //         }
  //       },
  //     ]
  //   });
  //   this.actionSheet.present();
  // }
}
