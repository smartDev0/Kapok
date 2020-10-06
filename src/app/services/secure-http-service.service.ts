import { Injectable } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {AppConstants} from './app-constants.service';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse
} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {UserInfo} from '../models/UserInfo';
import {UserSession} from './user-session.service';
import {catchError} from 'rxjs/operators';
import {Utils} from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class SecureHttpService implements HttpInterceptor {

  constructor(private userSession:UserSession, private alertCtrl:AlertController, private appConstants:AppConstants,
              public utils:Utils,) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
      Observable<HttpEvent<any>> {


    return ;
  }

  // handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //     this.utils.showOkAlert(this.alertCtrl, "Error: " + error.error.message, null);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //         `Backend returned code ${error.status}, ` +
  //         `body was: ${error.error}`);
  //     this.utils.showOkAlert(this.alertCtrl, `Backend returned code ${error.status}, `, null);
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError(
  //       'Something bad happened; please try again later.');
  //     this.utils.showOkAlert(this.alertCtrl, 'Something bad happened; please try again later.', null);
  // }
}
