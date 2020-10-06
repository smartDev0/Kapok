import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TranslateUtil} from "../../services/translate-util.service";
import {UserService} from "../../services/user-service.service";
import {ModalController, NavController} from '@ionic/angular';
import {AppConstants} from '../../services/app-constants.service';

@Component({
  selector: 'app-terms',
  templateUrl: './termsModal.page.html',
  styleUrls: ['./termsModal.page.scss'],
})
export class TermsModalPage implements OnInit {
  @ViewChild('termsContent')
  termsContent:ElementRef;

  constructor(public navCtrl: NavController, private userService:UserService, public translateUtil:TranslateUtil,
              public appConstants:AppConstants, private modalController:ModalController,) {

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
    this.modalController.dismiss(null);
  }
}
