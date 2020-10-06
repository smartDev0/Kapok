import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController} from "@ionic/angular";
import {Provider} from "../../../models/Provider";
import {LevelOption} from "../../../models/courseOptions/LevelOption";
import {AppSession} from "../../../services/app-session.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {AppConstants} from "../../../services/app-constants.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {LevelOptionService} from "../../../services/course/level-option.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {Utils} from "../../../services/utils.service";

@Component({
  selector: 'app-level-options',
  templateUrl: './level-options.page.html',
  styleUrls: ['./level-options.page.scss'],
})
export class LevelOptionsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  userId:number = null;
  providerId:number = null;
  provider:Provider = null;
  levelOptions:LevelOption[] = null;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, public levelService:LevelOptionService,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils, private ionRouterOutlet:IonRouterOutlet,
              private alertCtrl:AlertController) {
    super(appSession, router, appConstants);

    super.l_checkUserId(true);
    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(!this.providerId || !this.userId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    this.updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    this.levelService.getLevelOptionsForUserId(this.providerId, this.userId, (results:LevelOption[]) => {
      this.levelOptions = results;
    });
  }

  onViewDetails(levelOption:LevelOption){
    console.log("Good onViewDetails.");
    if(!levelOption){
      return;
    }
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, levelOption:levelOption
      }
    };
    this.router.navigate(['level-option-edit', ], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  onCreateLevelOption(){
    let levelOption = new LevelOption();
    levelOption.providerId = this.providerId;
    levelOption.userId = this.userId;
    levelOption.name = null;
    levelOption.enabled = true;
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, levelOption:levelOption
      }
    };
    this.router.navigate(['level-option-edit'], navigationExtras);
  }

  onDelete(levelOption:LevelOption){
    if(!levelOption){
      return;
    }

    this.utils.showAlertConfirm(this.alertCtrl, "Delete level option?", null, null, "Cancel", null, "Delete",
      () => {
        const index = this.levelOptions.indexOf(levelOption, 0);
        if (index > -1) {
          this.levelOptions.splice(index, 1);
        }

        if(levelOption.id>0){
          this.levelService.deleteLevelOption(this.userId, levelOption.id, (result:boolean) => {
            if(result){
              this.toastUtil.showToast("Level deleted.");
              this.updatePageContent();
            }else{
              this.toastUtil.showToast("Delete Level failed!");
            }
          });
        }
      });
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Create'),
        handler: () => {
          console.log('Create clicked');
          this.onCreateLevelOption();
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
