import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController, AlertController,
  IonContent, IonRouterOutlet,
  NavController,
} from '@ionic/angular';
import {AppSession} from '../../../../services/app-session.service';
import {AppConstants} from '../../../../services/app-constants.service';
import {ToastUtil} from '../../../../services/toast-util.service';
import {ProvidersService} from '../../../../services/providers-service.service';
import {Utils} from '../../../../services/utils.service';
import {TranslateUtil} from '../../../../services/translate-util.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {BasicUserIdPage} from '../../../BasicUserIdPage';
import {RecurrenceInstance} from "../../../../models/schedule/RecurrenceInstance";
import {ScheduleService} from "../../../../services/schedule.service";
import {ChooseRecurrenceRequest} from "../../../../models/transfer/ChooseRecurrenceRequest";

@Component({
  selector: 'app-schedule-check',
  templateUrl: './schedule-check.page.html',
  styleUrls: ['./schedule-check.page.scss'],
})
export class ScheduleCheckPage extends BasicUserIdPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  // These ids are for create course relationship to SkiEvent or SkiProvider;
  providerId:number = null;
  userId:number = null;
  recurrenceInstances:RecurrenceInstance[];
  candidateInstances:RecurrenceInstance[];
  searchUserId:number;
  searchOnDate:any;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController,
              private actionsheetCtrl:ActionSheetController, private ionRouterOutlet:IonRouterOutlet,
              private scheduleService:ScheduleService, private alertCtrl:AlertController,) {
    super(appSession, router, appConstants);

    this.userId = this.appSession.l_getUserId();
    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.searchUserId = this.router.getCurrentNavigation().extras.state.searchUserId;
        if(!this.searchUserId){
          this.searchUserId = this.userId;
        }
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(!this.providerId) {
      this.toastUtil.showToastTranslate("Empty provider!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    this.updatePageContent();
  }

  ionViewDidEnter() {
  }

  ionViewCanLeave() {
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  ngOnDestroy(){
  }

  updatePageContent(){

  }

  onReset(){
    this.searchUserId = null;
    this.searchOnDate = null;
    this.candidateInstances = null;
    this.recurrenceInstances = null;
  }

  onSearch(){
    console.log("Good onSearch().");
    if(!this.userId || this.userId<=0){
      console.log("Only login user has schedule.");
      return;
    }
    let queryRequest:ChooseRecurrenceRequest = new ChooseRecurrenceRequest();
    queryRequest.providerId = this.providerId;
    queryRequest.fromUserId = this.userId;
    queryRequest.chosenDate = this.searchOnDate;
    queryRequest.chosenUserId = this.searchUserId;
    queryRequest.withBlocked = true;
    this.scheduleService.queryInstructorSchedule(this.userId, queryRequest, (insts:RecurrenceInstance[]) => {
      this.candidateInstances = insts;
    });

    this.scheduleService.getScheduleInstances(this.providerId, this.userId, this.searchOnDate,(insts:RecurrenceInstance[]) => {
      this.recurrenceInstances = insts;
    });
  }

  onEditInstance(instance:RecurrenceInstance){
    console.log("Good onEditInstance.");
    let scheduleId = instance.scheduleId;
    let navigationExtras: NavigationExtras = {
      state: {
        scheduleId:scheduleId,
        providerId:this.providerId,
      }
    };
    this.router.navigate(['schedule-edit'], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  onToggleInstance(instance:RecurrenceInstance){
    console.log("Good onToggleInstance(instance).");
    if(!instance){
      return;
    }
    instance.expended = !instance.expended;
  }

  onSaveInstance(instance){
    console.log("Good onSaveInstance(instance).");
    if(!instance){
      return;
    }
    this.scheduleService.saveRecurrenceInstance(this.userId, instance, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Saved successfully.");
        this.onSearch();
      }else{
        this.toastUtil.showToast("Save failed!");
      }
    });
  }

  onDeleteInstance(instance:RecurrenceInstance){
    console.log("Good onDeleteInstance(instance).");
    if(!instance || !instance.id){
      return;
    }
    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete this instance?", null, null, "Cancel", null, "Delete",
      () => {
        this.scheduleService.deleteRecurrenceInstance(instance.id, (result:boolean) => {
          if(result===true){
            this.toastUtil.showToast("Recurrence instance deleted.");
            this.onSearch();
          }else{
            this.toastUtil.showToast("Delete recurrence instance failed!");
          }
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

  goHome(){
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  async openMenu() {
    let buttons:any = [];

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

