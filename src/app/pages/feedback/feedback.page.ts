import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, AlertController, IonContent, NavController} from '@ionic/angular';
import {ToastUtil} from '../../services/toast-util.service';
import {Utils} from '../../services/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommentService} from '../../services/comment-service.service';
import {ProvidersService} from '../../services/providers-service.service';
import {TranslateUtil} from '../../services/translate-util.service';
import {AppSession} from '../../services/app-session.service';
import {AppConstants} from '../../services/app-constants.service';
import {BasicUserIdPage} from '../BasicUserIdPage';
import {NgForm} from '@angular/forms';
import {Feedback} from '../../models/Feedback';
import {UserService} from '../../services/user-service.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],

  providers: [
    CommentService,
  ],
})
export class FeedbackPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  submitted:boolean = false;
  feedback:Feedback = null;

  constructor(private toastUtil:ToastUtil, public utils:Utils, private route: ActivatedRoute, public router:Router,
              private actionsheetCtrl: ActionSheetController, public commentService:CommentService,private providerService:ProvidersService,
              public translateUtil:TranslateUtil, appSession:AppSession, public appConstants:AppConstants,
              private alertCtrl:AlertController, private navCtrl:NavController, public userService:UserService,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(false);

    this.l_reset();
  }

  ngOnInit() {
  }

  ionViewWillEnter(){

  }

  l_reset(){
    this.submitted = false;
    if(!this.feedback){
      this.feedback = new Feedback();
    }else{
      this.feedback.title = null;
      this.feedback.content = null;
    }
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  onSubmit(formRef){
    this.submitted = true;

    if(formRef.valid){
      this.feedback.userId = this.appSession.l_getUserId();
      this.feedback.createdDate = new Date();
      this.feedback.lastUpdatedDate = new Date();
      this.userService.s_sendFeedBack(this.feedback, (result:boolean) => {
        if(result){
          this.toastUtil.showToast(this.translateUtil.translateKey("FEEDBACK_SENT_MESG"));
        }
        this.l_reset();
        this.l_close();
      });
    }else{
      this.toastUtil.showToast(this.translateUtil.translateKey("FEEDBACK_SENT_FAILED"));
    }
  }

  onClose(){
    if(this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null,
          this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DISCARD'),
          (data) => {
            this.l_reset();
            this.l_close();
          });
    }else{
      this.l_reset();
      this.l_close();
    }
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

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('SEND'),
          handler: () => {
            console.log('To submit form.');
            if(!this.formRef){
              console.log("Can not find formRef!");
            }else{
              this.formRef.ngSubmit.emit("ngSubmit");
              console.log('Save clicked finished.');
            }
          }
        },
        // {
        //   text: this.translateUtil.translateKey("CANCEL"),
        //   // role: 'cancel', // will always sort to be on the bottom
        //   handler: () => {
        //     console.log('Cancel clicked');
        //   }
        // }
      ]
    });
    this.actionSheet.present();
  }
}
