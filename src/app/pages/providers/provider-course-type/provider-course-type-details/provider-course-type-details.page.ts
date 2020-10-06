import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, NavController} from "@ionic/angular";
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {NgForm} from "@angular/forms";
import {ProviderCourseTypeWithDetails} from "../../../../models/ProviderCourseTypeWithDetails";
import {CourseType} from "../../../../models/code/CourseType";
import {CodeTableService} from "../../../../services/code-table-service.service";

@Component({
  selector: 'app-provider-course-type-details',
  templateUrl: './provider-course-type-details.page.html',
  styleUrls: ['./provider-course-type-details.page.scss'],
})
export class ProviderCourseTypeDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  providerId:number;
  providerCourseType:ProviderCourseTypeWithDetails;
  submitted:boolean=false;
  callback:any;
  courseTypes:CourseType[];
  nameError:string

  constructor(public appSession:AppSession, public providersService:ProvidersService, public appConstants:AppConstants,
              public translateUtil:TranslateUtil, public toastUtil:ToastUtil, private codeTableService:CodeTableService,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, public router:Router,
              private navCtrl:NavController, public utils:Utils, private alertCtrl:AlertController,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.submitted = false;

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.providerCourseType = this.router.getCurrentNavigation().extras.state.providerCourseType;
      }
    });

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }

    this.codeTableService.getCourseType((types:CourseType[]) => {
      this.courseTypes = types;
    });
    this.updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){

  }

  onCancel() {
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null,
        this.translateUtil.translateKey('CANCEL'), null, this.translateUtil.translateKey('DISCARD'),
        (data) => {
          if(this.callback){
            this.callback();
          }
          this.l_reset();
          this.l_close();
        });
    }else{
      this.l_close();
    }
  }

  l_reset(){
  }

  l_close(){
    this.navCtrl.pop();
  }

  l_scrollToId(id:string):boolean{
    let element = document.getElementById(id);
    if(!element){
      return false;
    }
    let yOffset = document.getElementById(id).offsetTop;
    this.content.scrollToPoint(0, yOffset, 100);
    return true;
  }

  saveProviderCourseTypes(formRef:NgForm) {
    console.log("saveProviderCourseTypes called good.");
    let providerCourseTypes = [];
    providerCourseTypes.push(this.providerCourseType);
    this.providersService.s_saveProviderCourseTypes(this.appSession.l_getUserId(), this.providerId, providerCourseTypes, (result:boolean) => {
      if(result){
        this.toastUtil.showToastTranslate("Saved provider Class types successfully.");
      }else{
        this.toastUtil.showToastTranslate("Failed saving provider Class types!");
      }
      this.l_close();
    });
  }

  onSave(){
    this.submitted = true;
    this.nameError = null;
    if(!this.providerCourseType.name || this.providerCourseType.name.length==0){
      this.nameError =  this.translateUtil.translateKey("Name required");
      return;
    }else if(this.providerCourseType.name.length>200){
      this.nameError =  this.translateUtil.translateKey("Name maximum length is 200");
      return;
    }

    if(!this.formRef){
      console.log("Can not find formRef!");
    }else{
      if(this.formRef.valid){
        this.formRef.ngSubmit.emit("ngSubmit");
        console.log('Save clicked finished.');
      }else{
        console.log("form invalid!");
      }
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
        {
          text: this.translateUtil.translateKey('Cancel'),
          handler: () => {
            this.onCancel();
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
