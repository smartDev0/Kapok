import {Component, Inject, Input, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonContent, LoadingController, ModalController,} from "@ionic/angular";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {Utils} from "../../../../services/utils.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {AppSession} from "../../../../services/app-session.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {SessionTime} from "../../../../models/SessionTime";
import * as moment from "moment";
import {CalendarComponent} from "ionic2-calendar";
import {formatDate} from "@angular/common";
import {Question} from "../../../../models/userRelationship/Question";

@Component({
  selector: 'app-sessions-calendar',
  templateUrl: './sessions-calendar.component.html',
  styleUrls: ['./sessions-calendar.component.scss'],
})
export class SessionsCalendarComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(CalendarComponent) myCal : CalendarComponent;

  public submitted:boolean;
  private userId:number;


  eventSource = [];
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  minDate = new Date().toISOString();

  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };

  viewTitle = '';

  @Input() providerId:number;
  @Input() instructorId:number;

  constructor(public translateUtil:TranslateUtil, public modalController: ModalController, public utils:Utils, private loadingCtrl:LoadingController,
              public alertCtrl:AlertController, private toastUtil:ToastUtil, private providerService:ProvidersService,
              public appSession:AppSession, public appConstants:AppConstants, @Inject(LOCALE_ID)private local,) {
    this.userId = this.appSession.l_getUserId();
  }

  ngOnInit() {
    this.getSessionTimeForInstructor();
  }

  getSessionTimeForInstructor() {

    this.providerService.s_getSessionsForInstructorId(this.providerId, this.instructorId, true, (sessionTimes:SessionTime[]) => {
      if(sessionTimes && sessionTimes.length>0){
        for(let sessionTime of sessionTimes){
          if(!sessionTime.startTime || !sessionTime.endTime){
            continue;
          }
          let eventCopy = {
            id: sessionTime.id,
            title: sessionTime.name?this.utils.truncateString(sessionTime.name, 60):"Empty title",
            desc: sessionTime.description,
            startTime: new Date(),
            endTime: new Date(),
            allDay: false,
          };
          eventCopy.startTime = moment(this.utils.formatDateShort(sessionTime.startTime) + " " + this.utils.formatTimeLongOfDate(sessionTime.startTime)).toDate();
          eventCopy.endTime = moment(this.utils.formatDateShort(sessionTime.startTime) + " " + this.utils.formatTimeLongOfDate(sessionTime.endTime)).toDate();

          this.eventSource.push(eventCopy);
        }
      }
      this.myCal.loadEvents();
    });
  }


  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }

  today(){
    this.calendar.currentDate = new Date();
  }

  next() {
    let swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  back() {
    let swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  async onEventSelected(event){
    console.log("Good onEventSelected.");
    let start = formatDate(event.startTime, 'medium', this.local);
    let end = formatDate(event.endTime, 'medium', this.local);

    const alert = await this.alertCtrl.create({
      header: (event.title?event.title:"Empty title"),
      subHeader: 'From: ' + start + ' To: ' + end,
      message: (event.desc?event.desc:""),
      buttons: ['OK']
    });
    alert.present();
  }

  onTitleChanged(ev){
    this.viewTitle = ev;
  }

  changeMode(mode:string){
    console.log("Good changeMode: " + mode);
    this.calendar.mode = mode;
  }

  onTimeSelected(ev){
    console.log("Good onTimeSelected.;");
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

  onClose(){
    this.modalController.dismiss();
  }


}
