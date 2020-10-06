import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UserInfo} from '../models/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class TranslateUtil {

  constructor(private translate:TranslateService) { }

  // code: 'en' or 'fr' or 'cn';
  setLanguage(code:string){
    if(!code){
      return;
    }
    if(code!=='en' && code!=='fr' && code!=='cn'){
      console.log("Wrong language code: " + code);
      return;
    }
    this.translate.use(code);
  }

  translateKey(key:string){
    if(!key){
      return;
    }
    return this.translate.instant(key);
  }

  translateEventStatusFields (eventObj):Event{
    if(eventObj){
      if(eventObj.statusName){
        eventObj.statusName = this.translate.instant(eventObj.statusName);
      }
      if(eventObj.publicityName){
        eventObj.publicityName = this.translate.instant(eventObj.publicityName);
      }
      if(eventObj.languageName){
        eventObj.languageName = this.translate.instant(eventObj.languageName);
      }
    }
    return eventObj;
  }

  translateUserFields (usrObj):UserInfo{
    if(usrObj){
      if(usrObj.languageName){
        usrObj.languageName = this.translate.instant(usrObj.languageName);
      }
    }
    return usrObj;
  }
}
