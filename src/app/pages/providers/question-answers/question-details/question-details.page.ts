import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent, IonRouterOutlet, LoadingController, NavController, Platform,
} from '@ionic/angular';
import {AppConstants} from "../../../../services/app-constants.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AppSession} from "../../../../services/app-session.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {Utils} from "../../../../services/utils.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {Answer} from "../../../../models/userRelationship/Answer";
import {Question} from "../../../../models/userRelationship/Question";
import { File } from '@ionic-native/file/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import {AttachedFileService} from "../../../../services/attached-file.service";
import {AttachedFile} from "../../../../models/AttachedFile";

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.page.html',
  styleUrls: ['./question-details.page.scss'],
  providers: [
    File, Camera,
  ]
})
export class QuestionDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  public userId:number;
  public questionId:number;
  public question:Question;
  public answers:Answer[];
  public replyContent:string;

  public questionContent:Answer;

  loading:any = null;
  isApp:boolean = true;
  loadCount:number = 0;

  currentPlatform;
  // files:any[] = [];
  videos = [];
  fileNames = [];
  allowedNumberOfVideos: number = 2;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil, private camera: Camera,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil, private loadingCtrl:LoadingController,
              private route: ActivatedRoute, public router:Router, private ionRouterOutlet:IonRouterOutlet, private platform:Platform,
              private actionsheetCtrl:ActionSheetController, private navCtrl:NavController, private videoService:AttachedFileService,
              private alertCtrl:AlertController, private file: File, private attachedFileService:AttachedFileService,) {
    super(appSession, router, appConstants);

    this.userId = this.appSession.l_getUserId();
    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.questionId = this.router.getCurrentNavigation().extras.state.questionId;
      }
    });

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
    if(!this.questionId){
      this.questionId = parseInt(this.route.snapshot.paramMap.get('questionId'));
    }
  }

  ionViewWillEnter() {
    if(!this.userId){
      this.userId = this.appSession.l_getUserId();
    }
    if(!this.questionId) {
      this.toastUtil.showToastTranslate("Empty questionId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    this.updateContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updateContent(){
    if(!this.questionId){
      return;
    }
    this.providerService.s_getQuestionById(this.questionId, (question:Question) => {
      if(question){
        this.question = question;
        this.providerService.s_getAnswersForQuestion(this.questionId, (answers:Answer[]) => {
          this.answers = answers;

          this.removeNonVideoAttachedFiles();

          if(!this.answers || this.answers.length===0){
            return;
          }
          this.questionContent = this.answers[0];
          this.answers.splice(0, 1);
        });
      }
    });
  }

  canDeleteVideo(answer:Answer){
    if(this.userId===answer.userId || this.appSession.l_isSiteAdmin()){
      return true;
    }
    return false;
  }

  deleteAttachedFile(fileId){
    console.log("Good deleteAttachedFile, fileId: " + fileId);
    if(!fileId){
      return;
    }
    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete the attached file?", null, null, "Cancel", null, "Delete", () => {
      this.attachedFileService.s_deleteCourseAttachedFile(this.userId, fileId, (result:boolean) => {
        if(result){
          this.toastUtil.showToast("Attached file deleted.");
        }
        this.updateContent();
      });
    });
  }

  removeNonVideoAttachedFiles(){
    if(!this.answers || this.answers.length===0){
      return;
    }
    for(let answer of this.answers){
      if(!answer.attachedFiles || answer.attachedFiles.length===0){
        continue;
      }
      for (let i = 0; i < answer.attachedFiles.length; i++) {
        let attachedFile = answer.attachedFiles[i];
        if(attachedFile.mediaType !== this.appConstants.MEDIA_VEDIO){
          answer.attachedFiles.splice(i, 1);
        }
      }
    }
  }

  canReply():boolean{
    if(this.userId>0){
      return true;
    }else{
      return false;
    }
  }

  enableUploadBtn(){
    if(this.videos && this.videos.length>0){
      return true;
    }
    return false;
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
        if(file.size>this.appConstants.MAX_UPLOAD_FILE_SIZE){
          this.utils.showOkAlert(this.alertCtrl, "File size limit is " + (this.appConstants.MAX_UPLOAD_FILE_SIZE/1000000) + "M", null);
          return;
        }

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

        this.dismissLoading();
        this.updateContent();
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

  reset(){
    this.replyContent = null;
  }

  getVideoURL(videoId:number){
    return this.videoService.s_getVideoURL(this.userId, videoId);
  }

  onReply(){
    if(!this.userId || this.userId<0){
      this.utils.showAlertConfirm(this.alertCtrl, "Please login first.", "Go to login page?", null, "Cancel", null, "Yes",
          (data) => {
            let backUrls:any[] = ["question-details", this.questionId];

            let navigationExtras: NavigationExtras = {
              state: {
                backUrls: backUrls,
              }
            };
            this.router.navigate(['login'], navigationExtras);
          });
      return;
    }

    console.log("Good onReply(), replyContent: " + this.replyContent);
    if(!this.replyContent || this.replyContent.length===0){
      this.toastUtil.showToast("Please enter content.");
      return;
    }

    let answer = new Answer();
    answer.userId = this.userId;
    answer.questionId = this.questionId;
    answer.content = this.replyContent;
    answer.createdDate = new Date();
    answer.lastUpdatedDate = new Date();
    this.providerService.s_saveAnswer(this.question.providerId, this.userId, answer, (resultAnswer:Answer) => {
      if(resultAnswer){
        this.toastUtil.showToast("Answer saved successfully.");
      }else{
        this.toastUtil.showToast("Save answer failed!");
        return;
      }

      if(this.videos && this.videos.length>0){
        this.videoUpload(resultAnswer);
      }else{
        this.updateContent();
      }
      this.reset();
    });
  }

  onClose(){
    this.reset();
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }
}
