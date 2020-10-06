import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet,
  NavController,
  Platform
} from "@ionic/angular";
import {ProvidersService} from "../../../services/providers-service.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {Utils} from "../../../services/utils.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppSession} from "../../../services/app-session.service";
import {AppConstants} from "../../../services/app-constants.service";
import {UserService} from "../../../services/user-service.service";
import {NgForm} from "@angular/forms";
import {CommentWithDetails} from "../../../models/CommentWithDetails";
import {CoursePaymentService} from "../../../services/coursePayment/course-payment-service.service";
import {InstructorWithDetails} from "../../../models/InstructorWithDetails";
import {CommentService} from "../../../services/comment-service.service";
import {ACLService} from "../../../services/aclservice.service";

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.page.html',
  styleUrls: ['./add-comment.page.scss'],

  providers: [
    CommentService,
  ],
})
export class AddCommentPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  @ViewChild("formRef") formRef:NgForm;

  public press:string;
  public providerId:number;
  public comment:CommentWithDetails;
  public submitted:boolean;
  public showRate:boolean;
  public rated:boolean;
  public rangeScore:number;
  public forName:string;

  public title:string = this.translateUtil.translateKey("Comment");


  constructor(public utils:Utils, private navCtrl: NavController, private platform:Platform,
              public alertCtrl: AlertController, appSession:AppSession, private coursePaymentService:CoursePaymentService,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, public commentService:CommentService,
              public appConstants:AppConstants, public providerService:ProvidersService, private ionRouterOutlet:IonRouterOutlet,
              private actionsheetCtrl: ActionSheetController, public userService:UserService, private aclService:ACLService,
              private route: ActivatedRoute, public router:Router,) {

    this.rated = false;
    this.showRate = false;
    this.title = "Add Comment";

    this.route.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.showRate = this.router.getCurrentNavigation().extras.state.showRate;
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;

        this.comment = this.router.getCurrentNavigation().extras.state.comment;
      }
    });
  }

  ngOnInit() {
    if(!this.providerId){
      this.press = this.route.snapshot.paramMap.get('press');
    }
  }

  ionViewWillEnter(){
    if(this.press && this.press.toLowerCase()!==":press".toLowerCase()){
      console.log("Processing press.");
      // decrypt press;
      this.aclService.s_getJSONFromPress(this.press, (json:string) => {
        if(!json){
          this.toastUtil.showToastTranslate("Can not process press parameter!");
          return;
        }else{
          this.comment = JSON.parse(json);
          this.showRate = this.comment.showRate;

          if(this.showRate){
            this.title = this.translateUtil.translateKey("Add Review");
          }

          this.forName = this.comment.courseName;
          let entityId:number = this.comment.commentEntityTypeId;
          let typeId:number = this.comment.entityId;
          let userId:number = this.comment.fromUserId;
          let typeNan = isNaN(entityId);
          let idNan = isNaN(entityId);
          this.providerId = this.comment.providerId;
          if(!entityId || entityId<1 || !typeId || typeId<1 || typeNan || idNan){
            this.toastUtil.showToastTranslate("Empty parameter!");
            return;
          }
          if(!this.providerId){
            this.toastUtil.showToast(this.translateUtil.translateKey("providerId is empty!"));
            this.router.navigate([this.appConstants.ROOT_PAGE]);
            return;
          }
        }
      });
    }else{
      if(this.showRate){
        this.title = this.translateUtil.translateKey("Add Review");
      }

      if(!this.providerId){
        this.toastUtil.showToast(this.translateUtil.translateKey("providerId is empty for request!"));
        this.router.navigate([this.appConstants.ROOT_PAGE]);
        return;
      }
    }

    if(this.comment && this.comment.entityId && this.comment.commentEntityTypeId===this.appConstants.COMMENT_TYPE_INSTRUCTOR){
      this.providerService.s_getSkiInstructorDetailsById(this.comment.entityId, (instructor:InstructorWithDetails) => {
        if(instructor){
          this.forName = "For instructor " + instructor.name;
        }
      });
    }
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  rateChanged(){
    this.rated = true;
    this.comment.score = this.rangeScore/10;
  }

  onCancel(){
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null,
        this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DISCARD'),
        (data) => {
          this.onClose();
        });
    }else{
      this.onClose();
    }
  }

  l_reset(){
    this.comment.providerId = this.providerId;
    this.comment.title = "";
    this.comment.comments = "";
    this.submitted = false;
    this.rangeScore = null;
  }

  onSend(formRef:NgForm) {
    if(!this.comment || !this.comment.commentEntityTypeId || !this.comment.entityId || (!this.comment.fromUserId && !this.comment.fromUserEmail)){
      this.onClose();
      return;
    }

    this.submitted = true;
    if(!formRef.valid){
      console.log("formRef is not valid!");
    }else{
      if(this.showRate && (!this.comment.score || this.comment.score<=1)){
        this.toastUtil.showToastTranslate("Please choose the score for this review.");
        return;
      }

      this.commentService.s_addCommentToEntity(this.comment.fromUserId, this.comment, (resultComment:CommentWithDetails) => {
        if(resultComment && resultComment.id>0){
          if(this.showRate){
            this.toastUtil.showToastTranslate("Review saved.");
          }else{
            this.toastUtil.showToastTranslate("Comment saved.");
          }
        }

        this.onClose();
        return;
      });
    }
  }

  onClose(){
    this.l_reset();
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
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

  onSaveComment(){
    if(this.utils.checkDebounce("AddCommentPage.onSaveComment")){
      console.log("onSaveComment debounced!");
      return;
    }

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
            console.log('To submit form.');
            this.onSaveComment();
          }
        },
        {
          text: this.translateUtil.translateKey('Cancel'),
          handler: () => {
            console.log('Cancel clicked.');
            this.onCancel();
          }
        },
        {
          text: this.translateUtil.translateKey('Home'),
          handler: () => {
            this.router.navigate([this.appConstants.ROOT_PAGE]);
          }
        }
      ]
    });
    this.actionSheet.present();
  }

}
