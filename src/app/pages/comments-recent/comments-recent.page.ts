import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../BasicUserIdPage';
import {ActionSheetController, AlertController, IonContent, NavController} from '@ionic/angular';
import {ToastUtil} from '../../services/toast-util.service';
import {Utils} from '../../services/utils.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {CommentService} from '../../services/comment-service.service';
import {ProvidersService} from '../../services/providers-service.service';
import {TranslateUtil} from '../../services/translate-util.service';
import {AppSession} from '../../services/app-session.service';
import {AppConstants} from '../../services/app-constants.service';
import {CommentWithDetails} from '../../models/CommentWithDetails';
import * as moment from 'moment';

@Component({
  selector: 'app-comments-recent',
  templateUrl: './comments-recent.page.html',
  styleUrls: ['./comments-recent.page.scss'],

  providers: [
    CommentService,
  ],
})
export class CommentsRecentPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private actionSheet:any;
  private toWaitScroll:boolean = false;

  title:string = "Recent Comments";

  // These ids is for flag of which object type comments for;
  public userId;
  public callback:any;
  public comments:CommentWithDetails[];
  public startTime;
  public showTimeSelection = 1;
  public selections:{ id: number, name: string }[];

  public showSearchBar:boolean = false;
  public keyIndex:number = 0;
  public searchKey:string = null;

  constructor(private toastUtil:ToastUtil, public utils:Utils, private route: ActivatedRoute, public router:Router,
              private actionsheetCtrl: ActionSheetController, public commentService:CommentService,private providerService:ProvidersService,
              public translateUtil:TranslateUtil, appSession:AppSession, public appConstants:AppConstants,
              private alertCtrl:AlertController, private navCtrl:NavController,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(false);

    this.userId = this.appSession.l_getUserId();
    this.selections = [
      { "id": 1, "name": this.translateUtil.translateKey("1 day") },
      { "id": 2, "name": this.translateUtil.translateKey("1 week") },
      { "id": 3, "name": this.translateUtil.translateKey("1 month") },
      { "id": 4, "name": this.translateUtil.translateKey("3 months") },
      { "id": 5, "name": this.translateUtil.translateKey("6 months") },
      { "id": 6, "name": this.translateUtil.translateKey("1 year") }
    ];
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.searchKey = null;
    this.switchTime(this.showTimeSelection);
    this.updateComments();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updateComments(){
    if(!this.userId || !this.startTime){
      return;
    }
    this.commentService.s_getRecentCommentsForUserId(this.userId, this.startTime, (comments:CommentWithDetails[]) => {
      this.comments = comments;
      if(this.comments && this.comments.length>0){
        this.sortComments(this.comments);
      }
    });
  }

  switchTime(data){
    if(data==="1"){
      this.startTime = moment().subtract(1, 'days').toISOString();
    }else if(data==="2"){
      this.startTime = moment().subtract(7, 'days').toISOString();
    }else if(data==="3"){
      this.startTime = moment().subtract(1, 'months').toISOString();
    }else if(data==="4"){
      this.startTime = moment().subtract(3, 'months').toISOString();
    }else if(data==="5"){
      this.startTime = moment().subtract(6, 'months').toISOString();
    }else if(data==="6"){
      this.startTime = moment().subtract(12, 'months').toISOString();
    }
  }

  onselectionchange(){
    console.log("Good showTimeSelection: " + this.showTimeSelection);
    this.switchTime(this.showTimeSelection);
    this.updateComments();
  }


  toggleSearchBar(){
    this.showSearchBar = !this.showSearchBar;
    this.focusButton();
    //this.checkSearchBarTimeout();;
  }

  focusButton(){
    if(this.showSearchBar && this.search){
      setTimeout(() => {
        this.search.setFocus();
      }, 500);
    }
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

      for(let comment of this.comments) {
        if(comment.title && comment.title.toLowerCase().indexOf(val.toLowerCase()) > -1){
          comment.hide = false;
        }else if(comment.courseName && comment.courseName.toLowerCase().indexOf(val.toLowerCase()) > -1){
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
      this.searchKey = null;
      for(let comment of this.comments) {
        comment.hide = false;
      }
    }
    //this.checkSearchBarTimeout();;
  }

  async l_showPastPopUp(){
    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Select range'),
      inputs: [
        {
          type: 'radio',
          label: this.translateUtil.translateKey('One Month'),
          value: "1",
          checked: false
        },
        {
          type: 'radio',
          label: this.translateUtil.translateKey('Three Months'),
          value: "2",
          checked: false
        },
        {
          type: 'radio',
          label: this.translateUtil.translateKey('Six Months'),
          value: "3",
          checked: false
        },
        {
          type: 'radio',
          label: this.translateUtil.translateKey('One Year'),
          value: "4",
          checked: false
        },

      ],
      buttons: [
        {
          text: this.translateUtil.translateKey('CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey('Show'),
          handler: (data) => {
            console.log("Show clicked. data: " + data);
            if(data==="1"){
              this.startTime = moment().subtract(1, 'months').toISOString();
            }else if(data==="2"){
              this.startTime = moment().subtract(3, 'months').toISOString();
            }else if(data==="3"){
              this.startTime = moment().subtract(6, 'months').toISOString();
            }else if(data==="4"){
              this.startTime = moment().subtract(12, 'months').toISOString();
            }
            this.updateComments();
          }
        }
      ]
    });
    await alert.present();
  }

  isCourseComment(item){
    if(!item || !item.commentEntityTypeId || item.commentEntityTypeId!==this.appConstants.COMMENT_TYPE_COURSE){
      return false;
    }
    return true;
  }

  onViewCouse(item){
    if(!item || !item.entityId || item.commentEntityTypeId!==this.appConstants.COMMENT_TYPE_COURSE){
      return;
    }

    this.providerService.s_getProviderIdForCourseId(item.entityId, (providerId:number) => {
      if(!providerId || providerId<=0){
        return;
      }else{
        let navigationExtras: NavigationExtras = {
          state: {
            courseId:item.entityId, providerId:providerId
          }
        };
        this.router.navigate(['ski-course-details'], navigationExtras);
      }
    });
  }

  onViewThread(item:CommentWithDetails){
    console.log("Good onViewThread(item). item.id: " + (item?item.id:"null"));
    if(!item || !item.providerId || !item.id){
      return;
    }
    let navigationExtras: NavigationExtras = {
      state: {
          providerId:item.providerId,
          entityTypeId:item.commentEntityTypeId,
          entityId: item.entityId,
          title: this.translateUtil.translateKey("Comments"),
      }
    };
    this.router.navigate(['comments'], navigationExtras);
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

  closeModal() {
    this.navCtrl.pop();
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
    // if(!this.eventsService.eventComments){
    //   infiniteScroll.complete();
    //   return;
    // }

    // get pagination comments;
    // this.updateComments(false);

    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }

  async openMenu() {
    let buttonList = [];

    // buttonList.push(
    //   {
    //     text: this.translateUtil.translateKey('Select Range'),
    //     handler: () => {
    //       console.log('Home clicked.');
    //       this.l_showPastPopUp();
    //     },
    //   }
    // );
    buttonList.push(
        {
          text: this.translateUtil.translateKey('Home'),
          handler: () => {
            console.log('Home clicked.');
            this.router.navigate([this.appConstants.ROOT_PAGE]);
          },
        }
    );
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
