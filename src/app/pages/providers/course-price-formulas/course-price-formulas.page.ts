import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController} from "@ionic/angular";
import {Provider} from "../../../models/Provider";
import {AppSession} from "../../../services/app-session.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {AppConstants} from "../../../services/app-constants.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {Utils} from "../../../services/utils.service";
import {CoursePriceFormula} from "../../../models/payment/coursePayment/CoursePriceFormula";
import {CoursePriceFormulaService} from "../../../services/coursePayment/course-price-formula.service";

@Component({
  selector: 'app-course-price-formulas',
  templateUrl: './course-price-formulas.page.html',
  styleUrls: ['./course-price-formulas.page.scss'],
})
export class CoursePriceFormulasPage  extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  userId:number = null;
  providerId:number = null;
  provider:Provider = null;
  coursePriceFormulas:CoursePriceFormula[] = null;

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, public coursePriceFormulaService:CoursePriceFormulaService,
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
    this.coursePriceFormulaService.getCoursePriceFormulasForUserId(this.providerId, this.userId, (results:CoursePriceFormula[]) => {
      this.coursePriceFormulas = results;
    });
  }

  onViewDetails(formula:CoursePriceFormula){
    console.log("Good onViewDetails, couponId: " + formula);
    if(!formula){
      return;
    }
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, coursePriceFormula:formula
      }
    };
    this.router.navigate(['course-price-formula-edit', ], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  onCreateCoursePriceFormula(){
    let formula = new CoursePriceFormula();
    formula.providerId = this.providerId;
    formula.userId = this.userId;
    formula.name = null;
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, coursePriceFormula:formula
      }
    };
    this.router.navigate(['course-price-formula-edit'], navigationExtras);
  }

  onDelete(formula:CoursePriceFormula){
    if(!formula){
      return;
    }

    this.utils.showAlertConfirm(this.alertCtrl, "Delete course price fomula?", null, null, "Cancel", null, "Delete",
      () => {
        if(!formula.id || formula.id<=0){
          const index = this.coursePriceFormulas.indexOf(formula, 0);
          if (index > -1) {
            this.coursePriceFormulas.splice(index, 1);
          }
        }
        this.coursePriceFormulaService.deleteCoursePriceFormula(this.userId, formula.id, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("Price formula deleted.");
            this.updatePageContent();
          }else{
            this.toastUtil.showToast("Delete formula failed!");
          }
        });
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
          this.onCreateCoursePriceFormula();
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
