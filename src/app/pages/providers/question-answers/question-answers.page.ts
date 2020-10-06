import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController} from "@ionic/angular";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {AppConstants} from "../../../services/app-constants.service";
import {Utils} from "../../../services/utils.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AppSession} from "../../../services/app-session.service";
import {Question} from "../../../models/userRelationship/Question";

@Component({
  selector: 'app-question-answers',
  templateUrl: './question-answers.page.html',
  styleUrls: ['./question-answers.page.scss'],
})
export class QuestionAnswersPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;
  @ViewChild('search') search : any;

  fromCommand:number = null;

  private userId:number;

  public myQuestionAnswers:Question[];
  public instructorQuestionAnswers:Question[];

  private keyIndex:number = 0;
  public showSearchBar:boolean = false;
  public searchKey:string = null;

  public optionsList:string[] = [];
  public appType:string;

  public readonly L_MY_QUESTIONS = this.translateUtil.translateKey("My Questions");
  public readonly L_INSTRUCTOR_QUESTIONS = this.translateUtil.translateKey("Instructor Questions");

  constructor(public navCtrl: NavController, private alertCtrl:AlertController,
              appSession:AppSession, public translateUtil:TranslateUtil, private ionRouterOutlet:IonRouterOutlet,
              public toastUtil:ToastUtil, private providerService:ProvidersService,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, router:Router,
              public appConstants:AppConstants, public utils:Utils,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.initOptionList();
    this.myQuestionAnswers = [];
    this.instructorQuestionAnswers = [];

    this.fromCommand=this.appConstants.PAGE_FOR_STUDENT_QUESTIONS;
    this.appType = this.mappingSegment(this.fromCommand);

    this.userId = this.appSession.l_getUserId();
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.searchKey = null;
    this.updatePageContent(true);
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  public initOptionList(){
    this.optionsList.push(this.L_MY_QUESTIONS);
    this.optionsList.push(this.L_INSTRUCTOR_QUESTIONS);
  }

  public mappingSegment(command:number):string{
    if(command===this.appConstants.PAGE_FOR_STUDENT_QUESTIONS){
      return this.L_MY_QUESTIONS;
    }else if(command===this.appConstants.PAGE_FOR_INSTRUCTOR_QUESTIONS){
      return this.L_INSTRUCTOR_QUESTIONS;
    }else{
      return this.L_MY_QUESTIONS;
    }
  }

  public reverseMappingSegment(appType:string):number{
    if(appType===this.L_MY_QUESTIONS){
      return this.appConstants.PAGE_FOR_STUDENT_QUESTIONS;
    }else if(appType===this.L_INSTRUCTOR_QUESTIONS){
      return this.appConstants.PAGE_FOR_INSTRUCTOR_QUESTIONS;
    }else{
      return this.appConstants.PAGE_FOR_INSTRUCTOR_QUESTIONS;
    }
  }

  private resetSearch(){
    this.showSearchBar = false;
    this.searchKey = null;
  }

  segmentChanged(){
    console.log("Good segmentChanged(). appType: " + this.appType);
    this.resetSearch();
    this.fromCommand = this.reverseMappingSegment(this.appType);
    this.updatePageContent(true);
    this.onScrollUp();
  }

  updatePageContent(refresh:boolean){
    if(!this.userId){
      this.utils.showOkAlert(this.alertCtrl, "Please login first.", "If you don't have an account yet, please register one.");
      return;
    }

    this.resetSearch();
    if(refresh){
      this.myQuestionAnswers = [];
      this.instructorQuestionAnswers = [];
    }
    if(this.fromCommand===this.appConstants.PAGE_FOR_STUDENT_QUESTIONS){
      this.providerService.s_getQuestionsForUserId(null, this.userId, (qas:Question[]) => {
        this.myQuestionAnswers = qas;
        if(!qas){
          return;
        }
      });
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_INSTRUCTOR_QUESTIONS){
      this.providerService.s_getQuestionsForAssignedUserId(null, this.userId, (qas:Question[]) => {
        this.instructorQuestionAnswers = qas;
        if(!qas){
          return;
        }
      });
    }else{
      console.log("Unknow fromCommand!");
      return;
    }
  }

  toggleSearchBar(){
    this.showSearchBar = !this.showSearchBar;
    //this.checkSearchBarTimeout();;
    this.focusButton();
  }

  focusButton(){
    if(this.showSearchBar && this.search){
      setTimeout(() => {
        this.search.setFocus();
      }, 500);
    }
  }

  doInfinite(infiniteScroll) {
    // get pagination comments;
    this.updatePageContent(false);

    setTimeout(() => {
      infiniteScroll.complete();
    }, 30);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  onClearSearch(){
    this.getItems(null);
    this.showSearchBar = false;
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

  getItems(ev: any){
    if(this.fromCommand===this.appConstants.PAGE_FOR_STUDENT_QUESTIONS){
      this.getItemsMyQuestions(ev);
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_INSTRUCTOR_QUESTIONS){
      this.getItemsInstructorQuestions(ev);
    }
  }

  getItemsMyQuestions(ev: any) {
    if(!this.myQuestionAnswers){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;
      for(let question of this.myQuestionAnswers) {
        if(question.title && question.title.toLowerCase().indexOf(val.toLowerCase()) > -1){
          question.hide = false;
        }else{
          question.hide = true;
        }
      }
    }else{
      this.searchKey = null;
      for(let question of this.myQuestionAnswers) {
        question.hide = false;
      }
    }

    //this.checkSearchBarTimeout();;
  }

  getItemsInstructorQuestions(ev: any) {
    if(!this.instructorQuestionAnswers){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;
      for(let question of this.instructorQuestionAnswers) {
        if(question.title && question.title.toLowerCase().indexOf(val.toLowerCase()) > -1){
          question.hide = false;
        }else{
          question.hide = true;
        }
      }
    }else{
      this.searchKey = null;
      for(let question of this.instructorQuestionAnswers) {
        question.hide = false;
      }
    }

    //this.checkSearchBarTimeout();;
  }

  onViewDetails(id:number){
    console.log("Good onViewDetails, id: " + id);
    let navigationExtras: NavigationExtras = {
      state: {
        questionId: id
      }
    };
    this.router.navigate(['question-details'], navigationExtras);
  }
}
