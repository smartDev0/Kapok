import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Student} from "../../../models/Student";
import {ActionSheetController, AlertController, IonContent, ModalController} from "@ionic/angular";
import {Utils} from "../../../services/utils.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {AppConstants} from '../../../services/app-constants.service';
import {AgeRangeOption} from "../../../models/courseOptions/AgeRangeOption";
import {LevelOption} from "../../../models/courseOptions/LevelOption";
import {ToastUtil} from "../../../services/toast-util.service";

@Component({
  selector: 'app-student-page',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
})
export class StudentPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;
  public submitted:boolean;

  @Input() enableLiftTicket:boolean;
  @Input() enableRental:boolean;
  @Input() student:Student;
  @Input() disableAgeLow:boolean;

  @Input() ageRangeOptions:AgeRangeOption[];
  @Input() levelOptions:LevelOption[];

  public currentDateStr:string;

  constructor(public translateUtil:TranslateUtil, public modalController: ModalController, public utils:Utils,
              private actionsheetCtrl: ActionSheetController, public alertCtrl:AlertController, public appConstants:AppConstants,
              private toastUtil:ToastUtil,) {
    this.submitted = false;
    this.currentDateStr = this.utils.formatDateShort(new Date());

    if(!this.student){
      this.student = new Student();
    }

    if(this.ageRangeOptions){
      this.ageRangeOptions.sort((s1:AgeRangeOption,s2:AgeRangeOption) => {
        return (s1.sequence-s2.sequence);
      });
    }

    if(this.levelOptions){
      this.levelOptions.sort((s1:LevelOption,s2:LevelOption) => {
        return (s1.sequence-s2.sequence);
      });
    }
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log("disableAgeLow is: " + this.disableAgeLow);
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  changedLevel(leveId){
    console.log("Good changedLevel(levelOption)");
    if(leveId && this.levelOptions){
      for(let level of this.levelOptions){
        if(level.id===leveId){
          this.student.levelOptionName = level.name;
          return;
        }
      }
    }
  }

  changedAge(ageId){
    console.log("Good changedLevel(levelOption)");
    if(ageId && this.ageRangeOptions){
      for(let age of this.ageRangeOptions){
        if(age.id===ageId){
          this.student.ageRangeOptionName = age.name;
          return;
        }
      }
    }
  }

  onCancel(){
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null,
        this.translateUtil.translateKey('CANCEL'), null,
        this.translateUtil.translateKey('DISCARD'),
        (data) => {
          this.onClose();
        }
      );
    }else{
      this.onClose();
    }
  }

  onClose(){
    this.modalController.dismiss();
  }

  onSend(formRef:NgForm) {
    this.submitted = true;
    if(!formRef.valid){
      console.log("formRef is not valid!");
    }else{
      if(this.student.useBirthDay && !this.student.birthDay){
        this.toastUtil.showToast("Please choose student birthday.");
        return;
      }
      if(!this.student.useBirthDay && !this.student.ageRangeOptionId){
        this.toastUtil.showToast("Please choose student age range.");
        return;
      }
      this.modalController.dismiss(this.student);
    }
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  l_save(){
    console.log('To submit form.');
    if(!this.formRef){
      console.log("Can not find formRef!");
    }else{
      this.formRef.ngSubmit.emit("ngSubmit");
      console.log('Save clicked finished.');
    }
  }

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            this.l_save();
          }
        },
        {
          text: this.translateUtil.translateKey('Cancel'),
          handler: () => {
            console.log('To cancel.');
            this.onCancel();
          }
        },
      ]
    });
    this.actionSheet.present();
  }

}
