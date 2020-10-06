import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, IonContent, ModalController, NavController, Platform} from "@ionic/angular";
import {ProvidersService} from "../../../../../services/providers-service.service";
import {AppConstants} from "../../../../../services/app-constants.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppSession} from "../../../../../services/app-session.service";
import {ToastUtil} from "../../../../../services/toast-util.service";
import {TranslateUtil} from "../../../../../services/translate-util.service";
import {Utils} from "../../../../../services/utils.service";
import {ProviderCourseTypeWithDetails} from "../../../../../models/ProviderCourseTypeWithDetails";
import {BasicUserIdPage} from "../../../../BasicUserIdPage";
import {Course} from "../../../../../models/Course";
import {StudentUtil} from "../../../../../services/student-util.service";

import { File } from '@ionic-native/file/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ReportResponse} from '../../../../../models/transfer/ReportResponse';
import {Base64util} from '../../../../../services/base64util.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-course-summary',
  templateUrl: './course-summary.page.html',
  styleUrls: ['./course-summary.page.scss'],

  providers: [
    File,
    FileOpener,
    StudentUtil,
  ],
})
export class CourseSummaryPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  // These ids are for create course relationship to SkiEvent or SkiProvider;
  providerId:number = null;

  courseId:number = null;
  course:Course = null;
  disableModifyButtons:boolean = true;
  pcTypes:ProviderCourseTypeWithDetails[];
  pdfObj = null;

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, public platform:Platform, public studentUtil:StudentUtil,
              private modalController:ModalController, private actCtrl:ActionSheetController,
              private navCtrl:NavController, private file: File, private fileOpener: FileOpener, private base64Util:Base64util,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.courseId = this.router.getCurrentNavigation().extras.state.courseId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    this.updatePageContent();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    this.providerService.s_getCoursesDetailsById(this.courseId, (course:Course) => {
      this.course = course;
    });
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  async onCreatePdf() {
    let content = [];
    content = content.concat(
      [
        // course details;
        { text: 'Lesson ' + this.course.name, style: 'header' },
        { text: 'Location: ' + this.utils.formatEmpty(this.course.tripHillName) },
        { text: 'Creator: ' + this.utils.formatEmpty(this.course.instructorName) },
        { text: 'Class type: ' + this.course.providerCourseTypeName },
        { text: 'Learn type: ' + this.course.learnTypeName },
        { text: 'Is open: ' + this.utils.getYesNo(this.course.open)},
        { text: 'Deadline: ' + this.utils.formatEmpty(this.course.deadLine)},
        { text: 'Total limit: ' + this.utils.formatEmpty(this.course.totalStudentLimit)},
        { text: 'RegisterStudents limit: ' + this.utils.formatEmpty(this.course.registStudentLimit)},
        { text: 'Price: ' + this.utils.formatEmpty(this.course.unitPrice)},
        { text: 'Status: ' + this.course.statusName},
        { text: 'Description: ' + this.utils.stripHtmlTags(this.course.description)},
        // { text: this.utils.stripHtmlTags(this.course.description), style: 'story', margin: [0, 10, 0, 10] },
      ]
    );

    // instructors;
    if(this.course.instructors && this.course.instructors.length>0){
      content = content.concat(
        [
          { text: 'Instructors: ', style: 'header', margin: [0, 10, 0, 10] },
        ]
      );
      let insts = [];
      for(let instructor of this.course.instructors){
        insts.push(instructor.name);
      }
      content = content.concat(
        { ul: insts}
      );
    }

    // sessions;
    if(this.course.sessionTimes && this.course.sessionTimes.length>0){
      content = content.concat(
        [
          { text: 'Sessions: ', style: 'header', margin: [0, 10, 0, 10] },
        ]
      );
      let sess = [];
      for(let session of this.course.sessionTimes){
        sess.push("From: " + this.utils.formatDate(session.startTime) + " to " + this.utils.formatDate(session.endTime));
      }
      content = content.concat(
        { ul: sess}
      );
    }

    // registrations;
    if(this.course.registrations && this.course.registrations.length>0){
      content = content.concat(
        [
          { text: 'Registrations: ', style: 'header', margin: [0, 10, 0, 10] },
        ]
      );
      let sequence = 1;
      for(let regist of this.course.registrations){
        let newLine = (sequence===1?"":"\n");
        content.push(newLine + sequence + ". Registration: " + regist.title);
        content.push("Payment: " + this.utils.formatEmpty(regist.paymentStatusName));
        content.push("Email: " + this.utils.formatEmpty(regist.email));
        content.push("Phone: " + this.utils.formatEmpty(regist.phoneNumber));
        content.push("UserId: " + this.utils.formatEmpty(regist.userId));
        content.push("Member: " + this.utils.formatEmpty(regist.isMember));
        content.push("Comments: " + this.utils.formatEmpty(regist.comments));

        // students;
        let studentsStr = [];
        if(regist.students && regist.students.length>0){
          for(let student of regist.students){
            studentsStr.push("Student: " + student.name +
              ", age: " + student.levelOptionName +
              ", level: " + student.levelOptionName +
              ", student comments: " + this.utils.formatEmpty(student.comments)
            );
          }
          content = content.concat(
            { ul: studentsStr}
          );
        }
        sequence = sequence + 1;
      }
    }

    let docDefinition = {
      content: content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    };
    this.pdfObj = await pdfMake.createPdf(docDefinition);
  }

  async onDownloadPdf() {
    this.onCreatePdf();

    await this.platform.ready();

    if (this.platform.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        let blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'myFile.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myFile.pdf', 'application/pdf');
        });
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  writeFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

      fileWriter.onwriteend = function() {
        console.log("Successful file write...");
      };

      fileWriter.onerror = function (e) {
        console.log("Failed file write: " + e.toString());
      };

      // If data object is not passed in,
      // create a new Blob instead.
      if (!dataObj) {
        dataObj = new Blob(['some file data'], { type: 'text/plain' });
      }

      fileWriter.write(dataObj);
    });
  }

  downloadRegistrationSpreadsheet(){
    console.log("Good downloadRegistrationSpreadsheet.");
    this.l_generate();
  }

  l_generate(){
    console.log("l_generate() generate report now.");
    this.providerService.s_generateCourseRegistrationReport(this.appSession.l_getUserId(), this.courseId, (response:ReportResponse) => {
      console.log("Got content back.");
      if(response && response.result){
        this.toastUtil.showToastTranslate("Report generated.");
      }else{
        this.toastUtil.showToastTranslate("No result found.");
      }
      if(response && response.fileContent && response.fileName){
        this.downloadFile(response.fileName, response.fileContent);
      }else{
        console.log("Empty bytes content!");
      }
    });
  }

  downloadFile(fileName:string, fileContent:string){
    if(!fileName || !fileContent){
      return null;
    }

    let decoded = this.base64Util._base64ToArrayBuffer(fileContent);
    console.log('start download.');
    let blob = new Blob([decoded]);
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;  //"report.xlsx";

    setTimeout(
        () => {
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        },
        500
    );

    return true;
  }

  onClose(){
    this.navCtrl.pop();
  }

  async openMenu() {
    let buttons:any = [];
    if(this.appSession.l_isAdministrator(this.providerId) ||
      this.appSession.l_isSiteAdmin() ||
      (this.course.instructorId===this.appSession.l_getInstructorId(this.providerId))){
      buttons.push(
        {
          text: this.translateUtil.translateKey('Download PDF'),
          // role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Download PDF clicked');
            this.onDownloadPdf();
          },
        }
      );
      buttons.push(
        {
          text: this.translateUtil.translateKey('Download Registrations'),
          // role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Download spreadsheet clicked');
            this.downloadRegistrationSpreadsheet();
          },
        }
      );
    }
    buttons.push(
      {
        text: this.translateUtil.translateKey('CLOSE'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('CLOSE clicked');
          this.onClose();
        },
      }
    );

    this.actionSheet = await this.actCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
