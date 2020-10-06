import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  LoadingController,
  ModalController,
  NavController,
  Platform
} from '@ionic/angular';
import {TranslateUtil} from "../../../../services/translate-util.service";
import {Utils} from "../../../../services/utils.service";
import {NgForm} from "@angular/forms";
import {ToastUtil} from "../../../../services/toast-util.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {AppSession} from "../../../../services/app-session.service";
import {Question} from "../../../../models/userRelationship/Question";
import {AppConstants} from "../../../../services/app-constants.service";
import {Answer} from '../../../../models/userRelationship/Answer';
import {Camera} from '@ionic-native/camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {AttachedFileService} from "../../../../services/attached-file.service";
import {AttachedFile} from "../../../../models/AttachedFile";

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
  providers: [
    File, Camera,
  ]
})
export class CreateQuestionComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;
  public submitted:boolean;
  private userId:number;

  @Input() question:Question;

  // for first answer;
  answer:Answer;
  loading:any = null;
  isApp:boolean = true;
  loadCount:number = 0;

  currentPlatform;
  // files:any[] = [];
  videos = [];
  fileNames = [];
  allowedNumberOfVideos: number = 2;

  constructor(public translateUtil:TranslateUtil, public modalController: ModalController, public utils:Utils, private loadingCtrl:LoadingController,
              public alertCtrl:AlertController, private toastUtil:ToastUtil, private providerService:ProvidersService, private platform:Platform,
              public appSession:AppSession, public appConstants:AppConstants,private camera: Camera, private videoService:AttachedFileService,) {
    this.userId = this.appSession.l_getUserId();

    this.answer = new Answer();

    this.platform.ready().then((platformResult) => {
      console.log(platformResult);
      if (platformResult === ("dom" || 'browser')) {
        this.currentPlatform = 'browser';
        this.isApp = false;
      } else {
        this.currentPlatform = 'device';
        this.isApp = true;
      }
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
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
    this.question = null;
    this.answer = null;
    this.modalController.dismiss();
  }


  onSaveForm(formRef:NgForm) {
    this.submitted = true;
    if(!this.userId){
      this.utils.showOkAlert(this.alertCtrl, "Please login first.", "If you don't have an account yet, please register one.");
      return;
    }
    if(!this.question){
      this.toastUtil.showToast("Empty question!");
      return;
    }

    if(!formRef.valid){
      console.log("formRef is not valid!");
    }else{
      // this.modalController.dismiss(this.student);
      console.log("Save question here.");
      if(!this.question || !this.question.userId){
        this.toastUtil.showToast("Empty question!");
        return;
      }
      if(!this.question.providerId){
        this.toastUtil.showToast("Empty school for question!");
        return;
      }
      if(!this.question.title){
        this.toastUtil.showToast("Please fill in title.");
        return;
      }
      if(!this.question.userId){
        this.question.userId = this.userId;
      }
      if(!this.answer || !this.answer.content){
        this.toastUtil.showToast("Please enter content.");
        return;
      }

      this.providerService.s_saveQuestion(this.question.providerId, this.userId, this.question, (result:Question) => {
        if(result){
          this.toastUtil.showToast("Saved question successfully.");
          this.saveFirstAnswer(result.id);
        }else{
          this.toastUtil.showToast("Create question failed!");
          this.onClose();
        }
      });
    }
  }

  saveFirstAnswer(questionId:number){
    if(!this.answer || !this.answer.content){
      this.toastUtil.showToast("Please enter content.");
      return;
    }
    this.answer.userId = this.userId;
    this.answer.questionId = questionId;
    this.answer.createdDate = new Date();
    this.answer.lastUpdatedDate = new Date();
    this.providerService.s_saveAnswer(this.question.providerId, this.userId, this.answer, (resultAnswer:Answer) => {
      if(resultAnswer){
        this.toastUtil.showToast("Answer saved successfully.");
      }else{
        this.toastUtil.showToast("Save answer failed!");
        return;
      }

      if(this.videos && this.videos.length>0){
        this.videoUpload(resultAnswer);
      }else{
        this.onClose();
      }
    });
  }


  canAddVideo(){
    if(this.question && this.question.acceptVideo){
      return true;
    }
    return false;
  }

  videoChosen(e) {
    this.fileNames = [];
    this.videos = [];
    let reader = new FileReader();
    if(e.target.files && e.target.files.length>0){
      if(e.target.files.length > this.allowedNumberOfVideos){
        this.notAllowedToast();
        return;
      }

      for(let file of e.target.files){
        this.fileNames.push(file.name);

        reader.readAsDataURL(file);
        reader.onload = (ev: any) => {
          this.videos.push(ev.target.result);
        };
      }
    }
  }

  notAllowedToast() {
    this.toastUtil.showToast("Allowed only " + this.allowedNumberOfVideos + " videos to be selected at a time.");
  }


  deleteFile(index:number){
    console.log("Good deleteFile, index: " + index);
    if (index > -1) {
      this.fileNames.splice(index, 1);
      this.videos.splice(index, 1);
    }
  }

  nativeImagePicker() {
    this.choosePhotoLibrary();
  }

  async choosePhotoLibrary() {
    this.fileNames = [];
    this.videos = [];
    const options = {
      quality: 75,
      destinationType: this.camera.DestinationType.FILE_URI, // <== try THIS
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType:this.camera.MediaType.VIDEO
    };

    this.loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'crescent',
      duration: 2000
    });
    await this.loading.present();

    this.camera.getPicture(options).then((imageData) => {
      this.fileNames.push("testfilename.");
      this.videos.push(imageData);
    });
  }

  videoUpload(answer:Answer) {
    console.log("Good imageUpload().");
    this.showLoading();
    this.loadCount = 0;

    let answerId = answer.id;
    if(this.videos && this.videos.length>0){
      for(let i = 0; i < this.videos.length; i++) {
        let videoContent = this.videos[i];
        let fileName= this.fileNames[i];
        this.loadCount = this.loadCount + 1;
        let content = videoContent.split(',')[1];
        this.uploadVideoToServer(content, fileName, answerId);

        this.videos.splice(i, 1);
        this.fileNames.splice(i, 1);
      }
    }else{
      this.onClose();
    }
  }

  private uploadVideoToServer(base64Content:string, fileName:string, answerId:number){
    this.videoService.s_createVideoForAnswer(this.appSession.l_getUserId(), base64Content, fileName, answerId, (resultVideo:AttachedFile) => {
      this.loadCount = this.loadCount -1;
      if(this.loadCount<=0){
        if(resultVideo){
          this.toastUtil.showToast("Upload successfully.");
        }
        this.fileNames = [];
        this.videos = [];

        this.onClose();
        this.dismissLoading();
      }
    });

    // In case network connection is gone, release the page;
    this.appSession.subscribeNetwork((connected:boolean) => {
      if(!connected){
        console.log("Connection is gone, release page.");
        this.dismissLoading();
      }
    });
  }

  async showLoading(){
    if(!this.loading) {
      this.loading = await this.loadingCtrl.create({
        message: 'Loading...',
        spinner: 'crescent',
        duration: 2000
      });
    }
    await this.loading.present();
  }

  dismissLoading(){
    setTimeout(
      () => {
        if(this.loading){
          this.loading.dismiss();
        }
        this.loading = null;
      },
      500
    );
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
    console.log('To submit form.');
    if(!this.formRef){
      console.log("Can not find formRef!");
    }else{
      this.formRef.ngSubmit.emit("ngSubmit");
      console.log('Save clicked finished.');
    }
  }
}
