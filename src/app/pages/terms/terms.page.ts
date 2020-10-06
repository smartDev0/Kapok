import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TranslateUtil} from "../../services/translate-util.service";
import {UserService} from "../../services/user-service.service";
import {IonRouterOutlet, NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {AppConstants} from '../../services/app-constants.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {
  @ViewChild('termsContent')
  termsContent:ElementRef;

  constructor(public navCtrl: NavController, private userService:UserService, public translateUtil:TranslateUtil,
              private ionRouterOutlet: IonRouterOutlet, public router:Router, public appConstants:AppConstants,) {

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.termsContent.nativeElement.innerHTML = this.userService.s_getPageContent(
      this.userService.termsContentName,
      (content) => {
        this.termsContent.nativeElement.innerHTML = content;
      });
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }
}
