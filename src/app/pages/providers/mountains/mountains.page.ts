import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  ModalController,
  NavController,
  NavParams,
  PopoverController
} from "@ionic/angular";
import {Mountain} from "../../../models/Mountain";
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {AppSession} from "../../../services/app-session.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {AppConstants} from "../../../services/app-constants.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-mountains',
  templateUrl: './mountains.page.html',
  styleUrls: ['./mountains.page.scss'],
})
export class MountainsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  mountains:Mountain[] = null;
  callback:any = null;
  disableModifyButtons:boolean = true;

  constructor(public appSession:AppSession,
              public popoverCtrl: PopoverController, public providersService:ProvidersService,
              public modalCtrl: ModalController, public appConstants:AppConstants,
              public alertCtrl: AlertController, public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, private navCtrl:NavController,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.updatePageContent();
  }


  updatePageContent(){
    this.providersService.s_getAllMountains(false, (mountains:Mountain[]) => {
      this.mountains = mountains;
    });
  }

  onViewDetails(mountainId){
    console.log("Good onViewDetails, mountainId: " + mountainId);
    let navigationExtras: NavigationExtras = {
      state: {
        mountainId: mountainId
      }
    };
    this.router.navigate(['mountain-details'], navigationExtras);
  }

  onAdd(){
    console.log("Good onAdd.");
    let mountain = new Mountain();
    let navigationExtras: NavigationExtras = {
      state: {
        mountain:mountain
      }
    };
    this.router.navigate(['mountain-edit'], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  l_getYesNo(value:boolean){
    if(value){
      return this.translateUtil.translateKey("YES");
    }else{
      return this.translateUtil.translateKey("NO");
    }
  }

  openPage(selection:string) {
    // let options = {enableBackdropDismiss: false};
    switch(selection){
      case "events": {

        break;
      }
      default: {
        console.log("Unknown selection: " + selection);
        break;
      }
    }
  }

  onClose(){
    this.navCtrl.pop();
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Add'),
        handler: () => {
          console.log('Add clicked');
          this.onAdd();
        },
      }
    );
    buttons.push(
      {
        text: this.translateUtil.translateKey('CLOSE'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('CLOSE clicked');
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
