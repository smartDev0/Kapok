import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  ModalController,
  NavController,
  Platform
} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {AppSession} from "../../../services/app-session.service";
import {AppConstants} from "../../../services/app-constants.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {Utils} from "../../../services/utils.service";
import {TranslateUtil} from "../../../services/translate-util.service";

@Component({
  selector: 'app-email-notification',
  templateUrl: './email-notification.page.html',
  styleUrls: ['./email-notification.page.scss'],

  providers: [
    SocialSharing,
  ],
})
export class EmailNotificationPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  submitted:boolean;

  userId:number;
  instructorId:number;
  @Input() providerId:number;

  @Input() courseId: number;
  @Input() courseRegistrationId: number;

  public notes:string;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public platform:Platform,
              private socialSharing: SocialSharing, private actionsheetCtrl:ActionSheetController,
              private modalController:ModalController, private alertCtrl:AlertController,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);
    this.userId = this.appSession.l_getUserId();
  }

  ngOnInit() {
    if(!this.userId){
      this.toastUtil.showToast("Please login first.");
      this.onClose();
      return;
    }

    if(!this.providerId){
      this.toastUtil.showToast("Empty providerId!");
      this.onClose();
      return;
    }else{
      this.instructorId = this.appSession.l_getInstructorId(this.providerId);
    }

    if(!this.courseId && !this.courseRegistrationId){
      this.toastUtil.showToast("CourseId and courseRegistrationId can not be both empty!");
      this.onClose();
      return;
    }
    if(this.courseId && this.courseRegistrationId){
      this.toastUtil.showToast("CourseId and courseRegistrationId can not be both non-empty!");
      this.onClose();
      return;
    }

    if(!this.providerId){
      this.toastUtil.showToast("providerId can not be empty!");
      this.onClose();
      return;
    }

  }

  ionViewWillEnter() {

  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  onSend(){
    console.log("Good onSend.");
    this.utils.showAlertConfirm(this.alertCtrl, "Send Email", "Are you sure to send out this email notification?", null,
      "Cancel", null, "Send", () => {
        console.log("Confirmed send!");
        this.providerService.sendEmailNotificationForCourseRegistration(this.userId, this.instructorId, this.providerId, this.courseRegistrationId, this.notes, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("Sent email successfully.");
          }else{
            this.toastUtil.showToast("Failed sending email!");
          }
          this.onClose();
        });
      });
  }

  onClose(){
    this.modalController.dismiss(null);
  }

  async openMenu() {
    let buttons:any = [];
    buttons.push(
      {
        text: this.translateUtil.translateKey('Send'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('Send clicked');
          this.onSend();
        },
      }
    );
    buttons.push(
      {
        text: this.translateUtil.translateKey('Cancel'),
        handler: () => {
          console.log('CLOSE clicked');
          this.onClose();
        }
      },
    );

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
