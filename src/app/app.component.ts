import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {AlertController, MenuController, NavController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {UserService} from './services/user-service.service';
import {TranslateUtil} from './services/translate-util.service';
import {AppSession} from './services/app-session.service';
import {AppConstants} from './services/app-constants.service';
import {ToastUtil} from './services/toast-util.service';
import {CodeTableService} from './services/code-table-service.service';
import {ACLService} from './services/aclservice.service';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import {Network} from '@ionic-native/network/ngx';
import {Utils} from './services/utils.service';
import {Subscription} from 'rxjs';
import {ConfigureForClient} from './models/transfer/ConfigureForClient';
import {UserInfo} from './models/UserInfo';
import {Page} from './models/client/page';
import {NavigationEnd, NavigationExtras, Router, RouterEvent} from '@angular/router';
import {AcceptedVersion} from './models/code/AcceptedVersion';
import {AvailableMountainsPage} from "./pages/providers/available-mountains/available-mountains.page";
import {CancelRegistrationPaymentPage} from './pages/providers/ski-courses-registrations/cancel-registration-payment/cancel-registration-payment.page';
import {ConfirmEmailPage} from './pages/confirm-email/confirm-email.page';
import {SkiCourseDetailsPage} from './pages/providers/ski-courses/ski-course-details/ski-course-details.page';
import {SkiCoursesPage} from './pages/providers/ski-courses/ski-courses.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',

  providers: [
    Deeplinks,
  ],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy{
  private alert:any;
  private buttonSubscription:Subscription;
  private userSessionSubscription:Subscription;
  private disconnectSubscription:Subscription;
  private connectSubscription:Subscription;
  public selectedPath = '';
  public userName = null;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,

    public navController:NavController,
    public menu: MenuController, private userService:UserService, public translateUtil:TranslateUtil,
    public appSession: AppSession, public deepLinks:Deeplinks, public utils:Utils,
    public appConstants:AppConstants, private alertCtrl: AlertController, private toastUtil:ToastUtil,
    private network: Network, private codeTableService:CodeTableService, private aclService:ACLService,
    private router: Router,
  ) {
    this.initializeApp();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    console.log("component.ngAfterViewInit.");

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        console.log("cordova is available.");

        // Convenience to route with a given nav
        this.deepLinks.routeWithNavController(this.navController, {
          'available-mountains': AvailableMountainsPage,
          'confirmEmail/:press' : ConfirmEmailPage,
          'cancel-registration-payment/:press': CancelRegistrationPaymentPage,

          'ski-course-details/:providerId/:courseId': SkiCourseDetailsPage,
          'ski-courses/:providerId/:mountainId/:instructorId/:fromCommand': SkiCoursesPage,
          'add-comment/:press': "AddComment",

          // 'confirmEmail/:press' : 'ConfirmEmailPage',
          // 'cancel-registration-payment/:press': 'CancelRegistrationPaymentPage',
          //
          // 'available-dates/:providerId/:mountainId': 'AvailableDatesPage',
          // 'ski-course-details/:providerId/:courseId': 'SkiCourseDetails',
          // 'ski-courses/:providerId/:mountainId/:instructorId/:fromCommand': 'SkiCourses',
          // 'hours-for-instructor/:providerId/:instructorId/:onDate/:hillId': 'HoursForInstructorPage',
          // 'instructors-on-date/:providerId/:onDate/:hillId': 'InstructorsOnDatePage',
          // 'add-comment/:press': "AddComment",

        }).subscribe((match) => {
          // match.$route - the route we matched, which is the matched entry from the arguments to route()
          // match.$args - the args passed in the link
          // match.$link - the full link data
          console.log('Successfully matched route', match);
        }, (nomatch) => {
          // nomatch.$link - the full link data
          console.error('Got a deeplink that didn\'t match', nomatch);
        });
      }else{
        console.log("cordova is NOT available.");
      }

      this.buttonSubscription = this.platform.backButton.subscribe(() => {
        if(this.alert){
          this.alert.dismiss();
          this.alert =null;
        }
      });
    });
  }

  ngOnDestroy(){
    if(this.buttonSubscription){
      this.buttonSubscription.unsubscribe();
    }
    if(this.userSessionSubscription){
      this.userSessionSubscription.unsubscribe();
    }
    if(this.disconnectSubscription){
      this.disconnectSubscription.unsubscribe();
    }
    if(this.connectSubscription){
      this.connectSubscription.unsubscribe();
    }
  }

  initializeApp() {
    // this.platform.ready().then(() => {
    //   this.statusBar.styleDefault();
    //   this.splashScreen.hide();
    // });
    this.l_continueLoadApp();
  }

  l_continueLoadApp(){
    this.translateUtil.setLanguage('en');
    this.appSession.getClientConfigure((clientConf:ConfigureForClient) => {
      if(!clientConf){
        this.toastUtil.showToast("Using default values for client!");
        return;
      }

      this.appSession.requiredAppVersion = clientConf.clientRequiredVersion;

      // refresh codeTables;
      this.codeTableService.s_loadGeneralCodeTables(null, true);

      this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        if(this.platform.is('cordova')){
          this.statusBar.styleDefault();
          this.splashScreen.hide();
        }
      });

      this.userSessionSubscription = this.appSession.subscribeUser((userInfo:UserInfo) => {
        console.log("Updating for userInfo: " + (userInfo?userInfo.userName:""));
        this.l_updateMenu();
      });

      this.appSession.l_getUserInfo();

      this.getIfBetaVersion();

      // watch network for a disconnect
      this.disconnectSubscription =
      this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
        this.appSession.updateNetwork(false);
      });
      // stop disconnect watch
      // disconnectSubscription.unsubscribe();

      // watch network for a connection
      this.connectSubscription =
      this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        this.appSession.updateNetwork(true);
      });
      // stop connect watch
      // connectSubscription.unsubscribe();
    });
  }

  getIfBetaVersion(){
    this.aclService.s_getAcceptedVersion(this.appConstants.appVersion, (version:AcceptedVersion) => {
      if(version){
        this.appConstants.beta = version.beta;
      }
    });
  }


  openPage(page:Page) {
    console.log("openPage: " + page.title);

    // close the menu when clicking a link from the menu
    this.menu.close();

    // check if has account and login yet;
    let userInfo:UserInfo = this.appSession.l_getUserInfo();
    if(page.requireAccount && (!userInfo || !userInfo.id || userInfo.id<=0) ){
      this.utils.showOkAlert(this.alertCtrl, "Please login first.", "If you don't have an account yet, please register one.");
      return;
    }

    // navigate to the new page if it is not the current page
    if(page.url==='Logout'){
      this.onLogout();
    }else if(page.url==="MyRegistrations"){
      console.log("MyRegistrations clicked.");
      this.onMyRegistrations();
    }else if(page.url==='MySchools'){
      console.log("MySchools clicked.");
      this.onMySchoolsPage();
    }else if(page.url==="allprovider"){
      console.log("allprovider clicked.");
      this.onAllProviders();
    }
    else{
      this.router.navigate([page.url]);
    }
  }

  onLogout(){
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('LOGOUT'), this.translateUtil.translateKey('LOGOUT_SUBTITLE'), null,
        this.translateUtil.translateKey('CANCEL'), null,
        this.translateUtil.translateKey('LOGOUT'), data => {
          this.l_logout();
        });
  }

  l_logout(){
    this.appSession.logoutUser();
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  onMyRegistrations(){
    console.log("Good onMyRegistrations().");
    let navigationExtras: NavigationExtras = {
      state: {
        fromCommand:this.appConstants.PAGE_FOR_MEMBER, providerId: null
      }
    };
    this.router.navigate(['ski-courses-registrations'], navigationExtras);
  }

  onMySchoolsPage(){
    console.log("Good onMySchoolsPage().");
    let navigationExtras: NavigationExtras = {
      state: {
        getOption: "myProviders"
      }
    };
    this.router.navigate(['provider', 'myProviders'], navigationExtras);
  }

  onAllProviders(){
    let navigationExtras: NavigationExtras = {
      state: {
        getOption: "allProviders"
      }
    };
    this.router.navigate(['provider', 'allProviders'], navigationExtras);
  }

  l_updateMenu(){
    console.log("l_updateMenu.");

    // set our app's pages
    this.appSession.pages = [
      { id:1, title: this.translateUtil.translateKey('Available Mountains') , url: 'available-mountains', color:"allMenu", icon: null, requireAccount:false },
      { id:2, title: this.translateUtil.translateKey('Available Clubs/Schools') , url: 'available-schools', color:"allMenu", icon: null, requireAccount:false },
    ];

    let userInfo:UserInfo = this.appSession.l_getUserInfo();
    if(userInfo && userInfo.userName){
      this.userName = userInfo.userName;
    }else{
      this.userName = null;
    }
    if(userInfo && userInfo.id>0){
      this.appSession.pages = this.appSession.pages.concat(
          [
            { id:4, title: this.translateUtil.translateKey('My Clubs/Schools'), url: 'MySchools', color:"hasAccountMenu", icon: null, requireAccount:true },

            { id:7, title: this.translateUtil.translateKey('My Registrations'), url: 'MyRegistrations', color:"hasAccountMenu", icon: null, requireAccount:true },
            { id:8, title: this.translateUtil.translateKey('Profile'), url: 'profile', color:"hasAccountMenu", icon: null, requireAccount:true },
            { id:9, title: this.translateUtil.translateKey('My Favorites') , url: 'my-favorites', color:"hasAccountMenu", icon: null, requireAccount:true },
            { id:10, title: this.translateUtil.translateKey('My Questions') , url: 'question-answers', color:"hasAccountMenu", icon: null, requireAccount:true },
            // { id:11, title: this.translateUtil.translateKey('Comments'), url: 'comments-recent', color:"hasAccountMenu", icon: null, requireAccount:true },
            { id:12, title: this.translateUtil.translateKey('Feedback'), url: 'feedback', color:"hasAccountMenu", icon: null, requireAccount:true },
            { id:101, title: this.translateUtil.translateKey('Logout'), url: 'Logout', color:"allMenu", icon: null, requireAccount:true  },
          ]
      );
      if(userInfo.isInstructor){
        this.appSession.pages = this.appSession.pages.concat(
          [
            // { id:21, title: this.translateUtil.translateKey('Create Program'), url: 'CreateProgram', color:"instructorMenu", icon: null, requireAccount:true },
          ]
        );
      }
      if(userInfo.isSiteAdmin){
        this.appSession.pages = this.appSession.pages.concat(
            [
              { id:34, title: this.translateUtil.translateKey('Mountains'), url: 'mountains', color:"siteAdminMenu", icon: null, requireAccount:true },
              { id:35, title: this.translateUtil.translateKey('All Club/Schools') , url: 'allprovider', color:"siteAdminMenu", icon: null, requireAccount:true },
              { id:36, title: this.translateUtil.translateKey('AppConfiguration') , url: 'app-configuration', color:"siteAdminMenu", icon: null, requireAccount:true },
              { id:36, title: this.translateUtil.translateKey('Manage Users') , url: 'manage-users', color:"siteAdminMenu", icon: null, requireAccount:true },

            ]
        );
      }

      this.l_sortMenu();
    }else{
      this.appSession.pages = this.appSession.pages.concat(
          [
            { id:100, title: this.translateUtil.translateKey('Login'), url: 'login', color:"allMenu", icon: 'log-in', requireAccount:false },
          ]
      );
    }

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.appSession.pages.map( p => {
          return p['active'] = (event.url === p.url);
        });
      }
    });
  }

  private l_sortMenu(){
    this.appSession.pages.sort((p1:Page,p2:Page) => {
      if(p1.id>p2.id){
        return 1;
      }else{
        return -1;
      }
    });
  }
}
