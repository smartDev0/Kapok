import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../../BasicUserIdPage';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet,
  ModalController,
  NavController,
  Platform
} from '@ionic/angular';
import {AppSession} from '../../../../services/app-session.service';
import {AppConstants} from '../../../../services/app-constants.service';
import {ToastUtil} from '../../../../services/toast-util.service';
import {ProvidersService} from '../../../../services/providers-service.service';
import {Utils} from '../../../../services/utils.service';
import {TranslateUtil} from '../../../../services/translate-util.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {CodeTableService} from '../../../../services/code-table-service.service';
import {CourseUtil} from '../../../../services/course-util.service';
import {NgForm} from '@angular/forms';
import {TripHill} from '../../../../models/TripHill';
import {Course} from '../../../../models/Course';
import {ProviderCourseTypeWithDetails} from '../../../../models/ProviderCourseTypeWithDetails';
import {CourseStatus} from '../../../../models/code/CourseStatus';
import {LearnType} from '../../../../models/code/LearnType';
import {ProviderContext} from '../../../../models/transfer/ProviderContext';
import {DateTimeUtils} from '../../../../services/date-time-utils.service';
import * as moment from 'moment';
import {Provider} from '../../../../models/Provider';
import {CoursePriceFormula} from "../../../../models/payment/coursePayment/CoursePriceFormula";
import {CoursePriceFormulaService} from "../../../../services/coursePayment/course-price-formula.service";
import {AgeRangeOption} from "../../../../models/courseOptions/AgeRangeOption";
import {LevelOption} from "../../../../models/courseOptions/LevelOption";
import {AgeRangeOptionService} from "../../../../services/course/age-range-option.service";
import {LevelOptionService} from "../../../../services/course/level-option.service";

@Component({
  selector: 'app-ski-course-edit',
  templateUrl: './ski-course-edit.page.html',
  styleUrls: ['./ski-course-edit.page.scss'],
})
export class SkiCourseEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  userId:number;
  providerId:number;
  provider:Provider;
  tripHills:TripHill[];
  courseId:number;
  course:Course;
  targetDate:any;
  startTime:any;
  endTime:any;
  endTimeError:string;
  submitted:boolean;
  callback:any;
  formChanged:boolean = false;
  currentDateTime:string;
  providerCourseTypes:ProviderCourseTypeWithDetails[];
  courseStatuses:CourseStatus[];
  learnTypes:LearnType[];
  confirmedLeave:boolean;
  youtubeLinks:string[];
  deadlineError:string;

  priceFormulaExpended:boolean = false;

  groupPCType:ProviderCourseTypeWithDetails;

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public platform:Platform,
              private actionsheetCtrl:ActionSheetController, public dateTimeUtils:DateTimeUtils,
              private codeTableService:CodeTableService, private courseUtil:CourseUtil, private ionRouterOutlet:IonRouterOutlet,
              private alertCtrl:AlertController, private coursePriceFormulaService:CoursePriceFormulaService,
              private modalController:ModalController, private ageRangeService:AgeRangeOptionService, private levelService:LevelOptionService) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if(this.router.getCurrentNavigation()&& this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.courseId = this.router.getCurrentNavigation().extras.state.courseId;
        this.course = this.router.getCurrentNavigation().extras.state.course;
      }
    });

  }

  ngOnInit() {
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.providerService.s_getProviderById(this.providerId, (provider:Provider) => {
        this.provider = provider;
      });
    }

    this.appSession.checkProviderContext(false, this.providerId, (context:ProviderContext) => {
      if(context){
        this.currentDateTime = this.dateTimeUtils.getCurrentLocalTime();
        this.formChanged = false;
        if(!this.appSession.l_isInstructor(this.providerId)){
          this.toastUtil.showToastTranslate("Instructor only!");
          this.router.navigate([this.appConstants.ROOT_PAGE]);
          return;
        }

        if(this.appSession.l_getUserId()){
          this.providerService.s_getTripHillsForProviderId(this.appSession.l_getUserId(), this.providerId, (hills:TripHill[]) => {
            this.tripHills = hills;
          });
        }

        this.l_getTypes();
      }
    });
  }

  ionViewWillEnter() {
    if(this.courseId){
      this.l_updateSkiCourseById();
    }else if(this.course){
      this.courseId = this.course.id;
      // this.course.courseTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.course.courseTime);
      // this.course.deadLine = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.course.deadLine);
      this.updateYoutubeLinks();
      this.sortAgeRanges();
      this.sortLevels();
    }
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updateYoutubeLinks(){
    if(!this.course || !this.course.youtubeLinks || this.course.youtubeLinks.length===0){
      return;
    }
    this.youtubeLinks = this.course.youtubeLinks.split(";");
  }

  l_getTypes(){
    this.providerService.s_getProviderCourseTypesByProviderId(this.providerId, true, (pcTypes:ProviderCourseTypeWithDetails[]) => {
      this.providerCourseTypes = [];
      if(pcTypes && pcTypes.length>0){
        for(let pcType of pcTypes){
          if(pcType.courseTypeCodeId===this.appConstants.CODE_COURSE_GROUP){
            this.groupPCType = pcType;
          }
          if(pcType.enabled){
            if(pcType.courseTypeCodeId===this.appConstants.CODE_COURSE_GROUP){
              if(!this.appSession.l_isAdministrator(this.providerId) && !this.appSession.l_isSiteAdmin()){
                continue;
              }
            }
            this.providerCourseTypes.push(pcType);
          }
        }
      }
      if(!this.groupPCType){
        this.toastUtil.showToast("Can not find group lesson type!");
        return;
      }
    });
    this.codeTableService.getCourseStatus((courseStatuses:CourseStatus[]) => {
      this.courseStatuses = courseStatuses;
    });
    this.codeTableService.getLearnType((learnTypes:LearnType[]) => {
      this.learnTypes = learnTypes;
    });
  }

  courseTypeChanged(){
    console.log("Good courseTypeChanged().");
  }

  onTogglePriceFormula(){
    this.priceFormulaExpended = !this.priceFormulaExpended;
  }

  onChangedUseAgeOption(useAgeOption:boolean){
    if(useAgeOption){
      this.course.useAgeOption = true;
      this.course.useBirthDayOption = false;
    }else{
      this.course.useAgeOption = false;
    }
  }

  onChangedUseBirthDayOption(useBirthDayOption:boolean){
    if(useBirthDayOption){
      this.course.useBirthDayOption = true;
      this.course.useAgeOption = false;
    }else{
      this.course.useBirthDayOption = false;
    }
  }

  async onAddPriceFormula(){
    console.log("Good onAddPriceFormula().");
    this.coursePriceFormulaService.getCoursePriceFormulasForUserId(this.providerId, this.userId, (formulas:CoursePriceFormula[]) => {
      this.onPupUpSelectFormulas(formulas);
    });
  }

  async onPupUpSelectFormulas(formulas:CoursePriceFormula[]){
    if(!formulas || formulas.length===0){
      this.toastUtil.showToast("No price formula available. Create one first.");
      return;
    }

    let inputs:any[] = [];
    for(let formula of formulas){
      // if not exist in existing availableTripHills;
      let notExist = true;
      if(this.course.priceFormulas){
        for(let existFormula of this.course.priceFormulas){
          if(existFormula.id===formula.id){
            notExist = false;
            break;
          }
        }
      }
      if(notExist){
        inputs.push({
          type: 'checkbox',
          label: formula.name,
          value: formula,
          checked: false
        });
      }
    }

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey("Choose Price Formulas"),
      subHeader: "Please remember to save course.",
      inputs: inputs,
      buttons: [
        {
          text: this.translateUtil.translateKey("CANCEL"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey("CHOOSE"),
          handler: data => {
            if(!this.course.priceFormulas){
              this.course.priceFormulas = [];
            }
            for(let formula of data){
              if(this.course.priceFormulas.indexOf(formula)<0){
                this.course.priceFormulas.push(formula);
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  onAddNewPriceFormula(){
    console.log("Good onAddNewPriceFormula().");
    this.utils.showAlertConfirm(this.alertCtrl, "You will lose unsaved change, continue?", null, null, "Cancel", null, "Continue", () => {
      let formula = new CoursePriceFormula();
      formula.providerId = this.providerId;
      formula.userId = this.userId;
      formula.name = null;
      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.providerId, coursePriceFormula:formula
        }
      };
      this.router.navigate(['course-price-formula-edit'], navigationExtras);
    });
  }

  onViewPriceFormula(priceFormula){
    console.log("Good onViewPriceFormula(priceFormula).");
    if(!priceFormula){
      return;
    }
    this.utils.showAlertConfirm(this.alertCtrl, "You will lose unsaved change, continue?", null, null, "Cancel", null, "Continue", () => {
      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.providerId, coursePriceFormula:priceFormula
        }
      };
      this.router.navigate(['course-price-formula-edit'], navigationExtras);
    });
  }

  onDeletePriceFormula(priceFormula){
    console.log("Good onDeletePriceFormula(priceFormula).");
    if(!priceFormula || !this.course.priceFormulas || this.course.priceFormulas.length===0){
      return;
    }

    this.utils.showAlertConfirm(this.alertCtrl, "Delete this price formula?", null, null, "Cancel", null, "Delete", () => {
      this.course.priceFormulas.splice(this.course.priceFormulas.indexOf(priceFormula), 1);

      if(priceFormula.id>0){
        this.coursePriceFormulaService.deleteCoursePriceFormulaForCourse(this.userId, this.courseId, priceFormula.id, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("PriceFormula deleted from course.");
          }else{
            this.toastUtil.showToast("Delete priceformula failed!");
          }
        });
      }
    });

  }

  deleteCourseTime(){
    if(this.course){
      this.course.courseTime=null;
    }
  }

  onDeleteTag(tag:string){
    console.log("Good onDeleteTag(tag), tag: " + tag);
    if(!tag || tag.trim().length===0 || !this.course || !this.course.tags){
      return;
    }
    let outTags = "";
    for(let extTag of this.utils.getTagListFromString(this.course.tags)){
      if(extTag===tag){
        continue;
      }else{
        if(outTags.trim().length>0){
          outTags = outTags + "|";
        }
        outTags = outTags + extTag;
      }
    }
    this.course.tags = outTags;
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
            if (tag && tag.trim().length>0 && this.course) {
              tag = tag.trim();
              if(tag.trim().length>30){
                this.toastUtil.showToast("Tag must be less than 30 characters.");
                return;
              }
              if(tag.indexOf("|")>=0){
                this.toastUtil.showToast("Tag must not contain character '|'.");
                return;
              }

              if(!this.course.tags){
                this.course.tags = "";
              }
              this.course.tags = this.course.tags.trim();
              let tempTags = this.course.tags;
              if(this.course.tags.length>0 && !this.course.tags.endsWith("|")){
                this.course.tags = this.course.tags + "|";
              }
              this.course.tags = this.course.tags + tag.trim();

              if(this.course.tags.length>300){
                this.course.tags = tempTags;
                this.toastUtil.showToast("Course tags total length must less than 300 characters.");
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async addYoutubeLink(){
    this.utils.addYoutubeLink(this.alertCtrl, this.translateUtil, this.toastUtil, this.youtubeLinks, (youtubeLinks:string[]) => {
      this.mergeLinksToInsructor(youtubeLinks);
    });
  }

  deleteYoutubeLink(link:string){
    if(!link || link.trim().length===0 || this.youtubeLinks==null || this.youtubeLinks.length===0){
      return;
    }
    let deleted:boolean = false;
    let tempLinks:string[] = [];

    for (let i = 0; i < this.youtubeLinks.length; i++) {
      if(this.youtubeLinks[i] === link){
        deleted = true;
        continue;
      }else{
        tempLinks.push(link);
      }
    }
    this.youtubeLinks = tempLinks;
    this.mergeLinksToInsructor(this.youtubeLinks);
  }

  mergeLinksToInsructor(youtubeLinks:string[]){
    this.youtubeLinks = youtubeLinks;
    this.course.youtubeLinks = null;
    if(this.youtubeLinks && this.youtubeLinks.length>0){
      for (let i = 0; i < this.youtubeLinks.length; i++) {
        if(i===0){
          this.course.youtubeLinks = this.youtubeLinks[i];
        }else{
          this.course.youtubeLinks = this.course.youtubeLinks + ";" + this.youtubeLinks[i];
        }
      }
    }
  }

  onAddCourseAgeOptions(){
    console.log('Good onAddCourseAgeOptions().');

    this.ageRangeService.getAgeRangeOptionsForUserId(this.providerId, this.userId, (ageRangeOptions:AgeRangeOption[]) => {
      this.onPupUpSelectAgeRanges(ageRangeOptions);
    });
  }

  async onPupUpSelectAgeRanges(ageRangeOptions:AgeRangeOption[]){
    if(!ageRangeOptions || ageRangeOptions.length===0){
      this.toastUtil.showToast("No age range option available. Create new customized first.");
      return;
    }

    let inputs:any[] = [];
    for(let ageRangeOption of ageRangeOptions){
      // if not exist in existing availableTripHills;
      let notExist = true;
      if(this.course.ageRangeOptions){
        for(let existAge of this.course.ageRangeOptions){
          if(existAge.id===ageRangeOption.id){
            notExist = false;
            break;
          }
        }
      }
      if(notExist){
        inputs.push({
          type: 'checkbox',
          label: ageRangeOption.name,
          value: ageRangeOption,
          checked: false
        });
      }
    }

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey("Choose Price Formulas"),
      subHeader: "Please save course after.",
      inputs: inputs,
      buttons: [
        {
          text: this.translateUtil.translateKey("CANCEL"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey("CHOOSE"),
          handler: data => {
            if(!this.course.ageRangeOptions){
              this.course.ageRangeOptions = [];
            }
            for(let ageRangeOption of data){
              if(this.course.ageRangeOptions.indexOf(ageRangeOption)<0){
                this.course.ageRangeOptions.push(ageRangeOption);
              }
            }
            this.sortAgeRanges();
          }
        }
      ]
    });
    await alert.present();
  }

  public sortAgeRanges() {
    if (this.course && this.course.ageRangeOptions) {
      this.course.ageRangeOptions.sort((s1: AgeRangeOption, s2: AgeRangeOption) => {
        return (s1.sequence - s2.sequence);
      });
    }
  }

  public sortLevels(){
    if(this.course && this.course.levelOptions){
      this.course.levelOptions.sort((s1:LevelOption,s2:LevelOption) => {
        return (s1.sequence-s2.sequence);
      });
    }
  }

  async onEditAgeOption(ageRangeOption:AgeRangeOption){
    console.log("Good onEditAgeOption.");
    if(!ageRangeOption){
      return;
    }
    this.utils.showAlertConfirm(this.alertCtrl, "You will lose unsaved change, continue?", null, null, "Cancel", null, "Continue", () => {
      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.providerId, ageRangeOption:ageRangeOption
        }
      };
      this.router.navigate(['age-range-option-edit'], navigationExtras);
    });
  }

  onDeleteCourseAgeOption(ageOption:AgeRangeOption){
    console.log("Good onDeleteAgeOption.");
    if(!ageOption || !this.course.ageRangeOptions || this.course.ageRangeOptions.length===0){
      return;
    }

    this.utils.showAlertConfirm(this.alertCtrl, "Delete this age range?", null, null, "Cancel", null, "Delete", () => {
      this.course.ageRangeOptions.splice(this.course.ageRangeOptions.indexOf(ageOption), 1);
      if(ageOption.id>=0){
        this.ageRangeService.deleteAgeRangeOptionForCourse(this.userId, this.courseId, ageOption.id, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("Age option deleted.");
          }else{
            this.toastUtil.showToast("Delete option failed!");
          }
        });
      }
    });
  }

  async onCreateNewAgeOption(){
    console.log("Good onAddAgeOption.");
    this.utils.showAlertConfirm(this.alertCtrl, "You will lose unsaved change, continue?", null, null, "Cancel", null, "Continue", () => {
      let ageRangeOption = new AgeRangeOption();
      ageRangeOption.providerId = this.providerId;
      ageRangeOption.userId = this.userId;
      ageRangeOption.name = null;
      ageRangeOption.enabled = true;
      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.providerId, ageRangeOption:ageRangeOption
        }
      };
      this.router.navigate(['age-range-option-edit'], navigationExtras);
    });
  }

  onAddCourseLevelOptions(){
    console.log("Good onAddCourseLevelOptions().");

    this.levelService.getLevelOptionsForUserId(this.providerId, this.userId, (levelOptions:LevelOption[]) => {
      this.onPupUpSelectLevels(levelOptions);
    });
  }

  async onPupUpSelectLevels(levelOptions:LevelOption[]){
    if(!levelOptions || levelOptions.length===0){
      this.toastUtil.showToast("No level option available. Create new customized first.");
      return;
    }

    let inputs:any[] = [];
    for(let levelOption of levelOptions){
      let notExist = true;
      if(this.course.levelOptions){
        for(let existLevel of this.course.levelOptions){
          if(existLevel.id===levelOption.id){
            notExist = false;
            break;
          }
        }
      }
      if(notExist){
        inputs.push({
          type: 'checkbox',
          label: levelOption.name,
          value: levelOption,
          checked: false
        });
      }
    }

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey("Choose Levels"),
      subHeader: "Please save course after.",
      inputs: inputs,
      buttons: [
        {
          text: this.translateUtil.translateKey("CANCEL"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey("CHOOSE"),
          handler: data => {
            if(!this.course.levelOptions){
              this.course.levelOptions = [];
            }
            for(let levelOption of data){
              if(this.course.levelOptions.indexOf(levelOption)<0){
                this.course.levelOptions.push(levelOption);
              }
            }
            this.sortAgeRanges();
          }
        }
      ]
    });
    await alert.present();
  }

  async onEditLevelOption(levelOption:LevelOption){
    console.log("Good onEditLevelOption.");
    if(!levelOption || !this.course.levelOptions){
      return;
    }
    this.utils.showAlertConfirm(this.alertCtrl, "You will lose unsaved change, continue?", null, null, "Cancel", null, "Continue", () => {
      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.providerId, levelOption:levelOption
        }
      };
      this.router.navigate(['level-option-edit'], navigationExtras);
    });
  }

  onDeleteCourseLevelOption(levelOption:LevelOption){
    console.log("Good onDeleteLevelOption.");
    if(!levelOption || !this.course.levelOptions || this.course.levelOptions.length===0){
      return;
    }

    this.utils.showAlertConfirm(this.alertCtrl, "Delete this level option?", null, null, "Cancel", null, "Delete", () => {
      this.course.levelOptions.splice(this.course.levelOptions.indexOf(levelOption), 1);
      if(levelOption.id>=0){
        this.levelService.deleteLevelOptionForCourse(this.userId, this.courseId, levelOption.id, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("Level option deleted.");
          }else{
            this.toastUtil.showToast("Delete option failed!");
          }
        });
      }
    });
  }

  async onCreateNewLevel(){
    console.log("Good onAddLevel.");
    this.utils.showAlertConfirm(this.alertCtrl, "You will lose unsaved change, continue?", null, null, "Cancel", null, "Continue", () => {
      let levelOption = new LevelOption();
      levelOption.providerId = this.providerId;
      levelOption.userId = this.userId;
      levelOption.name = null;
      levelOption.enabled = true;
      let navigationExtras: NavigationExtras = {
        state: {
          providerId:this.providerId, levelOption:levelOption
        }
      };
      this.router.navigate(['level-option-edit'], navigationExtras);
    });
  }

  l_updateSkiCourseById(){
    this.providerService.s_getCoursesDetailsById(this.courseId, (course:Course) => {
      this.course = course;
      this.updateYoutubeLinks();
      if(this.course){
        this.course.courseTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.course.courseTime);
        this.course.deadLine = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.course.deadLine);
        this.sortAgeRanges();
        this.sortLevels();
      }
    });
  }

  l_scrollToId(id:string):boolean{
    let element = document.getElementById(id);
    if(!element){
      return false;
    }
    let yOffset = document.getElementById(id).offsetTop;
    console.log("scrollX: " + yOffset);
    this.content.scrollToPoint(0, yOffset, 100);
    return true;
  }

  onJoditChange($event){
    if(!$event || !$event.args){
      return;
    }
    const val = $event.args[0];
    const preVal = $event.args[1];
    // console.log("Good onJoditChange, value: " + val + ", previous value: " + preVal);

    this.course.description = val;
  }

  onCheckDeadline(event: any, preValue:any){
    console.log("Good onCheckDeadline().");
    let preDeadline = this.course.deadLine;
    let newDeadline =  event;
    this.deadlineError = null;
    if(!newDeadline){
      return;
    }else{
      let newDeadlineMmt = moment(newDeadline);
      if(newDeadlineMmt.isBefore(moment())){
        this.deadlineError = "Deadline is passed.";
      }
    }
  }

  onDeleteDeadline(){
    console.log("Good onDeleteDeadline().");
    this.course.deadLine = null;
    this.deadlineError = null;
  }

  saveSkiCourse(formRef:NgForm) {
    console.log("save called good.");
    this.submitted = true;

    if(!this.course.ownerUserId || this.course.ownerUserId<=0){
      this.course.ownerUserId = this.userId;
    }

    if(!this.appSession.l_getUserInfo() && !this.appSession.l_isInstructor(this.providerId)){
      this.toastUtil.showToastTranslate("Instructor only!");
      return;
    }

    if(!formRef.valid){
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
      return;
    }

    if(!this.course.statusId){
      this.toastUtil.showToast(this.translateUtil.translateKey("Status is required!"));
      this.l_scrollToId("statusId");
      return;
    }

    if((!this.course.totalStudentLimit || this.course.totalStudentLimit<1) && this.course.providerCourseTypeId===this.groupPCType.id){
      this.toastUtil.showToast("Group lesson must have student limit.");
      return;
    }

    if(!this.course.providerId){
      this.course.providerId = this.providerId;
    }

    if(this.course.useAgeOption && (!this.course.ageRangeOptions || this.course.ageRangeOptions.length===0)){
      this.toastUtil.showToast(this.translateUtil.translateKey("Age ranges should not be empty if useAgeOption is chosen!"));
      return;
    }

    if(this.course.useLevelOption && (!this.course.levelOptions || this.course.levelOptions.length===0)){
      this.toastUtil.showToast(this.translateUtil.translateKey("Levels should not be empty if useLevelOption is chosen!"));
      return;
    }

    this.course.courseTime = this.utils.changeTimeZoneFromISOToLocalForServer(this.course.courseTime);
    this.course.deadLine = this.utils.changeTimeZoneFromISOToLocalForServer(this.course.deadLine);
    this.providerService.s_saveSkiCourse(this.appSession.l_getUserId(), this.course, (course:Course) => {
      this.confirmedLeave = true;
      this.course = course;
      this.course.courseTime = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.course.courseTime);
      this.course.deadLine = this.utils.changeTimeZoneFromISOToLocalForCalendar(this.course.deadLine);
      if(this.callback){
        this.callback();
      }
      this.onClose();
    });
  }

  ionViewCanLeave(){
    if (this.formRef.dirty && !this.confirmedLeave) {
      this.onCancelPage();
      return false;
    }else{
      return true;
    }
  }

  onCancelPage(){
    if (this.formRef.dirty) {
      this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('DISCARD_CHANGED'), null, null, this.translateUtil.translateKey('CANCEL'), null,
        this.translateUtil.translateKey('DISCARD'),
        (data) => {
          this.confirmedLeave = true;
          this.navCtrl.pop();
        });
    }else{
      this.navCtrl.pop();
    }
  }

  l_reset(){
    this.formChanged = false;
    if(!this.course.id || this.course.id<=0){
      this.course = new Course();
    }else{
      this.l_updateSkiCourseById();
    }
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

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            console.log('To submit form.');
            if(!this.formRef){
              console.log("Can not find formRef!");
            }else{
              this.formRef.ngSubmit.emit("ngSubmit");
              console.log('Save clicked finished.');
            }
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
