import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController} from "@ionic/angular";
import {Provider} from "../../../models/Provider";
import {CoursePriceFormula} from "../../../models/payment/coursePayment/CoursePriceFormula";
import {AppSession} from "../../../services/app-session.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {AppConstants} from "../../../services/app-constants.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {CoursePriceFormulaService} from "../../../services/coursePayment/course-price-formula.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {Utils} from "../../../services/utils.service";
import {AgeRangeOption} from "../../../models/courseOptions/AgeRangeOption";
import {AgeRangeOptionService} from "../../../services/course/age-range-option.service";

@Component({
  selector: 'app-age-range-options',
  templateUrl: './age-range-options.page.html',
  styleUrls: ['./age-range-options.page.scss'],
})
export class AgeRangeOptionsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  userId:number = null;
  providerId:number = null;
  provider:Provider = null;
  ageRangeOptions:AgeRangeOption[] = null;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, public ageRangeService:AgeRangeOptionService,
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
    this.ageRangeService.getAgeRangeOptionsForUserId(this.providerId, this.userId, (results:AgeRangeOption[]) => {
      this.ageRangeOptions = results;
    });
  }

  onViewDetails(ageRangeOption:AgeRangeOption){
    console.log("Good onViewDetails.");
    if(!ageRangeOption){
      return;
    }
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, ageRangeOption:ageRangeOption
      }
    };
    this.router.navigate(['age-range-option-edit', ], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  onCreateAgeRangeOption(){
    let ageRangeOption = new AgeRangeOption();
    ageRangeOption.providerId = this.providerId;
    ageRangeOption.userId = this.userId;
    ageRangeOption.name = null;
    ageRangeOption.enabled = true;
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, ageRangeOption:ageRangeOption
      }
    };
    this.router.navigate(['age-range-option-edit'], navigationExtras);
  }

  onDelete(ageRangeOption:AgeRangeOption){
    if(!ageRangeOption){
      return;
    }

    this.utils.showAlertConfirm(this.alertCtrl, "Delete course ageRange option?", null, null, "Cancel", null, "Delete",
      () => {
        const index = this.ageRangeOptions.indexOf(ageRangeOption, 0);
        if (index > -1) {
          this.ageRangeOptions.splice(index, 1);
        }

        if(ageRangeOption.id>0){
          this.ageRangeService.deleteAgeRangeOption(this.userId, ageRangeOption.id, (result:boolean) => {
            if(result){
              this.toastUtil.showToast("AgeRange deleted.");
              this.updatePageContent();
            }else{
              this.toastUtil.showToast("Delete AgeRange failed!");
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
          this.onCreateAgeRangeOption();
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
