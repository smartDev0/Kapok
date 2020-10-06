import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppConstants} from "../../services/app-constants.service";
import {TranslateUtil} from "../../services/translate-util.service";
import {UserService} from "../../services/user-service.service";
import {NavController} from "@ionic/angular";
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  @ViewChild('helpContent')
  helpContent:ElementRef;

  constructor(public navCtrl: NavController, private userService:UserService, public translateUtil:TranslateUtil,
              public appConstants:AppConstants, private route: ActivatedRoute, public router:Router,) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.l_updateContent();
  }

  l_updateContent(){
    let helpName = this.userService.helpContentName_en;

    this.helpContent.nativeElement.innerHTML = this.userService.s_getPageContent(
      helpName,
      (content) => {
        this.helpContent.nativeElement.innerHTML = content;
      });
  }

  onFeedback(){
    let navigationExtras: NavigationExtras = {
      state: {
      }
    };
    this.router.navigate(['feedback'], navigationExtras);
  }

  onTerms(){
    let navigationExtras: NavigationExtras = {
      state: {
      }
    };
    this.router.navigate(['terms'], navigationExtras);
  }
}
