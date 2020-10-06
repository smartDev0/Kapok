import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';
import {TranslateUtil} from './translate-util.service';

@Injectable({
  providedIn: 'root'
})
export class ToastUtil {

  constructor(public translateUtil:TranslateUtil, private toastCtrl: ToastController) { }

  // time: millisecond;
  async showToastForTime(message:string, time:number, pos?){
    const toast = await this.toastCtrl.create({
      message: message,
      duration: time,
      position: pos
    });
    toast.present();
  }

  /**
   *
   * @param message: mesage to show;
   * @param time: time to display;
   * @param pos: top, bottom and middle;
   */
  showToast(message:string, time?:number, pos?){
    if(!time){
      time = 3000;
    }
    this.showToastForTime(message, time, pos);
  }

  showToastMediumTime(message:string){
    this.showToast(message, 5000);
  }

  showToastLongTime(message:string){
    this.showToast(message, 10000);
  }

  showToastTranslate(message:string, time?:number){
    if(!time){
      time = 3000;
    }
    this.showToastForTime(this.translateUtil.translateKey(message), time);
  }
}
