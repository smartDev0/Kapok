import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet,
  NavController,
} from '@ionic/angular';
import {BasicUserIdPage} from '../../BasicUserIdPage';
import {Utils} from '../../../services/utils.service';
import {AppSession} from '../../../services/app-session.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {ToastUtil} from '../../../services/toast-util.service';
import {AppConstants} from '../../../services/app-constants.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfigureGroup} from '../../../models/admin/ConfigureGroup';
import {AppConfiguration} from '../../../models/admin/AppConfiguration';
import {NgForm} from '@angular/forms';
import {AdminConfigureService} from '../../../services/admin/admin-configure-service';
import {ConfigureEntry} from '../../../models/admin/ConfigureEntry';

@Component({
  selector: 'app-app-configuration',
  templateUrl: './app-configuration.page.html',
  styleUrls: ['./app-configuration.page.scss'],
})
export class AppConfigurationPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  @ViewChild("formRef") formRef:NgForm;

  submitted:boolean;
  appConfiguration:AppConfiguration;
  selectedConfGroup:ConfigureGroup;
  seletecEntry:ConfigureEntry;
  callback:any;

  constructor(public utils:Utils, private navCtrl: NavController,
              public alertCtrl: AlertController, appSession:AppSession,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil,
              public appConstants:AppConstants, public adminConfigureService:AdminConfigureService,
              private actionsheetCtrl: ActionSheetController, private ionRouterOutlet:IonRouterOutlet,
              private route: ActivatedRoute, public router:Router,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.submitted = false;
    this.updatePageContent();
  }

  ngOnInit() {
  }

  updatePageContent(){
    console.log("Good updatePageContent.");
    this.adminConfigureService.s_getAppConfiguration((appConfiguration:AppConfiguration) => {
      this.appConfiguration = appConfiguration;
    });
  }

  onSelect(grp:ConfigureGroup){
    this.selectedConfGroup = grp;
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
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

  onSelectEntry(configureEntry){
    console.log("Good onSelectEntry.");
    this.seletecEntry = configureEntry;
  }

  onPopupEntry(){
    if(!this.seletecEntry){
      return;
    }

  }

  onDeleteEntry(seletecdEntry){
    console.log("Good onDeleteEntry(seletecEntry).");
    if(!seletecdEntry || !seletecdEntry.name){
      return;
    }

    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete this entry?", null, null, "Cancel", null, "Delete",
        () => {
          if(!this.selectedConfGroup.entries || this.selectedConfGroup.entries.length===0){
            return;
          }
          for(let i = 0; i < this.selectedConfGroup.entries.length; i++) {
            let entry = this.selectedConfGroup.entries[i];
            if(entry.name===seletecdEntry.name){
              this.selectedConfGroup.entries.splice(i, 1);
            }
          }
        });
  }

  onAdd(){
    console.log("Good onAdd.");

    let entry = new ConfigureEntry();
    if(!this.selectedConfGroup.entries){
      this.selectedConfGroup.entries = [];
    }
    this.seletecEntry = entry;
    this.selectedConfGroup.entries.push(entry);
  }

  onSave(){
    console.log("Good onSave.");
    this.adminConfigureService.s_saveAppConfigure(this.appConfiguration, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Saved configuration successfully.");
      }else{
        this.toastUtil.showToast("Failed saving configuration.");
      }
      this.updatePageContent();
    });
  }

  async openMenu() {
    let buttons = [
      {
        text: this.translateUtil.translateKey('Add'),
        handler: () => {
          console.log('Add clicked.');
          this.onAdd();
        }
      },
      {
        text: this.translateUtil.translateKey('SAVE'),
        handler: () => {
          console.log('To submit form.');
          this.onSave();
        }
      },
      {
        text: this.translateUtil.translateKey('Cancel'),
        handler: () => {
          this.onClose();
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
