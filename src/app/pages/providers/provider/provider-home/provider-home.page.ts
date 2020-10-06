import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent, IonRouterOutlet,
  LoadingController,
  NavController, Platform,
  PopoverController
} from "@ionic/angular";
import {Provider} from "../../../../models/Provider";
import {AppSession} from "../../../../services/app-session.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {Utils} from "../../../../services/utils.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {PopoverDetailPage} from "./Popover";
import {ProviderMemberWithDetails} from "../../../../models/ProviderMemberWithDetails";
import {ProviderContext} from "../../../../models/transfer/ProviderContext";

@Component({
  selector: 'app-provider-home',
  templateUrl: './provider-home.page.html',
  styleUrls: ['./provider-home.page.scss'],
})
export class ProviderHomePage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;
  private popover:any;

  public userId:number;
  providerId:number = null;
  provider:Provider = null;

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil, public alertCtrl:AlertController,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private actionsheetCtrl:ActionSheetController, private navCtrl:NavController, private popCtrl:PopoverController,
              private route: ActivatedRoute, public router:Router, public loadingCtrl: LoadingController,
              private ionRouterOutlet:IonRouterOutlet, ) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(!this.providerId){
      this.toastUtil.showToastTranslate("providerId is empty!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    this.updatePageContent(true);
  }

  updatePageContent(refresh?){
    if(!refresh){
      refresh = false;
    }else{
      refresh = true;
    }

    // reset providerContext first;
    this.appSession.l_setProviderContext(null);

    this.appSession.checkProviderContext(refresh, this.providerId, (context:ProviderContext) => {
      if(context){
        this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
          if(provider){
            this.provider = provider;
          }
        });
      }
    });
  }

  onMyRegistrations(){
    console.log("onMyRegistrations.");
    if(this.provider.id){
      let navigationExtras: NavigationExtras = {
        state: {
          fromCommand:this.appConstants.PAGE_FOR_MEMBER, providerId: this.provider.id
        }
      };
      this.router.navigate(['ski-courses-registrations', this.utils.getTime()], navigationExtras);
    }
  }

  onLearningSessions(){
    console.log("Good onLearningSessions.");
    if(this.userId>0){
      let navigationExtras: NavigationExtras = {
        state: {
          fromCommand:this.appConstants.PAGE_FOR_MEMBER, providerId:this.providerId,
        }
      };
      this.router.navigate(['session-times', this.utils.getTime()], navigationExtras);
    }else{
      console.log("Please login first!");
    }
  }

  onMyTeachingSessions(){
    console.log("onMyTeachingSessions.");
    let instructorId = this.appSession.l_getInstructorId(this.providerId);
    if(instructorId){
      let navigationExtras: NavigationExtras = {
        state: {
          fromCommand:this.appConstants.PAGE_FOR_INSTRUCTOR, providerId:this.providerId, instructorId:instructorId,
        }
      };
      this.router.navigate(['session-times', this.utils.getTime()], navigationExtras);
    }else{
      console.log("I am not a instructor for current provider!");
    }
  }

  onAllProviderSessions(){
    console.log("onAllProviderSessions.");
    if(this.providerId){
      let navigationExtras: NavigationExtras = {
        state: {
          fromCommand:this.appConstants.PAGE_FOR_PROVIDER, providerId:this.providerId,
        }
      };
      this.router.navigate(['session-times', this.utils.getTime()], navigationExtras);
    }else{
      console.log("Unknown provider!");
    }
  }

  onViewInstructors(){
    console.log("onViewInstructors.");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId
      }
    };
    this.router.navigate(['show-instructors', this.providerId], navigationExtras);
  }

  onAvailablePrograms(){
    console.log("Good onAvailablePrograms().");
    let navigationExtras: NavigationExtras = {
      state: {
        fromCommand:this.appConstants.PAGE_FOR_AVAILABLE, providerId:this.providerId
      }
    };
    this.router.navigate(['ski-courses', this.utils.getTime()], navigationExtras);
  }

  openPage(selection:string) {
    console.log("openPage got selection: " + selection);
    switch(selection){
      // ShowInstructors
      case "ShowInstructors": {
        this.onViewInstructors();
        break;
      }
      case "Membership": {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId,
          }
        };
        this.router.navigate(['membership'], navigationExtras);
        break;
      }
      case "comments": {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId, entityTypeId:this.appConstants.COMMENT_TYPE_PROVIDER, entityId: this.providerId
          }
        };
        this.router.navigate(['comments', this.utils.getTime()], navigationExtras);
        break;
      }
      case 'MembershipTypesPage': {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId
          }
        };
        this.router.navigate(['membership-types', this.providerId], navigationExtras);
        break;
      }
      case "tripEvents": {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId,
          }
        };
        this.router.navigate(['trips', this.providerId], navigationExtras);
        break;
      }
      case "priceFormulas": {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId,
          }
        };
        this.router.navigate(['course-price-formulas', this.providerId], navigationExtras);
        break;
      }
      case "members": {  // Reviewed;
        // provider-members
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId
          }
        };
        this.router.navigate(['provider-members', this.providerId], navigationExtras);
        break;
      }
      case "courses": {  // Reviewed;
        // For administrator to manage all skiCourses;
        if(this.provider.id){
          let navigationExtras: NavigationExtras = {
            state: {
              fromCommand:this.appConstants.PAGE_FOR_PROVIDER, providerId:this.provider.id
            }
          };
          this.router.navigate(['ski-courses', this.utils.getTime()], navigationExtras);
        }
        break;
      }
      case "MyRegistrations": {  // Reviewed;
        this.onMyRegistrations();
        break;
      }
      case "allRegistrations": {  // Reviewed;
        if(this.provider.id){
          let navigationExtras: NavigationExtras = {
            state: {
              fromCommand:this.appConstants.PAGE_FOR_PROVIDER, providerId:this.provider.id
            }
          };
          this.router.navigate(['ski-courses-registrations', this.utils.getTime()], navigationExtras);
        }
        break;
      }
      case "allSessions": {  // Reviewed;  // allSessions
        this.onAllProviderSessions();
        break;
      }
      case "myInstructorTimes": {  // Reviewed;
        let instructorId = this.appSession.l_getInstructorId(this.providerId);
        if(instructorId){
          let navigationExtras: NavigationExtras = {
            state: {
              fromCommand:this.appConstants.PAGE_FOR_INSTRUCTOR,
              providerId:this.provider.id,
              instructorId:instructorId,
            }
          };
          this.router.navigate(['schedules'], navigationExtras);
        }else{
          console.log("I am not a instructor for current provider!");
        }
        break;
      }
      case "MyTeachingPage": {  // Reviewed;
        let instructorId = this.appSession.l_getInstructorId(this.providerId);
        if(instructorId){
          let navigationExtras: NavigationExtras = {
            state: {
              fromCommand:this.appConstants.PAGE_FOR_INSTRUCTOR, providerId:this.providerId, instructorId:instructorId,
            }
          };
          this.router.navigate(['ski-courses', this.utils.getTime()], navigationExtras);
        }else{
          console.log("I am not a instructor for current provider!");
        }
        break;
      }
      case "MyTeachingRegistrations": {  // Reviewed;
        let instructorId = this.appSession.l_getInstructorId(this.providerId);
        if(instructorId){
          let navigationExtras: NavigationExtras = {
            state: {
              fromCommand:this.appConstants.PAGE_FOR_INSTRUCTOR,
              providerId:this.providerId,
              instructorId:instructorId,
            }
          };
          this.router.navigate(['ski-courses-registrations', this.utils.getTime()], navigationExtras);
        }else{
          console.log("I am not a instructor for current provider!");
        }
        break;
      }
      case "MyTeachingSessionTimes": {  // Reviewed;
        this.onMyTeachingSessions();
        break;
      }
      case "MyLevelsPage": {  // Reviewed;
        let instructorId = this.appSession.l_getInstructorId(this.providerId);
        if (instructorId) {
          let navigationExtras: NavigationExtras = {
            state: {
              providerId: this.provider.id,
            }
          };
          this.router.navigate(['my-levels', this.provider.id], navigationExtras);
        } else {
          console.log("I am not a instructor for current provider!");
        }
        break;
      }
      case "onLearningSessions": {
        this.onLearningSessions();
        break;
      }
      case "myLearningSkiCourse": {  // Reviewed;
        if(this.appSession.l_getUserId()){
          let navigationExtras: NavigationExtras = {
            state: {
              fromCommand:this.appConstants.PAGE_FOR_MEMBER, providerId:this.providerId,
            }
          };
          this.router.navigate(['ski-courses', this.utils.getTime()], navigationExtras);
        }else{
          console.log("I am not a member for current provider!");
        }
        break;
      }
      case "PaymentReportPage": {
        if(this.provider.id){
          //payment-report
          let navigationExtras: NavigationExtras = {
            state: {
              providerId: this.providerId
            }
          };
          this.router.navigate(['payment-report', this.utils.getTime()], navigationExtras);
        }
        break;
      }
      case "administrators": {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId
          }
        };
        this.router.navigate(['administrators', this.providerId], navigationExtras);
        break;
      }
      case "instructors": {  // Reviewed;
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId
          }
        };
        this.router.navigate(['ski-instructors', this.utils.getTime()], navigationExtras);
        break;
      }
      case "providerCourseTypes":{
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId
          }
        };
        this.router.navigate(['provider-course-type', this.providerId], navigationExtras);
        break;
      }
      case "priceUnits": {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId
          }
        };
        this.router.navigate(['price-units', this.providerId], navigationExtras);
        break;
      }
      case "PaymentAccountPage": {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId
          }
        };
        this.router.navigate(['payment-account', this.providerId], navigationExtras);
        break;
      }
      case "PrePaymentsPage": {
        //
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId
          }
        };
        this.router.navigate(['pre-payments', this.providerId], navigationExtras);
        break;
      }
      case "ProviderSchedulesPage": {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId
          }
        };
        this.router.navigate(['provider-schedules', this.providerId], navigationExtras);
        break;
      }
      case "CourseConsentPage": {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.providerId
          }
        };
        this.router.navigate(['course-consent', this.providerId], navigationExtras);
        break;
      }
      case "allInstructorTimes": {  // Reviewed;
        let navigationExtras: NavigationExtras = {
          state: {
            fromCommand:this.appConstants.PAGE_FOR_PROVIDER,
            providerId:this.provider.id,
            instructorId:null,
          }
        };
        this.router.navigate(['schedules'], navigationExtras);
        break;
      }
      case "checkInstructorTime": {  // Reviewed;
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.provider.id,
            searchUserId:this.userId,
          }
        };
        this.router.navigate(['schedule-check'], navigationExtras);
        break;
      }
      case "AgeRangeOptions": {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.provider.id,
          }
        };
        this.router.navigate(['age-range-options'], navigationExtras);
        break;
      }
      case "LevelOptions": {
        let navigationExtras: NavigationExtras = {
          state: {
            providerId:this.provider.id,
          }
        };
        this.router.navigate(['level-options'], navigationExtras);
        break;
      }
      default: {
        console.log("Unknown selection: " + selection);
        break;
      }
    }
  }

  async presentPopover(myEvent:any) {
    console.log("Good presentMenu.");

    this.popover = await this.popCtrl.create({
      component: PopoverDetailPage,
      componentProps: {providerId:this.providerId, userId:this.appSession.l_getUserId(), callback: (selection:string) => {
          console.log("Got callback selection: " + selection);
          this.openPage(selection);
        }},
      event: myEvent,
      translucent: true
    });
    await this.popover.present();
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onViewDetails(providerId){
    if(!this.appSession.l_getUserId()){
      return;
    }
    console.log("Good onViewDetails.");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: providerId,
      }
    };
    this.router.navigate(['provider-details', providerId], navigationExtras);
  }

  async openMenu() {
    let buttons:any = [];
    // buttons.push(
    //   {
    //     text: this.translateUtil.translateKey('Available Programs'),
    //     handler: () => {
    //       console.log('Available Programs clicked');
    //       this.onAvailablePrograms();
    //     },
    //   }
    // );

    buttons.push(
      {
        text: this.translateUtil.translateKey('School details'),
        handler: () => {
          console.log('School details clicked');
          this.onViewDetails(this.providerId);
        },
      }
    );

    if(this.provider.onlineMembership){
      if(!this.appSession.l_isMember(this.providerId)){
        buttons.push(
          {
            text: this.translateUtil.translateKey('Register Member'),
            handler: () => {
              console.log('Register Member clicked');
              if(!this.providerId){
                this.toastUtil.showToastTranslate("Can not providerId is empty.");
                return;
              }
              let member = new ProviderMemberWithDetails();
              member.providerId = this.providerId;
              member.userId = this.appSession.l_getUserId();
              member.userName = this.appSession.l_getUserInfo().userName;
              member.startDate = this.utils.convertDateToJson(new Date());
              member.providerMemberTypeId = null;
              member.activated = true;
              member.expireDate = null;
              let navigationExtras: NavigationExtras = {
                state: {
                  member: member, providerId:this.providerId
                }
              };
              this.router.navigate(['provider-member-edit'], navigationExtras);
            },
          }
        );
      }else{
        buttons.push(
          {
            text: this.translateUtil.translateKey('My Membership'),
            handler: () => {
              console.log('My Membership clicked');
              let navigationExtras: NavigationExtras = {
                state: {
                  memberId: this.appSession.l_getMemberId(this.providerId), providerId:this.providerId
                }
              };
              this.router.navigate(['provider-member-details'], navigationExtras);
            },
          }
        );
      }
    }

    if(buttons==null || buttons.length===0){
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
    }

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
