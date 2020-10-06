import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../../BasicUserIdPage';
import {ActionSheetController, AlertController, IonContent, NavController,} from '@ionic/angular';
import {AppSession} from '../../../../services/app-session.service';
import {AppConstants} from '../../../../services/app-constants.service';
import {ToastUtil} from '../../../../services/toast-util.service';
import {ProvidersService} from '../../../../services/providers-service.service';
import {Utils} from '../../../../services/utils.service';
import {TranslateUtil} from '../../../../services/translate-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {TripHill} from '../../../../models/TripHill';
import {Mountain} from '../../../../models/Mountain';

@Component({
  selector: 'app-trip-hill',
  templateUrl: './trip-hill.page.html',
  styleUrls: ['./trip-hill.page.scss'],
})
export class TripHillPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  @ViewChild("formRef") formRef:NgForm;

  providerId:number = null;
  tripHillId:number = null;
  tripHill:TripHill = null;
  mountains:Mountain[] = null;
  submitted:boolean = false;
  inEdit = false;

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private actionsheetCtrl:ActionSheetController, private navCtrl:NavController, private alertCtrl:AlertController,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.tripHillId = this.router.getCurrentNavigation().extras.state.tripHillId;
        this.tripHill = this.router.getCurrentNavigation().extras.state.tripHill;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    if(this.tripHill){
      this.tripHillId = this.tripHill.id;
    }else if(this.tripHillId){
      this.updatePageContent();
    }else{
      return;
    }

    this.submitted = false;
    this.inEdit = false;
    this.l_getMountains();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    if(this.tripHillId){
      this.providerService.s_getTripHillById(this.tripHillId, (result:TripHill) => {
        this.tripHill = result;
      });
    }
  }

  l_getMountains(){
    this.providerService.s_getAllMountains(true, (mountains:Mountain[]) => {
      this.mountains = mountains;
    });
  }

  saveTripHill(formRef:NgForm) {
    console.log("saveTripHill called good.");
    if(!this.tripHill){
      return;
    }
    if(!this.tripHill.providerId){
      this.tripHill.providerId = this.providerId;
    }
    this.providerService.s_saveTripHill(this.appSession.l_getUserId(), this.tripHill, (result:TripHill) => {
      this.tripHill = result;
      this.l_close();
    });
  }


  onCancel() {
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null,
          this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DISCARD'),
          (data) => {
            this.l_reset();
            this.l_close();
          }
      );
    }else{
      // this.l_reset();
      this.l_close();
    }
  }

  l_reset(){
    this.updatePageContent();
  }

  l_close(){
    this.navCtrl.pop();
  }

  onScrollUp(){
    setTimeout(
        () => {
          this.content.scrollToTop(300);
        },
        10
    );
  }

  onSave(){
    if (!this.formRef) {
      console.log("Can not find formRef!");
    } else {
      this.formRef.ngSubmit.emit("ngSubmit");
      console.log('Save clicked finished.');
    }
  }

  async openMenu() {
    let buttons = [];
    buttons.push(
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            console.log('To submit form.');
            this.onSave();
          }
        }
    );

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
