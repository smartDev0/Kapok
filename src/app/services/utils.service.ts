import { Injectable } from '@angular/core';

import * as moment from 'moment';
import {AppConstants} from './app-constants.service';
import {AlertController} from "@ionic/angular";
import {DomSanitizer} from '@angular/platform-browser';
import {Base64util} from './base64util.service';
import {TranslateUtil} from './translate-util.service';
import {ToastUtil} from './toast-util.service';
import {SessionTime} from "../models/SessionTime";

@Injectable({
  providedIn: 'root'
})
export class Utils {
  private buttonDebounces: Array<string>;

  constructor(private appConstants: AppConstants, private domSanitizer: DomSanitizer, private base64Util:Base64util,) { }

  getTime(){
    return (new Date()).getTime();
  }

  getEntityFromListById(list:any[], id:any){
    if(!list || list.length===0 || !id || id<=0){
      return null;
    }
    for(let entity of list){
      if(!entity.id){
        continue;
      }else if(entity.id===id){
        return entity;
      }
    }
    return null;
  }

  stripHtmlTags(str:string){
    if(!str || str.length===0){
      return str;
    }
    let result = str.replace(/<\/?[^>]+>/gi, ""); //removing html tag using regex pattern
    return result;
  }

  santizeURL(url:string){
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }


  downloadFile(fileName:string, fileContent:string){
    if(!fileName || !fileContent){
      return null;
    }

    let decoded = this.base64Util._base64ToArrayBuffer(fileContent);
    console.log('start download.');
    let blob = new Blob([decoded]);
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;  //"report.xlsx";

    setTimeout(
        () => {
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        },
        500
    );

    return true;
  }

  // retrieveGeoLocation(callback){
  //   let options = {
  //     frequency: 3000,
  //     enableHighAccuracy: true
  //   };
  //   this.geolocation.getCurrentPosition(options).then((position:Position) => {
  //     let posStr = position.coords.latitude + "," + position.coords.longitude;
  //     this.cache.saveItem("GEO_LOCATION", posStr, null, 1*60).then(()=>{
  //       console.log("GEO_LOCATION saved. posStr: " + posStr);
  //     });
  //
  //     var pos = position.coords.latitude + "," + position.coords.longitude;
  //     callback(pos);
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }

  // appendVersionParameter(url:string):string{
  //   if(!url || url.trim().length==0){
  //     return url;
  //   }
  //   url = url.trim() + "?v=" + this.appConstants.appVersion;
  //   return url;
  // }

  truncateString(str:string, length:number):string{
    if(!str || !length || length<=0){
      return str;
    }
    if(str.length>length){
      str = str.substr(0, length-3) + "...";
    }
    return str;
  }

  showMedium(str:string):string{
    if(!str){
      return str;
    }
    if(str.length>30){
      str = str.substr(0, 27) + "...";
    }
    return str;
  }

  showLarge(str:string):string{
    if(!str){
      return str;
    }
    if(str.length>this.appConstants.MAX_STRING_LENGTH){
      str = str.substr(0, this.appConstants.MAX_STRING_LENGTH-3) + "...";
    }
    return str;
  }

  checkInArray(obj:any, list:any[]):boolean{
    if(!obj || !list || list.length===0){
      return false;
    }
    for(let tObj of list){
      if(tObj===obj){
        return true;
      }
    }
    return false;
  }

  removeFromArray(obj:any, list:any[]):any[]{
    if(!obj || !list || list.length===0){
      return;
    }
    list = list.filter(listObj => listObj !== obj);
    return list;
  }

  getYesNo(value){
    if(!value || value===false || value.toString().toUpperCase()==="NO"){
      return "NO";
    }else{
      return "YES";
    }
  }

  getProviderCourseTypeCountByName(value:number){
    if(value===this.appConstants.PROVIDER_COURSE_TYPE_COUNT_BY_PACKAGE){
      return "Course";
    }else if(value===this.appConstants.PROVIDER_COURSE_TYPE_COUNT_BY_STUDENT){
      return "Student";
    }
    return "Unknown";
  }

  public replaceIconUrl(item: any): any {
    if(!item){
      return item;
    }

    let serviceName = "getImageIconById";
    let serviceFullName = "imageContentById";

    if (item.iconId) {
      item.iconUrl = this.appConstants.BASE_URL + serviceName + "/" + item.iconId;  // BASE_URL must ended with "/";
      item.iconFullUrl = this.appConstants.BASE_URL + serviceFullName + "/" + item.iconId;
    } else {
      item.iconUrl = this.appConstants.BASE_URL + "imageContentPreloadByName/ANONYMOUS_ICON";  // BASE_URL must ended with "/";
      item.iconFullUrl = this.appConstants.BASE_URL + "serviceFullName/ANONYMOUS_ICON";  // BASE_URL must ended with "/";
    }
    return item;
  }

  // Remove second part from time string HH:mm:ss, return HH:mm;
  removeSecond(timeStr:string){
    if(!timeStr || timeStr.length===0){
      return timeStr;
    }
    timeStr = timeStr.trim();
    let index = timeStr.lastIndexOf(":");
    if(index<=0){
      return timeStr;
    }
    timeStr = timeStr.substr(0, index);
    return timeStr;
  }

  checkForIOSAndISOFormat(dateField:any){
    if(!dateField){
      return dateField;
    }
    if(typeof dateField  === 'string' || dateField instanceof String){
      let count1 = (dateField.match(/:/g) || []).length;
      let count2 = (dateField.match(/-/g) || []).length;
      if(count1>=1 && count2>=1){
        dateField = dateField.replace(' ', 'T');
      }else if(dateField.indexOf(", ")>0){
        // Oct 16, 2018
        let date:Date = new Date(Date.parse(dateField.toString()));
        dateField = date.toISOString();
      }else if(dateField.toLowerCase().indexOf("am")>=0 || dateField.toLowerCase().indexOf("pm")>=0){
        // "01:00:00 AM"
        dateField = moment(dateField.toString(), 'HH:mm:ss a');
      }
    }
    return dateField;
  }

  // This format is ISO 8601 Datetime Format: YYYY-MM-DDTHH:mmZ, for ion-datetime;
  convertDateToJson (dateField){
    if(dateField){
      dateField = this.checkForIOSAndISOFormat(dateField);
      let dateJson = moment(dateField).format('YYYY-MM-DDTHH:mm');
      return dateJson;
    }
    return null;
  }

  currentTimeString(){
    return this.convertDateToJson(new Date());
  }

  formatDateWithWeek(date) {
    if(date){
      date = this.checkForIOSAndISOFormat(date);
      let dateJson = moment(date).format('dddd YYYY-MM-DD HH:mm');
      return dateJson;
    }
    return null;
  }

  formatDateOnlyWithWeek(date) {
    if(date){
      date = this.checkForIOSAndISOFormat(date);
      let dateJson = moment(date).format('dddd YYYY-MM-DD');
      return dateJson;
    }
    return null;
  }

  formatDate(date){
    if(date){
      date = this.checkForIOSAndISOFormat(date);
      let dateJson = moment(date).format('YYYY-MM-DD HH:mm');
      return dateJson;
    }
    return null;
  }

  formatDateLong(date){
    if(date){
      date = this.checkForIOSAndISOFormat(date);
      let dateJson = moment(date).format('YYYY-MM-DD HH:mm:ss');
      return dateJson;
    }
    return null;
  }

  formatDateShort(date){
    if(!date || date.toString().trim().length<=10){
      return date;
    }
    if(date){
      date = this.checkForIOSAndISOFormat(date);
      let dateJson = moment(date).format('YYYY-MM-DD');
      return dateJson;
    }
    return null;
  }

  formatTimeOfDate(date){
    if(!date || date.toString().trim().length<=5){
      return date;
    }
    if(date){
      // "11:59:59 PM"
      date = this.checkForIOSAndISOFormat(date);
      let dateJson = moment(date).format('HH:mm');
      return dateJson;
    }
    return null;
  }

  formatTimeLongOfDate(date){
    if(!date || date.toString().trim().length<=5){
      return date;
    }
    if(date){
      date = this.checkForIOSAndISOFormat(date);
      let dateJson = moment(date).set('second', 0).format('HH:mm:ss');
      return dateJson;
    }
    return null;
  }

  formatYearMonth(date){
    if(!date || date.toString().trim().length<=5){
      return date;
    }
    if(date){
      date = this.checkForIOSAndISOFormat(date);
      let dateJson = moment(date).format('YYYY-MMM');
      return dateJson;
    }
    return null;
  }

  formatDayOfYear(date){
    if(!date || date.toString().trim().length<=6){
      return date;
    }
    if(date){
      date = this.checkForIOSAndISOFormat(date);
      let dateJson = moment(date).format('MMM-DD');
      return dateJson;
    }
    return null;
  }

  getSecondsDifference(startTime:any, endTime:any){
    let start = moment(startTime);
    let end = moment(endTime);
    let duration = moment.duration(end.diff(start));
    let seconds = duration.asSeconds();
    return seconds;
  }

  toISOString(value){
    if(!value){
      return null;
    }
    value = this.checkForIOSAndISOFormat(value);
    let isoString = moment(value).toISOString();
    return isoString;
  }

  changeTimeZoneFromISOToLocalForCalendar(value:any){
    return value;
  }

  changeTimeZoneFromISOToLocalForServer(value:string):any{
    return value;
  }

  public parseDate(input) {
    let parts = input.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
  }

  /*
  onDate: YYYY-MM-DD;
  hour: hour 00 to 23;
  minute: minute from 00 to 59;
  return: YYYY-MM-DDTHH:mm:00.000Z
   */
  constructTimeISOString(onDate:string, hour:string, minute:string):string{
    if(!onDate || !hour || !minute){
      return null;
    }
    let date = this.parseDate(onDate);
    let str = moment(date).set('hour', parseInt(hour)).set('minute', parseInt(minute)).toISOString();
    return str;
  }

  getNoonOfDay(day:any){
    if(!day){
      return null;
    }
    let noon = moment(day).set('hour', 12).set('minute', 0).set('second', 0);
    return noon.toDate();
  }

  isSameDay(t1:any, t2:any):boolean{
    if(!t1 || !t2){
      return false;
    }
    let isSameDay = moment(t1).isSame(moment(t2), 'day');
    return isSameDay;
  }

  // return error message if not valid, or null if valid;
  public validateStartEndTime(startT:any, endT:any):string{
    if(!startT){
      return "Empty start time!";
    }
    if(!endT){
      return "Empty end time!";
    }

    startT = moment(startT);
    endT = moment(endT);
    if(startT.isAfter(endT)){
      return "StartTime must before endTime!";
    }
    if(startT.dayOfYear()!==endT.dayOfYear()){
      return "Not the same day!";
    }
    // if(startT.get("minute")!==endT.get("minute")){
    //   return "Must be whole hour(s)!";
    // }
    return null;
  }

  getTwoYears():number[]{
    let currentYear = moment().get("year");
    let nextYear = currentYear + 1;
    let years = [];
    years.push(currentYear);
    years.push(nextYear);
    return years;
  }

  combineTime(date:string, time:string):string{
    if(!date || !time){
      return null;
    }
    return date + " " + time;
  }


  highlightSearch(text:string, key:string) {
    if(!text || text.trim().length===0 || !key || key.trim().length===0){
      return text;
    }

    let keys = key.toLowerCase().split(/[\s,;]+/);
    text = this.highlightSearchKeys(text, keys);
    return text;
  }

  highlightSearchKeys(text:string, keys:string[]) {
    if(!text || text.trim().length===0 || !keys || keys.length===0){
      if(!text){
        text = "";
      }
      return text;
    }

    let resultstring:string[] = [];
    let tempResult:string[] = [];
    resultstring.push(text);
    for(let key of keys){
      console.log("key: " + key);
      for(let i=0; i<resultstring.length; i++){
        let temp:string = resultstring[i];
        console.log("temp: " + temp);

        let indexCss = temp.indexOf("<span class=");
        if(indexCss>=0){
          tempResult.push(temp);
          continue;
        }

        let index = temp.toLowerCase().indexOf(key.toLowerCase());
        if(index>=0){
          tempResult.push(temp.substring(0, index));
          tempResult.push("<span class='specialField'>" + temp.substring(index, index+key.length) + "</span>");
          tempResult.push(temp.substring(index + key.length, temp.length));
        }else{
          tempResult.push(temp);
        }
      }
      resultstring = tempResult;
      tempResult = [];
    }

    text = resultstring.join("");
    return text;
  }

  formatEmpty(str:any){
    if(!str){
      return "";
    }
    return str.toString().trim();
  }

  phoneVailtion(phone:string){
    // XXX-XXX-XXXX
    let phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(phone.match(phoneReg)) {
      return true;
    }
    else {
      return false;
    }
  }

  emailValidation(email:string):boolean  {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    let isValid = regexp.test(email);
    return isValid;
  }

  public getStars(rating) {
    if(!rating || rating<=0){
      return "0%";
    }

    // Get the value
    let val = parseFloat(rating);
    // Turn value into number/100
    let size = val/5*100;
    return size + '%';
  }

  youtubeLinkValidation(link:string):boolean {
    if(!link || link.trim().length===0){
      return false;
    }

    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    let match = link.match(regExp);
    if (match && match[2].length === 11) {
      return true;
    }
    else {
      return false;
    }
  }

  async showAlertConfirm(alertCrtl:AlertController, title:string, subTitle:string, message:string,
                         cancelText:string, cancelCallback:any, confirmText:string, confirmCallback:any) {
    const alert = await alertCrtl.create({
      header: title,
      subHeader: subTitle,
      message: message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          cssClass: 'secondary',
          handler: cancelCallback
        }, {
          text: confirmText,
          handler: confirmCallback
        }
      ]
    });

    await alert.present();
  }

  public async showOkAlert(alertCtrlVar: AlertController, title:string, mesg:string){
    const alert = await alertCtrlVar.create({
      header: title,
      // subHeader: "Please update app to newest version then continue.",
      message: mesg,
      buttons: ['OK']
    });
    return await alert.present();
  }

  public isRegistrationPaid(paymentStatusId:number):boolean{
    if(paymentStatusId &&
      (
        paymentStatusId===this.appConstants.PAYMENT_FULLY_ID ||
        paymentStatusId===this.appConstants.PAYMENT_PRE_APPROVED ||
        paymentStatusId===this.appConstants.PAYMENT_WAIVED_ID ||
        paymentStatusId===this.appConstants.PAYMENT_PAID_OFFLINE_ID ||
        paymentStatusId===this.appConstants.PAYMENT_PAID_ONLINE_ID
      )
    ){
      return true;
    }else{
      return false;
    }
  }

  public async showOkAlertForSharing(alertCtrlVar: AlertController, title:string, mesg:string, url:string){
    let inputs:any[] = [];
    let disabled=true;
    inputs.push({
      name: "URL",
      type: 'url',
      label: "URL",
      value: url,
      // disabled:disabled,
    });

    const alert = await alertCtrlVar.create({
      header: title,
      inputs: inputs,
      // subHeader: "Please update app to newest version then continue.",
      message: mesg,
      buttons: ['OK']
    });
    return await alert.present();
  }

  // add Youtube link:
  async addYoutubeLink(alertCtrl:AlertController, translateUtil:TranslateUtil, toastUtil:ToastUtil, youtubeLinks:string[], callback?:any){
    const alert = await alertCtrl.create({
      header: translateUtil.translateKey('Add Youtube link'),
      subHeader: translateUtil.translateKey("embed link only"),
      inputs: [
        {
          id: 'Youtube link',
          name: 'link',
          type: 'text',
          placeholder: ''
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: translateUtil.translateKey('Add'),
          handler: (data) => {
            if(data && data['link']){
              let link:string = data['link'];
              console.log("link: " + link);
              link = link.trim();
              let isValid:boolean = this.youtubeLinkValidation(link);
              if(!isValid){
                toastUtil.showToastTranslate("Please enter valid Youtube link and try again.");
                return;
              }
              if(link.indexOf("embed")<0){
                toastUtil.showToastTranslate("Only embed Youtube line allowed.");
                return;
              }

              if(!link || link.trim().length===0){
                return;
              }
              if(!youtubeLinks){
                youtubeLinks = [];
              }
              let found:boolean = false;
              for(let i = 0; i < youtubeLinks.length; i++) {
                if(youtubeLinks[i]===link){
                  found = true;
                  break;
                }
              }
              if(!found){
                youtubeLinks.push(link);
                if(callback){
                  callback(youtubeLinks);
                }
              }else{
                toastUtil.showToast("The link is already in the list. Skip adding.");
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  getSessionTimesString(sessionTimes:SessionTime[]){
    if(!sessionTimes || sessionTimes.length===0){
      return null;
    }
    let str = null;
    for(let sessionTime of sessionTimes){
      if(!str){
        str = "";
      }
      str = str + this.getSessionTimeStr(sessionTime);
    }
    return str;
  }

  getSessionTimeStr(sessionTime:SessionTime){
    if(!sessionTime){
      return null;
    }
    let str = (sessionTime.name?("<b>" + sessionTime.name + "</b><br/>"):"");
    str = str + (sessionTime.startTime?this.formatDate(sessionTime.startTime):"NA") + " to " + (sessionTime.startTime?this.formatTimeOfDate(sessionTime.endTime):"NA") + "<br/>";
    str = str + (sessionTime.tripHillName?sessionTime.tripHillName + "<br/>":"");
    return str;
  }

  getTagListFromString(str:string){
    if(!str || str.trim().length===0){
      return null;
    }
    str = str.trim();
    return str.split("|");
  }

  /**
   * check if the button should be debounced;
   * @param btnName: button or menu name to be debounced. Must unique!
   * @param debounce: debounce time in millisecond;
   * return: true should be debounced; false not o be debounced which is first time clicked.
   */
  checkDebounce(btnName:string, debounce?:number):boolean{
    if(!btnName || btnName.trim().length===0){
      return false;
    }
    if(!this.buttonDebounces){
      this.buttonDebounces = new Array<string>();
    }
    for(let name of this.buttonDebounces){
      if(name===btnName){
        return true;
      }
    }

    if(!debounce || debounce<=0){
      debounce = 5000;
    }
    this.buttonDebounces.push(btnName);
    setTimeout(
      () => {
        for(let i=0; i<this.buttonDebounces.length; i++){
          if(this.buttonDebounces[i]===btnName){
            this.buttonDebounces.splice(i, 1);
          }
        }
      },
      debounce
    );
    return false;
  }

}
