import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../BasicUserIdPage';
import {ActionSheetController, AlertController, IonContent, IonRouterOutlet, NavController} from '@ionic/angular';
import {AppSession} from '../../../services/app-session.service';
import {TranslateUtil} from '../../../services/translate-util.service';
import {ToastUtil} from '../../../services/toast-util.service';
import {ProvidersService} from '../../../services/providers-service.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AppConstants} from '../../../services/app-constants.service';
import {Utils} from '../../../services/utils.service';
import {Course} from '../../../models/Course';
import {GeneralPaginationRequest} from "../../../models/transfer/GeneralPaginationRequest";
import {FavoriteCourse} from "../../../models/userRelationship/FavoriteCourse";
import {FavoriteInstructor} from "../../../models/userRelationship/FavoriteInstructor";
import {InstructorWithDetails} from '../../../models/InstructorWithDetails';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.page.html',
  styleUrls: ['./my-favorites.page.scss'],
})
export class MyFavoritesPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;
  @ViewChild('search') search : any;

  fromCommand:number = null;

  private userId:number;

  public favoriteCourses:FavoriteCourse[];
  public favoriteInstructors:FavoriteInstructor[];

  private keyIndex:number = 0;
  public showSearchBar:boolean = false;
  public searchKey:string = null;

  public optionsList:string[] = [];
  public appType:string;

  public readonly L_INSTRUCTORS = this.translateUtil.translateKey("Favorite Instructors");
  public readonly L_COURSES = this.translateUtil.translateKey("Favorite Programs");

  constructor(public navCtrl: NavController, private alertCtrl:AlertController,
              appSession:AppSession, public translateUtil:TranslateUtil, private ionRouterOutlet:IonRouterOutlet,
              public toastUtil:ToastUtil, private providerService:ProvidersService,
              private actionsheetCtrl: ActionSheetController, private route: ActivatedRoute, router:Router,
              public appConstants:AppConstants, public utils:Utils,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.initOptionList();
    this.favoriteCourses = [];
    this.favoriteInstructors = [];

    this.fromCommand=this.appConstants.PAGE_FOR_FAVORITE_INSTRUCTORS;
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
    this.optionsList.push(this.L_INSTRUCTORS);
    this.optionsList.push(this.L_COURSES);
  }

  public mappingSegment(command:number):string{
    if(command===this.appConstants.PAGE_FOR_FAVORITE_COURSES){
      return this.L_COURSES;
    }else if(command===this.appConstants.PAGE_FOR_FAVORITE_INSTRUCTORS){
      return this.L_INSTRUCTORS;
    }else{
      return this.L_INSTRUCTORS;
    }
  }

  public reverseMappingSegment(appType:string):number{
    if(appType===this.L_COURSES){
      return this.appConstants.PAGE_FOR_FAVORITE_COURSES;
    }else if(appType===this.L_INSTRUCTORS){
      return this.appConstants.PAGE_FOR_FAVORITE_INSTRUCTORS;
    }else{
      return this.appConstants.PAGE_FOR_FAVORITE_INSTRUCTORS;
    }
  }

  private resetSearch(){
    this.keyIndex = 0;
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
    this.resetSearch();
    if(refresh){
      this.favoriteCourses = [];
      this.favoriteInstructors = [];
    }
    if(this.fromCommand===this.appConstants.PAGE_FOR_FAVORITE_INSTRUCTORS){
      this.providerService.s_getUserFavoriteInstructors(this.userId, (favInsts:FavoriteInstructor[]) => {
        this.favoriteInstructors = favInsts;
        if(!favInsts){
          return;
        }
      });
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_FAVORITE_COURSES){
      this.providerService.s_getUserFavoriteCourses(this.userId, (favCs:FavoriteCourse[]) => {
        this.favoriteCourses = favCs;
        if(!favCs){
          return;
        }
      });
    }else{
      console.log("Unknown fromCommand!");
      return;
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

  onViewCourseDetails(courseId:number){
    console.log("Good onViewCourseDetails, courseId: " + courseId);
    if(!courseId){
      return;
    }
    this.providerService.s_getCoursesDetailsById(courseId, (course:Course) => {
      if(!course){
        return;
      }
      let navigationExtras: NavigationExtras = {
        state: {
          courseId:course.id,
          providerId:course.providerId
        }
      };
      this.router.navigate(['ski-course-details'], navigationExtras);
    });
  }

  onViewInstructorDetails(instructorId:number){
    console.log("Good onViewInstructorDetails, courseId: " + instructorId);
    if(!instructorId){
      return;
    }
    this.providerService.s_getSkiInstructorDetailsById(instructorId, (instructor:InstructorWithDetails) => {
      if(!instructor){
        return;
      }
      let navigationExtras: NavigationExtras = {
        state: {
          instructorId:instructorId,
          providerId:instructor.providerId
        }
      };
      this.router.navigate(['ski-instructor-details'], navigationExtras);
    });
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

  onClearSearch(){
    this.getItems(null);
    this.showSearchBar = false;
  }

  getItemCourse(ev:any){
    if(!this.favoriteCourses){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;
      for(let course of this.favoriteCourses) {
        if(course.courseName && course.courseName.toLowerCase().indexOf(val.toLowerCase()) > -1){
          course.hide = false;
        }else{
          course.hide = true;
        }
      }
    }else{
      this.searchKey = null;
      for(let course of this.favoriteCourses) {
        course.hide = false;
      }
    }
  }

  getItemInstructor(ev:any){
    if(!this.favoriteInstructors){
      return;
    }

    // if the value is an empty string don't filter the items
    if (ev && ev.target && ev.target.value) {
      // set val to the value of the searchbar
      const val = ev.target.value;
      this.searchKey = val;
      for(let instructor of this.favoriteInstructors) {
        if(instructor.instructorName && instructor.instructorName.toLowerCase().indexOf(val.toLowerCase()) > -1){
          instructor.hide = false;
        }else{
          instructor.hide = true;
        }
      }
    }else{
      this.searchKey = null;
      for(let instructor of this.favoriteInstructors) {
        instructor.hide = false;
      }
    }
  }

  getItems(ev: any) {
    if(this.fromCommand===this.appConstants.PAGE_FOR_FAVORITE_INSTRUCTORS && this.favoriteInstructors){
      this.getItemInstructor(ev);
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_FAVORITE_COURSES && this.favoriteCourses){
      this.getItemCourse(ev);
    }

    //this.checkSearchBarTimeout();;
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  //
  // async openMenu() {
  //   let buttons:any = [];
  //   buttons.push(
  //     {
  //       text: this.translateUtil.translateKey('CLOSE'),
  //       // role: 'cancel', // will always sort to be on the bottom
  //       handler: () => {
  //         console.log('CLOSE clicked');
  //         this.onClose();
  //       },
  //     }
  //   );
  //
  //   this.actionSheet = await this.actionsheetCtrl.create({
  //     cssClass: 'action-sheets-basic-page',
  //     buttons: buttons
  //   });
  //   this.actionSheet.present();
  // }
}
