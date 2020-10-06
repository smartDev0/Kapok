import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet,
  NavController,
  Platform,
} from '@ionic/angular';
import {BasicUserIdPage} from '../BasicUserIdPage';
import {Provider} from '../../models/Provider';
import {CommentWithDetails} from '../../models/CommentWithDetails';
import {GeneralPaginationRequest} from '../../models/transfer/GeneralPaginationRequest';
import {ToastUtil} from '../../services/toast-util.service';
import {Utils} from '../../services/utils.service';
import {CommentService} from '../../services/comment-service.service';
import {ProvidersService} from '../../services/providers-service.service';
import {TranslateUtil} from '../../services/translate-util.service';
import {AppSession} from '../../services/app-session.service';
import {AppConstants} from '../../services/app-constants.service';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],

  providers: [
    SocialSharing,
    CommentService,
  ],
})
export class CommentsPage extends BasicUserIdPage{
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private myModal:any;
  private actionSheet:any;
  private toWaitScroll:boolean = false;

  title:string;

  // These ids is for flag of which object type comments for;
  public userId;
  public providerId;
  public provider:Provider = null;
  public entityTypeId = null;
  public entityId = null;
  commentsUpdated:boolean;
  callbackCalled:boolean; // only call callback once in instance;
  acceptComment:boolean = true;

  public comments:CommentWithDetails[];
  public commentRequest:GeneralPaginationRequest = null;
  public showRate:boolean = false;

  public showSearchBar:boolean = false;
  public keyIndex:number = 0;
  public searchKey:string = null;

  constructor(private toastUtil:ToastUtil, public utils:Utils, private route: ActivatedRoute, public router:Router,
              private actionsheetCtrl: ActionSheetController, public commentService:CommentService,private providerService:ProvidersService,
              public translateUtil:TranslateUtil, appSession:AppSession, public appConstants:AppConstants,
              private alertCtrl:AlertController, private navCtrl:NavController, private platform:Platform,
              private socialSharing:SocialSharing, private ionRouterOutlet:IonRouterOutlet,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(false);

    this.acceptComment = true;
    this.commentsUpdated = false;
    this.callbackCalled = false;
    this.userId = this.appSession.l_getUserId();
    this.commentRequest = new GeneralPaginationRequest(0, 100);

    this.route.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.state) {
        this.showRate = this.router.getCurrentNavigation().extras.state.showRate;
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;

        this.entityTypeId = this.router.getCurrentNavigation().extras.state.entityTypeId;
        this.entityId = this.router.getCurrentNavigation().extras.state.entityId;
        this.title = this.router.getCurrentNavigation().extras.state.title;
      }
    });
  }

  ionViewWillEnter(){
    this.searchKey = null;
    if(!this.providerId){
      this.toastUtil.showToast(this.translateUtil.translateKey("providerId is empty!"));
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
        this.provider = provider;
      });
    }

    if(!this.entityTypeId || !this.entityId){
      this.toastUtil.showToast(this.translateUtil.translateKey("Empty typeId or entityId!"));
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    if(this.entityTypeId!==this.appConstants.COMMENT_TYPE_PROVIDER &&
      this.entityTypeId!==this.appConstants.COMMENT_TYPE_INSTRUCTOR &&
      this.entityTypeId!==this.appConstants.COMMENT_TYPE_COURSE &&
      this.entityTypeId!==this.appConstants.COMMENT_TYPE_COURSE_REGISTRATION){
      this.toastUtil.showToast(this.translateUtil.translateKey("Unknown entityTypeId!"));
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    if(!this.title){
      this.title = this.translateUtil.translateKey("Comments");
    }

    /**
     * Must do the checkProviderContext to initialize provderContext for following pages access!!
     */
    this.appSession.checkProviderContext(true, this.providerId, null, null);

    this.updateComments();
  }

  updateComments(){
    this.commentRequest = new GeneralPaginationRequest(0, 100);
    // s_getCommentsByEntityTypeAndId(entityType:number, entityId:number, commentRequest:GeneralPaginationRequest, callback) {
    this.commentService.s_getCommentsByEntityTypeAndId(this.entityTypeId, this.entityId, this.commentRequest, (resultRequest:GeneralPaginationRequest) => {
      this.comments = [];
      this.commentRequest = resultRequest;
      if(this.commentRequest && this.commentRequest.results){
        this.comments = this.comments.concat(this.commentRequest.results);
      }

      this.sortComments(this.comments);
    });
  }

  ionViewWillLeave(){
    if(this.actionSheet){
      this.actionSheet.dismiss();
    }
  }

  focusButton(){
    if(this.showSearchBar && this.search){
      setTimeout(() => {
        this.search.setFocus();
      }, 500);
    }
  }

  isOwner(comment:CommentWithDetails):boolean{
    let userInfo = this.appSession.l_getUserInfo();
    if((comment.fromUserId && comment.fromUserId===this.userId) || this.appSession.l_isSiteAdmin() || this.appSession.l_isAdministrator(this.providerId)){
      return true;
    }
    return false;
  }

  onComment(){
    let options = {enableBackdropDismiss: false};
    console.log("good onComment().");
    let comment = new CommentWithDetails();
    comment.commentEntityTypeId = this.entityTypeId;
    comment.entityId = this.entityId;
    comment.providerId = this.providerId;
    comment.fromUserId = this.userId;

    let navigationExtras: NavigationExtras = {
      state: {
        providerId:this.providerId, comment:comment, showRate:this.showRate
      }
    };
    this.router.navigate(['add-comment'], navigationExtras);
  }

  sortComments(comments:CommentWithDetails[]){
    if(!comments || comments.length===0){
      return;
    }
    comments.sort((t1,t2) => {
      if(t1.lastUpdatedDate<t2.lastUpdatedDate){
        return 1;
      }else{
        return -1;
      }
    });
  }

  checkSearchBarTimeout(){
    this.keyIndex = this.keyIndex +1;
    setTimeout(
        (keyIndex) => {
          if(keyIndex===this.keyIndex){
            this.showSearchBar = false;
          }
        },
        this.appConstants.SEARCH_BAR_SHOW_DELAY,
        this.keyIndex
    );
  }

  toggleSearchBar(){
    this.showSearchBar = !this.showSearchBar;
    this.focusButton();
    //this.checkSearchBarTimeout();;
  }

  onClearSearch(){
    this.getItems(null);
    this.showSearchBar = false;
  }

  getItems(ev: any) {
    if(!this.comments){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;

      for(let comment of this.comments){
        if(comment.title && comment.title.toLowerCase().indexOf(val.toLowerCase()) > -1){
          comment.hide = false;
        }else if(comment.ownerUserName && comment.ownerUserName.toLowerCase().indexOf(val.toLowerCase()) > -1){
          comment.hide = false;
        }else if(comment.comments && comment.comments.toLowerCase().indexOf(val.toLowerCase()) > -1){
          comment.hide = false;
        }else{
          comment.hide = true;
        }
      }
    }else{
      for(let comment of this.comments){
        comment.hide = false;
      }
    }

    //this.checkSearchBarTimeout();;
  }

  onDelete(commentId:number){
    console.log("onDelete, commentId: " + commentId);
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DELETE_COMMENT'), null, null,
      this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DELETE'),
      (data) => {
        if(commentId>0){
          this.commentsUpdated = true;
          this.commentService.s_deleteComment(commentId, (result:boolean) => {
            if(result){
              this.toastUtil.showToast(this.translateUtil.translateKey('DELETE_COMMENT_OK'));
            }
            this.updateComments();
          });
        }
    });
  }

  closeModal() {
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onScrollUp(){
    console.log("onScrollUp().");
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  doInfinite(infiniteScroll) {
    // get pagination comments;
    this.updateComments();

    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }

  async onCreateCommentLink(){
    let email = null;
    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Create And Share Comment Link'),
      inputs: [
        {
          id: 'email',
          name: this.translateUtil.translateKey('Email'),
          type: 'text',
          placeholder: 'Share to email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey('Create'),
          handler: (data) => {
            if(data && data[0]){
              console.log("email: " + data[0]);
              let isValid:boolean = this.utils.emailValidation(data[0]);
              if(!isValid){
                this.toastUtil.showToastTranslate("Please enter valid email address and try again.");
                return;
              }else{
                console.log("Good email, continue.");
                let comment = new CommentWithDetails();
                comment.commentEntityTypeId = this.entityTypeId;
                comment.entityId = this.entityId;
                comment.providerId = this.providerId;
                comment.fromLink = true;
                comment.showRate = true;
                comment.fromUserEmail = data[0];
                this.commentService.s_createCommentLink(this.userId, comment, (commentLink:string) => {
                  if(commentLink){
                    console.log("commentLink: " + commentLink);
                    if(this.platform.is('cordova')){
                      this.socialSharing.share("Add review for instructor", "Sharing link to add instructor review", null, commentLink).then(() => {
                        console.log("shareSheetShare: Success");
                      }).catch(() => {
                        console.error("shareSheetShare: failed");
                      });
                    }else{
                      this.utils.showOkAlertForSharing(this.alertCtrl, "Sharing from browser", "If you are on browser, please copy and share the link below.", commentLink);
                    }
                  }
                });
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async openMenu() {
    let buttonList = [];
    if(this.acceptComment && this.userId && this.appSession.l_hasCurrentProviderAccount(this.providerId)){
      buttonList.push(
        {
          text: this.translateUtil.translateKey('Add comment'),
          handler: () => {
            console.log('COMMENT clicked');
            this.onComment();
          }
        });
    }

    if(this.acceptComment && this.userId && this.appSession.l_hasAboveInstructorAccess(this.providerId)){
      buttonList.push(
        {
          text: this.translateUtil.translateKey('Create Link'),
          handler: () => {
            console.log('Create Link');
            this.onCreateCommentLink();
          }
        });
    }
    // buttonList.push(
    //   {
    //     text: this.translateUtil.translateKey('Home'),
    //     handler: () => {
    //       console.log('Home clicked.');
    //       this.router.navigate([this.appConstants.ROOT_PAGE]);
    //     },
    //   }
    // );
    buttonList.push(
      {
        text: this.translateUtil.translateKey('CLOSE'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('CLOSE clicked');
          this.closeModal();
        }
      });

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttonList,
    });
    this.actionSheet.present();
  }
}
