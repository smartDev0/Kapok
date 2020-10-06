import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent, IonRouterOutlet,
  LoadingController,
  NavController,
  PopoverController
} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {AppSession} from "../../../services/app-session.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {AppConstants} from "../../../services/app-constants.service";
import {ImageService} from "../../../services/image-service.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {Utils} from "../../../services/utils.service";
import {NgForm} from "@angular/forms";
import {Provider} from "../../../models/Provider";
import {PayOptionType} from "../../../models/code/PayOptionType";
import {CodeTableService} from "../../../services/code-table-service.service";
import {ProviderContext} from "../../../models/transfer/ProviderContext";

@Component({
  selector: 'app-provider-edit',
  templateUrl: './provider-edit.page.html',
  styleUrls: ['./provider-edit.page.scss'],
})
export class ProviderEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;
  @ViewChild("formRef") formRef:NgForm;

  providerId:number = null;
  provider:Provider = null;
  submitted:boolean = false;
  callback:any;
  payOptions:PayOptionType[] = null;
  confirmedLeave:boolean;
  public phoneError:string = null;

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil, public alertCtrl:AlertController,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil, private imageService:ImageService,
              private actionsheetCtrl:ActionSheetController, private navCtrl:NavController, private popCtrl:PopoverController,
              private route: ActivatedRoute, public router:Router, public loadingCtrl: LoadingController, private codeTableService:CodeTableService,
              private ionRouterOutlet:IonRouterOutlet,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.submitted = false;

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.provider = this.router.getCurrentNavigation().extras.state.provider;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    // for creating new provider;
    if(this.provider){
      this.providerId = this.provider.id;

      if(!this.providerId){
        // only siteAdmin can create new provider;
        if(!this.appSession.l_isSiteAdmin()){
          this.toastUtil.showToastTranslate("Not an administrator!");
          this.router.navigate([this.appConstants.ROOT_PAGE]);
          return;
        }
      }else{
        this.l_getProvider();
      }
    }else{
      if(this.providerId){
        this.l_getProvider();
      }else{
        this.toastUtil.showToastTranslate("Can not find provider!");
        this.router.navigate([this.appConstants.ROOT_PAGE]);
        return;
      }
    }

    this.l_getPayOptions();
  }

  ionViewCanLeave(){
    if (this.formRef.dirty && !this.confirmedLeave) {
      this.onCancelPage();
      return false;
    }else{
      return true;
    }
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  l_getProvider(){
    this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
      this.provider = provider;
      if(this.provider){
        this.checkAccess();
      }else{
        this.toastUtil.showToast("Can not find provider by id: " + this.providerId);
      }
    });
  }

  l_getPayOptions(){
    this.codeTableService.getPayOptions((payOptions:PayOptionType[]) => {
      this.payOptions = payOptions;
    });
  }

  validatePhone(phone:string){
    if(!phone){
      return false;
    }
    if(!this.utils.phoneVailtion(phone)){
      this.phoneError = "Invalid phone number.";
      return false;
    }else{
      this.phoneError = null;
      return true;
    }
  }

  checkAccess(){
    this.appSession.checkProviderContext(false, this.providerId, (context:ProviderContext) => {
      if(this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin()){

      }else{
        this.toastUtil.showToastTranslate("Not an administrator!");
        this.router.navigate([this.appConstants.ROOT_PAGE]);
      }
    });
  }

  onDeleteTag(tag:string){
    console.log("Good onDeleteTag(tag), tag: " + tag);
    if(!tag || tag.trim().length===0 || !this.provider || !this.provider.tags){
      return;
    }
    let outTags = "";
    for(let extTag of this.utils.getTagListFromString(this.provider.tags)){
      if(extTag===tag){
        continue;
      }else{
        if(outTags.trim().length>0){
          outTags = outTags + "|";
        }
        outTags = outTags + extTag;
      }
    }
    this.provider.tags = outTags;
  }

  async onAddTag(){
    console.log("Good onAddTag().");

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey('Add Tag'),
      inputs: [
        {
          name: 'tag',
          label: this.translateUtil.translateKey('Tag'),
          type: 'text',
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
          text: this.translateUtil.translateKey('Enter'),
          handler: data => {
            let tag:string = data['tag'];
            if (tag && tag.trim().length>0 && this.provider) {
              tag = tag.trim();
              if(tag.trim().length>30){
                this.toastUtil.showToast("Tag must be less than 30 characters.");
                return;
              }
              if(tag.indexOf("|")>=0){
                this.toastUtil.showToast("Tag must not contain character '|'.");
                return;
              }

              if(!this.provider.tags){
                this.provider.tags = "";
              }
              this.provider.tags = this.provider.tags.trim();
              let tempTags = this.provider.tags;
              if(this.provider.tags.length>0 && !this.provider.tags.endsWith("|")){
                this.provider.tags = this.provider.tags + "|";
              }
              this.provider.tags = this.provider.tags + tag.trim();

              if(this.provider.tags.length>300){
                this.provider.tags = tempTags;
                this.toastUtil.showToast("Course tags total length must less than 300 characters.");
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }


  saveProvider(formRef:NgForm) {
    console.log("saveEvent called good.");
    this.submitted = true;

    // if(!this.validatePhone(this.provider.phone)){
    //   this.phoneError = "Invalid phone number.";
    //   this.toastUtil.showToastTranslate("Please fill in correct phone number.");
    //   return;
    // }else{
    //   this.phoneError = null;
    // }

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
    }else{
      this.providerService.s_saveProvider(this.appSession.l_getUserId(), this.provider, (savedProvider:Provider) => {
        this.confirmedLeave = true;
        this.provider = savedProvider;
        if(this.callback){
          this.callback();
        }
        this.onClose();
      });
    }
  }

  onCancelPage(){
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null,
        this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DISCARD'),
        (data) => {
          this.confirmedLeave = true;
          this.onClose();
        });
    }else{
      this.onClose();
    }
  }

  l_reset(){
    this.l_getProvider();
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

  onSave(){
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
            this.onSave();
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
