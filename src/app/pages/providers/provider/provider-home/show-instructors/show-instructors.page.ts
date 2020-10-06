import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../../../BasicUserIdPage';
import {ActionSheetController, AlertController, IonContent, NavController} from '@ionic/angular';
import {InstructorWithDetails} from '../../../../../models/InstructorWithDetails';
import {Provider} from '../../../../../models/Provider';
import {AppSession} from '../../../../../services/app-session.service';
import {AppConstants} from '../../../../../services/app-constants.service';
import {ToastUtil} from '../../../../../services/toast-util.service';
import {ProvidersService} from '../../../../../services/providers-service.service';
import {Utils} from '../../../../../services/utils.service';
import {TranslateUtil} from '../../../../../services/translate-util.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {ChooseRecurrenceRequest} from "../../../../../models/transfer/ChooseRecurrenceRequest";
import {SchedulesPage} from "../../../schedules/schedules.page";
import {ScheduleService} from "../../../../../services/schedule.service";
import {RecurrenceInstance} from "../../../../../models/schedule/RecurrenceInstance";

@Component({
  selector: 'app-show-instructors',
  templateUrl: './show-instructors.page.html',
  styleUrls: ['./show-instructors.page.scss'],
})
export class ShowInstructorsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private actionSheet:any;
  public onDate:any;

  userId:number = null;
  providerId:number = null;
  provider:Provider = null;
  mountainId:number = null;
  instructors:InstructorWithDetails[] = null;

  public showSearchBar:boolean = false;
  public keyIndex:number = 0;
  public searchKey:string = null;

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private actionsheetCtrl:ActionSheetController, private navCtrl:NavController, private alertCtrl:AlertController,
              private route: ActivatedRoute, public router:Router, private scheduleService:ScheduleService) {
    super(appSession, router, appConstants);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.mountainId = this.router.getCurrentNavigation().extras.state.mountainId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    console.log("Good ShowInstructorsPage ionViewWillEnter().");
    this.searchKey = null;
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
        this.provider = provider;
      });
    }
    this.updatePageContent();
    if(!this.appSession.shownAvailableAler){
      this.utils.showOkAlert(this.alertCtrl, "Instructors with available program/lesson will be listed here.", null);
      this.appSession.shownAvailableAler = true;
    }
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    this.providerService.s_getAllProviderInstructorWithDetailsForProvider(this.providerId, true, (instructors:InstructorWithDetails[]) => {
      this.instructors = instructors;
    });
  }

  onClearOnDate(){
    this.onDate = null;
    if(this.instructors && this.instructors.length>0) {
      for (let instructor of this.instructors) {
        instructor.hideByNoSchedule = false;
      }
    }
  }

  onViewMySchedule(istUserId, istId){
    console.log("Good onViewMySchedule, istUserId: " + istUserId);
    if(!istUserId || istUserId<=0 || !istId || istId<=0){
      return;
    }

    let showDate = this.utils.formatDateShort(new Date());
    if(this.onDate){
      showDate = this.utils.formatDateShort(this.onDate);
    }
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId,
        searchUserId: istUserId,
        searchInstructorId: istId,
        onDate: showDate,
      }
    };
    this.router.navigate(['schedule-book'], navigationExtras);
  }

  onShowComments(instructorId:number){
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId,
        entityTypeId:this.appConstants.COMMENT_TYPE_INSTRUCTOR,
        entityId: instructorId,
        title: this.translateUtil.translateKey("Instructor's review"),
        showRate:true,
      }
    };
    this.router.navigate(['comments'], navigationExtras);
  }

  onInstructorDetails(instructorId:number){
    console.log("Good onInstructorDetails. instructor: " + instructorId);
    if(!instructorId || instructorId<0){
      return;
    }
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: this.providerId, instructorId: instructorId
      }
    };
    this.router.navigate(['ski-instructor-details'], navigationExtras);
  }

  onDateChanged(){
    console.log("Good onDateChanged().");
    // get all recurrenceInstances and compare userId between recurrenceInstance and instructor;
    if(this.onDate){
      let request = new ChooseRecurrenceRequest();
      request.fromUserId = this.userId;
      request.providerId = this.providerId;
      request.chosenDate = this.onDate;
      this.scheduleService.queryInstructorSchedule(this.userId, request,
        (instances:RecurrenceInstance[]) => {
          if(this.instructors && this.instructors.length>0){
            for(let instructor of this.instructors){
              instructor.hideByNoSchedule = true;
              if(instances && instances.length>0){
                for(let instance of instances){
                  if(instance.clonedSchedule && instance.clonedSchedule.userId && instance.clonedSchedule.userId===instructor.userId){
                    instructor.hideByNoSchedule = false;
                    break;
                  }
                }
              }
            }
          }
        });
    }
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
        if(instructor.name && instructor.name.toLowerCase().indexOf(val.toLowerCase()) > -1){
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

  onViewMyCourses(instId:number){
    console.log("Good onViewMyCourses(), instructorId: " + instId + ", mountainId: " + this.mountainId);
    if(!instId){
      return;
    }
    if(!this.mountainId){
      this.mountainId = -1;
    }

    let navigationExtras: NavigationExtras = {
      state: {
        fromCommand:this.appConstants.PAGE_FOR_AVAILABLE,
        providerId:this.providerId,
        mountainId:this.mountainId,
        instructorId:instId
      }
    };
    this.router.navigate(['ski-courses', this.utils.getTime()], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
        () => {
          this.content.scrollToTop(300);
        },
        100
    );
  }

  onClose(){
    this.navCtrl.pop();
  }

  async openMenu() {
    let buttons:any = [];
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
