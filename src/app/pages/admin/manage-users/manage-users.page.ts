import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController} from '@ionic/angular';
import {BasicUserIdPage} from '../../BasicUserIdPage';
import {Utils} from '../../../services/utils.service';
import {AppSession} from '../../../services/app-session.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {ToastUtil} from '../../../services/toast-util.service';
import {AppConstants} from '../../../services/app-constants.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {UserInfo} from '../../../models/UserInfo';
import {SearchUserRequest} from '../../../models/transfer/SearchUserRequest';
import {AdminUserService} from '../../../services/admin/admin-user-service';
import {SearchUserResponse} from '../../../models/transfer/SearchUserResponse';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
})
export class ManageUsersPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  public users:UserInfo[] = [];
  private selectedUserIds:number[] = [];
  public disableViewBtn = true;
  public disableDeleteBtn = true;
  //For cache request and re-search;
  private searchRequest:SearchUserRequest = null;
  public confirmedDelete:string="Delete";
  public confirmedDeleteData:string="DeleteData";

  constructor(public utils:Utils, private navCtrl: NavController,
              public alertCtrl: AlertController, appSession:AppSession,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              public appConstants:AppConstants, private adminUserService:AdminUserService,
              private actionsheetCtrl: ActionSheetController, private ionRouterOutlet:IonRouterOutlet,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.searchRequest = null;
    this.selectedUserIds = null;
  }

  ngOnInit() {
  }


  async onPopSearch(){
    console.log("Good onPopSearch().");
    this.onReset();

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Change image caption'),
      inputs: [
        {
          label: this.translateUtil.translateKey('UserId'),
          name: "userId",
          type: 'number',
          placeholder: 'userId',
          value: null,
        },
        {
          label: this.translateUtil.translateKey('Username'),
          name: "userName",
          type: 'text',
          placeholder: 'username',
          value: null,
        },
        {
          label: this.translateUtil.translateKey('Email'),
          name: "email",
          type: 'email',
          placeholder: 'email',
          value: null,
        },
      ],
      buttons: [
        {
          text: this.translateUtil.translateKey('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey('Search'),
          handler: (data) => {
            console.log("Search: " + data);
            let searchRequest = new SearchUserRequest();
            searchRequest.userId = data['userId'];
            searchRequest.userName = data['userName'];
            searchRequest.email = data['email'];
            searchRequest.start = 0;
            searchRequest.numberOnPage = 30;

            this.searchRequest = searchRequest;
            this.l_searchUsers();
          }
        }
      ]
    });
    await alert.present();
  }

  l_searchUsers(){
    // Search user;
    this.adminUserService.s_searchUsers(this.searchRequest, (response:SearchUserResponse) => {
      console.log("Returned back from search user service call.");
      if(response){
        let users:UserInfo[] = response.users;
        if(users){
          console.log("users.length: " + users.length);
        }
        this.users = this.users.concat(users);
      }
    });
  }

  updateCheckedList(user:UserInfo){
    console.log("Good updateCheckedList().");
    if(!user){
      return;
    }
    if(!this.selectedUserIds){
      this.selectedUserIds = [];
    }
    if(user.checked){
      console.log("user: " + user.id + " checked.");
      if(this.selectedUserIds.indexOf(user.id)<0){
        this.selectedUserIds.push(user.id);
      }
    }else{
      console.log("user: " + user.id + " unchecked.");
      let index = this.selectedUserIds.indexOf(user.id);
      if(index>=0){
        this.selectedUserIds.splice(index, 1);
      }
    }
    if(this.selectedUserIds.length===1){
      this.disableViewBtn = false;
    }else{
      this.disableViewBtn = true;
    }
    if(this.selectedUserIds.length>0){
      this.disableDeleteBtn = false;
    }else{
      this.disableDeleteBtn = true;
    }
    console.log("selectedUserIds.length: " + this.selectedUserIds.length);
  }

  onView(){
    console.log("Good onView().");
    if(!this.selectedUserIds || this.selectedUserIds.length!==1){
      return;
    }

    let navigationExtras: NavigationExtras = {
      state: {
        userId:this.selectedUserIds[0]
      }
    };
    this.router.navigate(['user-details'], navigationExtras);
  }

  async onDelete() {
    console.log("Good onDelete().");

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Change image caption'),
      inputs: [
        {
          label: 'Confirm by check',
          name: 'deleteUser',
          type: 'checkbox',
          id: 'checkbox',
          value: this.confirmedDelete,
          checked: false
        },
        {
          label: "Delete all users' data.",
          name: "deleteData",
          type: 'checkbox',
          id: "deleteData",
          value: String(this.confirmedDeleteData),
          checked: false
        },
      ],
      buttons: [
        {
          text: this.translateUtil.translateKey('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey('Delete'),
          handler: (data) => {
            console.log("data: " + data);
            if (data && data.indexOf(this.confirmedDelete) >= 0 && data.indexOf(this.confirmedDeleteData) >= 0) {
              this.l_deleteUsers();
            } else {
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  l_deleteUsers(){
    this.adminUserService.s_deleteUsersByIds(this.selectedUserIds, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Delete selected users successfully.");
      }else{
        this.toastUtil.showToast("Delete selected users failed.");
      }
      this.l_searchUsers();
    });
  }

  onReset(){
    console.log("Good onReset().");
    this.users = [];
    this.selectedUserIds=[];
    this.searchRequest = null;
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
    let buttons = [
      {
        text: this.translateUtil.translateKey('Search'),
        handler: () => {
          console.log('Search user.');
          this.onPopSearch();
        }
      },
      // {
      //   text: this.translateUtil.translateKey('Delete'),
      //   handler: () => {
      //     this.onDelete();
      //   }
      // },
      {
        text: this.translateUtil.translateKey('View'),
        handler: () => {
          this.onView();
        }
      },
      {
        text: this.translateUtil.translateKey('Reset'),
        handler: () => {
          this.onReset();
        }
      },
    ];

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons,
    });
    this.actionSheet.present();
  }
}
