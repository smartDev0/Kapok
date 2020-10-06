import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {DateTimeUtils} from './services/date-time-utils.service';
import {ProvidersService} from './services/providers-service.service';
import {ACLService} from './services/aclservice.service';
import {HttpUtil} from './services/http-util.service';
import {UserService} from './services/user-service.service';
import {CodeTableService} from './services/code-table-service.service';
import {AppConstants} from './services/app-constants.service';
import {UserSession} from './services/user-session.service';
import {ToastUtil} from './services/toast-util.service';
import {SecureHttpService} from './services/secure-http-service.service';
import {TranslateUtil} from './services/translate-util.service';
import {Utils} from './services/utils.service';
import {AppSession} from './services/app-session.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { Network } from '@ionic-native/network/ngx';
import {IonicStorageModule} from '@ionic/storage';
import {httpInterceptorProviders} from "./http-interceptors";
import {SharedModule} from "./shared.module";
import {CoursePaymentService} from "./services/coursePayment/course-payment-service.service";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        // useFactory: createTranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SharedModule,
  ],
  entryComponents:[],
  providers: [
    StatusBar,
    SplashScreen,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // { provide: RouteReuseStrategy, useClass: AppIonicRouteStrategy },

    // App required services:
    TranslateService,
    httpInterceptorProviders,

    UserSession,
    AppSession,
    Utils,
    // AppConstants,
    TranslateUtil,
    ToastUtil,
    Network,
    DateTimeUtils,
    // {provide: ErrorHandler, useClass: IonicErrorHandler},

    SecureHttpService,

    AppConstants,
    CodeTableService,
    UserService,
    HttpUtil,
    ACLService,

    // Geolocation,
    ProvidersService,
    CoursePaymentService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
