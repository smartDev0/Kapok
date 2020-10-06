import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, NavController} from "@ionic/angular";
import {Utils} from "../../../../services/utils.service";
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../../../services/app-constants.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {NgForm} from "@angular/forms";
import {ReportRequest} from "../../../../models/transfer/ReportRequest";
import {DateTimeUtils} from "../../../../services/date-time-utils.service";
import {ReportResponse} from "../../../../models/transfer/ReportResponse";

@Component({
  selector: 'app-registration-report',
  templateUrl: './registration-report.page.html',
  styleUrls: ['./registration-report.page.scss'],
})
export class RegistrationReportPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;
  @ViewChild("formRef") formRef:NgForm;

  public submitted:boolean = false;
  public callback:any = null;
  public providerId:number;
  public startTime:any;
  public endTime:any;
  public currentDateTime:any;
  public reportRequest:ReportRequest;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController,
              private alertCtrl:AlertController, private actionsheetCtrl:ActionSheetController,
              private dateTimeUtils:DateTimeUtils,) {
    super(appSession, router, appConstants);
    this.l_checkUserId(true);

    this.reportRequest = new ReportRequest();
    this.reportRequest.downloadReport = false;
    this.currentDateTime = this.dateTimeUtils.getCurrentLocalTime();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(!this.providerId || !this.appSession.l_getUserId()){
      this.toastUtil.showToastTranslate("Empty providerId or userId!");
      return;
    }
    this.reportRequest.providerId = this.providerId;
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  onClose() {
    this.navCtrl.pop();
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  generateReport(form:NgForm){
    if(!form){
      return;
    }
    this.submitted = true;
    if(form.invalid){
      console.log("form is invalide.");
      return;
    }else{
      this.l_generate();
    }
  }

  l_generate(){
    console.log("l_generate() generate report now.");
    this.providerService.s_generateProviderRegistrationReport(this.appSession.l_getUserId(), this.reportRequest, (response:ReportResponse) => {
      console.log("Got content back.");
      if(response && response.result){
        this.toastUtil.showToastTranslate("Report sent by email.");
      }else{
        this.toastUtil.showToastTranslate("No result found.");
      }
      if(this.reportRequest.downloadReport){
        if(response && response.fileContent && response.fileName){
          this.utils.downloadFile(response.fileName, response.fileContent);
        }else{
          console.log("Empty bytes content!");
        }
      }
    });
  }

  async openMenu() {
    let buttonList = [
      {
        text: this.translateUtil.translateKey('Generate Report'),
        handler: () => {
          console.log('To submit form.');
          if(!this.formRef){
            console.log("Can not find formRef!");
          }else{
            this.formRef.ngSubmit.emit("ngSubmit");
            console.log('Create clicked finished.');
          }
        }
      },
    ];

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttonList,
    });

    this.actionSheet.present();
  }
}
