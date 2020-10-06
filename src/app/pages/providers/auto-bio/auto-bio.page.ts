import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastUtil} from "../../../services/toast-util.service";
import {ActionSheetController, IonContent, NavController} from "@ionic/angular";
import {UserService} from "../../../services/user-service.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {AppConstants} from "../../../services/app-constants.service";

@Component({
  selector: 'app-auto-bio',
  templateUrl: './auto-bio.page.html',
  styleUrls: ['./auto-bio.page.scss'],
})
export class AutoBioPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  private actionSheet:any;
  instructorUserId:number = null;
  autobioText:string = null;

  constructor(private route: ActivatedRoute, private router: Router, private toastUtil:ToastUtil, private userService:UserService,
              public translateUtil:TranslateUtil, private actionsheetCtrl:ActionSheetController, public appConstants:AppConstants,
              public navCtrl:NavController,) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.instructorUserId = this.router.getCurrentNavigation().extras.state.instructorUserId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(!this.instructorUserId){
      return;
    }
    this.l_getUserAutoBio();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  l_getUserAutoBio(){
    this.userService.s_getUserBioByUserId(this.instructorUserId, (bioText:string) => {
      this.autobioText = bioText;
    });
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  onClose(){
    this.navCtrl.pop();
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Close'),
        handler: () => {
          console.log('Close clicked');
          this.onClose();
        },
      }
    );

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
