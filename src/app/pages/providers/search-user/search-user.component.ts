import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../BasicUserIdPage';
import {ActionSheetController, AlertController, IonContent, ModalController, NavController} from '@ionic/angular';
import {AppSession} from '../../../services/app-session.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {ToastUtil} from '../../../services/toast-util.service';
import {UserInfo} from '../../../models/UserInfo';
import {UserService} from '../../../services/user-service.service';
import {AppConstants} from '../../../services/app-constants.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from "@angular/forms";
import {SearchUserRequest} from "../../../models/transfer/SearchUserRequest";
import {SearchUserResponse} from "../../../models/transfer/SearchUserResponse";
import {AdminUserService} from "../../../services/admin/admin-user-service";

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss'],
})
export class SearchUserComponent extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  private searchRequest:SearchUserRequest = null;
  searchedUserList:UserInfo[];
  selectedUser:UserInfo;

  constructor(public appSession:AppSession, private navCtrl:NavController, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, private userService:UserService, private modalController:ModalController,
              public alertCtrl: AlertController, public toastUtil:ToastUtil, private actionsheetCtrl: ActionSheetController,
              private route: ActivatedRoute, public router:Router, private adminUserService:AdminUserService,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  onReset(){
    console.log("Good onReset().");
    this.searchedUserList = [];
    this.searchedUserList=[];
    this.searchRequest = null;
  }

  async showSearchUserPrompt(){
    console.log("Good onPopSearch().");
    this.onReset();

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Search user'),
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
        this.searchedUserList = this.searchedUserList.concat(users);
      }
    });
  }

  onSend() {
    this.modalController.dismiss(this.selectedUser);
  }

  onClose() {
    this.modalController.dismiss();
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
          text: this.translateUtil.translateKey('SEARCH_USER'),
          handler: () => {
            console.log('SEARCH clicked');
            this.showSearchUserPrompt();
          }
        },
        {
          text: this.translateUtil.translateKey('Choose'),
          handler: () => {
            console.log('Choose clicked');
            this.onSend();
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
