import { Component } from '@angular/core';
import {AlertController, MenuController, Platform} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {TranslateUtil} from '../services/translate-util.service';
import {Utils} from '../services/utils.service';
import {AppSession} from '../services/app-session.service';
import {AppConstants} from '../services/app-constants.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private subscription:Subscription;

  constructor(private platform: Platform, private alertCtrl:AlertController, public translateUtil:TranslateUtil, public utils:Utils,
              public appSession:AppSession, public menu: MenuController, public appConstants:AppConstants,){

  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      if(this.platform.is('cordova')){
        navigator['app'].exitApp();
      }
    });
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }


}
