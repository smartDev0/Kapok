import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {AttachedFileService} from "../../services/attached-file.service";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import {CalendarComponent} from "ionic2-calendar";
import {formatDate} from "@angular/common";
import {AlertController} from "@ionic/angular";
import {ScheduleService} from "../../services/schedule.service";
import {ChooseRecurrenceRequest} from "../../models/transfer/ChooseRecurrenceRequest";
import {RecurrenceInstance} from "../../models/schedule/RecurrenceInstance";
import * as moment from "moment";
import {Utils} from "../../services/utils.service";
import {ProvidersService} from "../../services/providers-service.service";
import {SessionTime} from "../../models/SessionTime";
import {AppSession} from "../../services/app-session.service";

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.page.html',
  styleUrls: ['./test-page.page.scss'],
})
export class TestPagePage implements OnInit {
  editContent:string;
  youtubeLink:string = "https://www.youtube.com/embed/MLleDRkSuvk";
  safeLink:SafeResourceUrl;

  collapseCard:boolean;

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

  @ViewChild(CalendarComponent) myCal : CalendarComponent;

  constructor(private attachedFileService:AttachedFileService, private domSanitizer: DomSanitizer,
              @Inject(LOCALE_ID)private local, private alertCtrl:AlertController, private scheduleService:ScheduleService,
              public utils:Utils, public providerService:ProvidersService, public appSession:AppSession,) {
    // this.safeLink = this.domSanitizer.bypassSecurityTrustResourceUrl(this.youtubeLink);
  }

  ngOnInit(){
    this.resetEvent();
    this.getSessionTimeForInstructor();
    // this.getCourseRecurrenceInstances();
  }

  getSessionTimeForInstructor() {
    let providerId = 2;
    let instructorId = 1;

    this.providerService.s_getSessionsForInstructorId(providerId, instructorId, true, (sessionTimes:SessionTime[]) => {
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

  getCourseRecurrenceInstances(){
    let request = new ChooseRecurrenceRequest();
    request.providerId = 2;
    request.fromUserId = 1;
    request.courseId = 671;
    this.scheduleService.queryCourseSchedule(1, request, (instances:RecurrenceInstance[]) => {
      if(instances && instances.length>0){
        for(let inst of instances){
          if(!inst.clonedRecurrence || !inst.clonedRecurrence.timeSlots || inst.clonedRecurrence.timeSlots.length===0){
            continue;
          }
          for(let timeSlot of inst.clonedRecurrence.timeSlots){
            let eventCopy = {
              title: inst.clonedSchedule?inst.clonedSchedule.title:"Empty title",
              desc: inst.clonedSchedule?inst.clonedSchedule.description:"Empty description",
              startTime: new Date(),
              endTime: new Date(),
              allDay: false,
            };
            eventCopy.startTime = moment(this.utils.formatDateShort(inst.day) + " " + this.utils.formatTimeLongOfDate(timeSlot.startTime)).toDate();
            eventCopy.endTime = moment(this.utils.formatDateShort(inst.day) + " " + this.utils.formatTimeLongOfDate(timeSlot.endTime)).toDate();

            this.eventSource.push(eventCopy);
          }
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

  addEvent() {
    let eventCopy = {
      title: this.event.title,
      desc: this.event.desc,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay
    };

    if(eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    }

    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvent();
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

  // onJoditChange($event){
  //   if(!$event || !$event.args){
  //     return;
  //   }
  //   const val = $event.args[0];
  //   const preVal = $event.args[1];
  //   console.log("Good onJoditChange, value: " + val + ", previous value: " + preVal);
  //
  //   this.editContent = val;
  //   this.editContent = this.domSanitizer.bypassSecurityTrustResourceUrl(this.editContent).toString();
  // }
  //
  // // example: <iframe width="560" height="315" src="https://www.youtube.com/embed/MLleDRkSuvk" frameborder="0" allowfullscreen></iframe>
  // santizeContent(strContent:string):string{
  //   if(!strContent || strContent.trim().length===0){
  //     return;
  //   }
  //   strContent = strContent.trim();
  //   let indexStart = strContent.indexOf("<iframe");
  //   if(indexStart<0){
  //     return strContent;
  //   }
  //   let indexEnd = strContent.indexOf(">", indexStart);
  //   if(indexEnd<0){
  //     return strContent;
  //   }
  //   let iframeStr = strContent.substring(indexStart, indexEnd+1);
  //   let srcStart = iframeStr.indexOf("src");
  //   if(srcStart<0){
  //     return strContent;
  //   }
  //   srcStart = iframeStr.indexOf("\"", srcStart);
  //   let srcEnd = iframeStr.indexOf("\"", srcStart+1);
  //   if(srcEnd<0){
  //     return strContent;
  //   }
  //   let srcStr = iframeStr.substring(srcStart+1, srcEnd);
  //   console.log("srcStr is: " + srcStr);
  //   if(!srcStr || srcStr.trim().length===0){
  //     return strContent;
  //   }
  //   let surl:SafeResourceUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(srcStr);
  //   let surlStr = surl.toString();
  //   // this.editContent = this.domSanitizer.bypassSecurityTrustResourceUrl(this.editContent);
  // }
  //
  // getVideoURL(videoId:number){
  //   return this.attachedFileService.s_getVideoURL(1, videoId);
  // }

}
