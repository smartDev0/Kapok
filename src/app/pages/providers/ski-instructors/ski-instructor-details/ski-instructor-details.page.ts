import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {ActionSheetController, AlertController, IonContent, NavController, Platform,} from '@ionic/angular';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AppConstants} from "../../../../services/app-constants.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {InstructorWithDetails} from "../../../../models/InstructorWithDetails";
import {Provider} from '../../../../models/Provider';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-ski-instructor-details',
  templateUrl: './ski-instructor-details.page.html',
  styleUrls: ['./ski-instructor-details.page.scss'],

  providers: [
    SocialSharing,
  ],
})
export class SkiInstructorDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  userId:number = null;
  providerId:number = null;
  provider:Provider = null;
  instructorId:number = null;
  instructor:InstructorWithDetails = null;
  callback:any = null;
  disableModifyButtons:boolean = true;
  isFavorite:boolean = false;
  youtubeLinks:string[] = [];

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController,
              private actionsheetCtrl:ActionSheetController, private platform:Platform,
              private alertCtrl:AlertController, private socialSharing:SocialSharing,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(false);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.instructorId = this.router.getCurrentNavigation().extras.state.instructorId;
      }
    });
  }

  ngOnInit() {
    if(!this.providerId){
      this.providerId = parseInt(this.route.snapshot.paramMap.get('providerId'));
      this.instructorId = parseInt(this.route.snapshot.paramMap.get('instructorId'));
    }
  }

  ionViewWillEnter(){
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
        this.provider = provider;
      });
    }

    if(!this.instructorId){
      this.toastUtil.showToastTranslate("Empty instructorId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.checkFavorite();
    }
    console.log("SkiInstructorDetails.constructor, this.instructorId: " + this.instructorId);
    this.updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    console.log("updatePageContent, this.instructorId: " + this.instructorId);
    this.providerService.s_getSkiInstructorDetailsById(this.instructorId, (instructor:InstructorWithDetails) => {
      this.instructor = instructor;
      this.updateYoutubeLinks();
    });
  }

  updateYoutubeLinks(){
    this.youtubeLinks = [];
    if(!this.instructor || !this.instructor.youtubeLinks || this.instructor.youtubeLinks.length===0){
      return;
    }
    this.youtubeLinks = this.instructor.youtubeLinks.split(";");
  }

  checkFavorite(){
    if(!this.userId){
      this.isFavorite = false;
      return;
    }
    if(!this.instructorId){
      this.isFavorite = false;
      return;
    }
    this.providerService.s_checkFavoriteInstructor(this.userId, this.instructorId, (isFavorite:boolean) => {
      this.isFavorite = isFavorite;
    });
  }

  onAddFavorite(){
    console.log("Good onFavorite(): ");

    if(!this.userId){
      this.utils.showOkAlert(this.alertCtrl, "Please login first.", "If you don't have an account yet, please register one.");
      return;
    }
    if(!this.instructorId){
      return;
    }

    this.providerService.s_addFavoriteInstructor(this.userId, this.instructorId, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Instructor added to Favorites.");
      }
      this.checkFavorite();
    });
  }

  onRemoveFavorite(){
    console.log("Good onRemoveFavorite.");
    if(!this.userId){
      this.utils.showOkAlert(this.alertCtrl, "Please login first.", "If you don't have an account yet, please register one.");
      return;
    }
    if(!this.instructorId){
      return;
    }

    this.providerService.s_removeFavoriteInstructor(this.userId, this.instructorId, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Instructor removed from Favorites.");
      }
      this.checkFavorite();
    });
  }

  onShowComments(instructorId:number){
    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId,
        entityTypeId:this.appConstants.COMMENT_TYPE_INSTRUCTOR,
        entityId: instructorId,
        title: this.translateUtil.translateKey("Instructor's review"),
        showRate:true,
      }
    };
    this.router.navigate(['comments'], navigationExtras);
  }

  onViewMyCourses(instId:number){
    if(!instId){
      return;
    }

    let mountainId = -1;
    let navigationExtras: NavigationExtras = {
      state: {
        fromCommand:this.appConstants.PAGE_FOR_AVAILABLE, providerId:this.providerId,
        mountainId:mountainId, instructorId:instId
      }
    };
    this.router.navigate(['ski-courses', this.utils.getTime()], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  openPage(selection:string) {
    // let options = {enableBackdropDismiss: false};
    switch(selection){
      case "courses": {
        if(this.instructorId){
          let navigationExtras: NavigationExtras = {
            state: {
              fromCommand:this.appConstants.PAGE_FOR_INSTRUCTOR, providerId:this.instructor.providerId, instructorId:this.instructorId,
            }
          };
          this.router.navigate(['ski-courses', this.utils.getTime()], navigationExtras);
        }
        break;
      }
      default: {
        console.log("Unknown selection: " + selection);
        break;
      }
    }
  }

  onEdit() {
    let navigationExtras: NavigationExtras = {
      state: {
        instructorId:this.instructorId,
        providerId:this.providerId,
      }
    };
    this.router.navigate(['ski-instructor-edit'], navigationExtras);
  }

  onDelete(){
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Delete instructor?'), null, null,
      this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('Delete'),
      (data) => {
        this.l_delete();
      });
  }

  l_delete(){
    this.providerService.s_deleteInstructor(this.appSession.l_getUserId(), this.instructorId, (result:boolean) => {
      if(result){
        this.toastUtil.showToastTranslate("Instructor deleted.");
      }
      this.onClose();
    });
  }

  shareSheetShare() {
    if(!this.instructorId || !this.instructor){
      return;
    }

    let url = "https://www.kapok-tree.com/#/ski-instructor-details/" + this.providerId + "/" + this.instructorId;
    console.log("url: " + url);
    if(this.platform.is('cordova')){
      this.socialSharing.share("Instructor " + this.instructor.name, " details", null, url).then(() => {
        console.log("shareSheetShare: Success");
      }).catch(() => {
        console.error("shareSheetShare: failed");
      });
    }else{
      this.utils.showOkAlertForSharing(this.alertCtrl, "Sharing from browser", "If you are on browser, please copy and share the link below.", url);
    }
  }

  onClose(){
    this.navCtrl.pop();
  }

  public canEdit():boolean {
    return this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin();
  }

  async openMenu() {
    let buttons:any = [];

    buttons.push(
      {
        text: this.translateUtil.translateKey('Share'),
        handler: () => {
          console.log('Share clicked');
          this.shareSheetShare();
        },
      }
    );

    if(this.canEdit()){
      buttons.push(
        {
          text: this.translateUtil.translateKey('Edit'),
          handler: () => {
            console.log('Edit clicked');
            this.onEdit();
          },
        }
      );
      buttons.push(
        {
          text: this.translateUtil.translateKey('Delete'),
          handler: () => {
            console.log('Delete clicked');
            this.onDelete();
          },
        }
      );
    }

    buttons.push(
      {
        text: this.translateUtil.translateKey('Close'),
        handler: () => {
          console.log('Close clicked');
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
