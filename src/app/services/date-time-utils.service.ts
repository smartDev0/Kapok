import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateTimeUtils {

  constructor() {

  }

  // get 2 digits for hour or minute;
  getTwoDigits(num:number):string{
    if(!num){
      return "NA";
    }
    let str = "";
    if(num>-10 && num<10){
      str = "0" + Math.floor(num).toString();
    }else{
      str = Math.floor(num).toString();
    }
    return str;
  }

  // format: "08:00"
  getHourOfString(str:string):number{
    if(!str || str.length<=4 || str.indexOf(":")<=0){
      return null;
    }
    let hour = parseInt(str.split(':')[0]);
    return hour;
  }

  // format: "08:00"
  getMinuteOfString(str:string):number{
    if(!str || str.length<=4 || str.indexOf(":")<=0){
      return null;
    }
    let minute = parseInt(str.split(':')[1]);
    return minute;
  }

  getCurrentLocalTime(){
    //timedifference in minutes
    let timedifference = new Date().getTimezoneOffset();
    let localDateTime = this.calculateTime((timedifference/60));
    return localDateTime;
  }

  // offset in hours;
  calculateTime(offset: any) {
    // create Date object for current location
    let d = new Date();

    // create new Date object for different city
    // using supplied offset
    let nd = new Date(d.getTime() - (3600000 * offset));

    return nd.toISOString();
  }

  // Determine if the client uses DST
  stdTimezoneOffset(today: any) {
    let jan = new Date(today.getFullYear(), 0, 1);
    let jul = new Date(today.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  }

  dst(today: any) {
    return today.getTimezoneOffset() < this.stdTimezoneOffset(today);
  }

  // removeTimeZone(time:string):string{
  //   if(!time){
  //     return null;
  //   }
  //
  //   // let zone = moment.tz.zone('UTC');
  //   // create Date object for current location
  //   let d = new Date(time);
  //   //timedifference in minutes
  //   var timedifference = new Date().getTimezoneOffset();
  //   let offset = (timedifference/60);
  //
  //   // reverse timezone;
  //   let nd = new Date(d.getTime() + (3600000 * offset));
  //
  //   return nd.toISOString();
  // }


  // Move time for number of hours;
  // Parameter: time in ISOString;
  moveTime(time:string, hours:number):string{
    console.log("time: " + time);
    let d = moment(time);
    let nd = d.add(hours, 'hours');
    console.log("nd.toISOString(): " + nd.toISOString());
    return nd.toISOString();
  }
}
