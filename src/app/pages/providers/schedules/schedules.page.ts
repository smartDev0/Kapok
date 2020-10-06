import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, IonContent, IonRouterOutlet, NavController} from "@ionic/angular";
import {Provider} from "../../../models/Provider";
import {AppSession} from "../../../services/app-session.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {AppConstants} from "../../../services/app-constants.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {CallbackValuesService} from "../../../services/callback-values.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {Utils} from "../../../services/utils.service";
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {Schedule} from "../../../models/schedule/Schedule";
import {ScheduleService} from "../../../services/schedule.service";
import {InstructorWithDetails} from "../../../models/InstructorWithDetails";

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.page.html',
  styleUrls: ['./schedules.page.scss'],
})
export class SchedulesPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  userId:number;
  providerId:number = null;
  instructorId:number = null;
  instructor:InstructorWithDetails;
  schedules:Schedule[] = null;
  fromCommand:number;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, private callbackValues:CallbackValuesService,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils, public scheduleService:ScheduleService,
              private ionRouterOutlet:IonRouterOutlet,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();
    this.instructorId = null;

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.fromCommand = this.router.getCurrentNavigation().extras.state.fromCommand;

        if(this.fromCommand===this.appConstants.PAGE_FOR_INSTRUCTOR){
          this.instructorId = this.router.getCurrentNavigation().extras.state.instructorId;
          if(this.instructorId && this.instructorId>0){
            this.providersService.s_getSkiInstructorDetailsById(this.instructorId, (instructor:InstructorWithDetails) => {
              if(!instructor){
                this.toastUtil.showToast("Can not find instructor!");
                this.onClose();
                return;
              }
              if(!instructor.activated){
                this.toastUtil.showToast("Instructor is not activated!");
                this.onClose();
                return;
              }
              this.instructor = instructor;
            });
          }else{
            this.toastUtil.showToast("Empty instructor!");
            this.onClose();
            return;
          }
        }else if(this.fromCommand===this.appConstants.PAGE_FOR_PROVIDER){
          console.log("For provider.");
        }else{
          this.toastUtil.showToast("Unknown command.!");
          this.onClose();
          return;
        }
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    let instructorUserId = null;
    if(this.instructor){
      instructorUserId = this.instructor.userId;
    }
    this.scheduleService.getSchedulesForProviderIdInstructorId(this.providerId, this.instructorId, (schedules:Schedule[]) => {
      this.schedules = schedules;
    });
  }

  onViewDetails(schedule:Schedule){
    console.log("Good onViewDetails.");
    if(!schedule){
      return;
    }
    let navigationExtras: NavigationExtras = {
      state: {
        scheduleId:schedule.id,
        providerId:this.providerId,
      }
    };
    this.router.navigate(['schedule-edit'], navigationExtras);
  }

  onAdd(){
    let schedule = new Schedule();
    schedule.userId = this.userId;
    schedule.providerId = this.providerId;
    schedule.enabled = true;
    let navigationExtras: NavigationExtras = {
      state: {
        schedule:schedule,
        providerId:this.providerId,
      }
    };
    this.router.navigate(['schedule-edit'], navigationExtras);
  }

  checkSchedule(){
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId,
        searchUserId:this.userId,
      }
    };
    this.router.navigate(['schedule-check'], navigationExtras);
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
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
        text: this.translateUtil.translateKey('Check InstructorTime'),
        handler: () => {
          console.log('Check InstructorTime clicked.');
          this.checkSchedule();
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
