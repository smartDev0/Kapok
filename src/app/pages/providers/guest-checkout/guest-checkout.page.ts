import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CourseRegistration} from '../../../models/CourseRegistration';
import {NgForm} from '@angular/forms';
import {ActionSheetController, AlertController, IonContent, ModalController} from '@ionic/angular';
import {AppSession} from '../../../services/app-session.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {ToastUtil} from '../../../services/toast-util.service';
import {DateTimeUtils} from '../../../services/date-time-utils.service';
import {AppConstants} from '../../../services/app-constants.service';
import {Utils} from '../../../services/utils.service';

@Component({
  selector: 'app-guest-checkout',
  templateUrl: './guest-checkout.page.html',
  styleUrls: ['./guest-checkout.page.scss'],
})
export class GuestCheckoutPage {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef: NgForm;
  private actionSheet:any;

  @Input() registration: CourseRegistration;

  submitted:boolean = false;
  confirmEmail:string;
  confirmEmailError:string;
  phoneError:string = null;

  constructor(public appSession: AppSession, public translateUtil: TranslateUtil, public modalController: ModalController,
              public toastUtil: ToastUtil, private actionsheetCtrl: ActionSheetController,
              public dateTimeUtils: DateTimeUtils,
              public alertCtrl: AlertController, public appConstants: AppConstants, public utils: Utils,) {
  }

  onScrollUp() {
    setTimeout(
        () => {
          this.content.scrollToTop(300);
        },
        10
    );
  }

  validatePhone(phone:string){
    if(!phone){
      return false;
    }
    if(!this.utils.phoneVailtion(phone)){
      this.phoneError = this.translateUtil.translateKey("Invalid phone number.");
      return false;
    }else{
      this.phoneError = null;
      return true;
    }
  }

  checkConfirmEmail():boolean{
    if(!this.confirmEmail){
      this.confirmEmailError = this.translateUtil.translateKey("Confirm email can not be empty!");
      return false;
    }else if(this.confirmEmail!==this.registration.email){
      this.confirmEmailError = this.translateUtil.translateKey("Confirm email is not the same as email!");
      return false;
    }else{
      this.confirmEmailError = null;
      return true;
    }
  }

  ionViewDidEnter() {
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  addingStudent(formRef:NgForm){
    this.submitted = true;

    if(!this.checkConfirmEmail()){
      return;
    }

    if (!formRef.valid) {
      console.log("Not a valid formRef!");
      return;
    } else {
      this.modalController.dismiss(this.registration);
    }
  }

  onAddStudent() {
    console.log('To submit form.');
    this.submitted = true;

    if(!this.checkConfirmEmail()){
      return;
    }

    if(!this.validatePhone(this.registration.phoneNumber)){
      return;
    }

    if(!this.formRef){
      console.log("Can not find formRef!");
    }else{
      this.formRef.ngSubmit.emit("ngSubmit");
      console.log('Save clicked finished.');
    }
  }

  onClose(){
    this.modalController.dismiss(null);
  }

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            this.onAddStudent();
          }
        },
        {
          text: this.translateUtil.translateKey('Cancel'),
          handler: () => {
            console.log('To cancel.');
            this.onClose();
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
