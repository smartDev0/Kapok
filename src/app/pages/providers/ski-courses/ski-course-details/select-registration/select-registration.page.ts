import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../../BasicUserIdPage";
import {ActionSheetController, IonContent, ModalController, NavController, Platform} from "@ionic/angular";
import {ProvidersService} from "../../../../../services/providers-service.service";
import {TranslateUtil} from "../../../../../services/translate-util.service";
import {ToastUtil} from "../../../../../services/toast-util.service";
import {Utils} from "../../../../../services/utils.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppSession} from "../../../../../services/app-session.service";
import {AppConstants} from "../../../../../services/app-constants.service";
import {CourseRegistration} from "../../../../../models/CourseRegistration";
import {ProviderContext} from "../../../../../models/transfer/ProviderContext";

@Component({
  selector: 'app-select-registration',
  templateUrl: './select-registration.page.html',
  styleUrls: ['./select-registration.page.scss'],
})
export class SelectRegistrationPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  providerId:number;
  courseTypeId:number;
  registrations:CourseRegistration[];
  selectedRegistration:CourseRegistration;
  callback:any;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, public platform:Platform,
              private modalController:ModalController, private actionsheetCtrl:ActionSheetController,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.courseTypeId = this.router.getCurrentNavigation().extras.state.courseTypeId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(!this.providerId){
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    this.appSession.checkProviderContext(false, this.providerId, (context:ProviderContext) => {
      if(context){
        if(!this.appSession.l_isInstructor(this.providerId) && !this.appSession.l_isSiteAdmin() && !this.appSession.l_isAdministrator(this.providerId)){
          return;
        }
        if(!this.appSession.l_getUserId() || !this.providerId){
          return;
        }
        this.selectedRegistration = null;

        let availableOnly:boolean = true;
        this.providerService.s_getCourseRegistrationsForProviderId(this.providerId, this.courseTypeId, availableOnly, true, (registrations:CourseRegistration[]) => {
          this.registrations = registrations;
        });
      }
    });
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  onClose() {
    this.modalController.dismiss();
  }

  onSelect() {
    this.modalController.dismiss(this.selectedRegistration);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Select'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('onSelect clicked');
          this.onSelect();
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
