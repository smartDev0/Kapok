import { Injectable } from '@angular/core';
import {UserInfo} from '../models/UserInfo';
import {ProviderContext} from '../models/transfer/ProviderContext';
import {ConfigureForClient} from '../models/transfer/ConfigureForClient';
import {ACLUser} from '../models/transfer/RegisterUser';
import {UserSession} from './user-session.service';
import {AppConstants} from './app-constants.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Page} from '../models/client/page';
import {ACLService} from './aclservice.service';
import {UserService} from './user-service.service';
import {ProvidersService} from './providers-service.service';

@Injectable({
  providedIn: 'root'
})
export class AppSession {
  public requiredAppVersion;
  public clientConfigure:ConfigureForClient = null;

  private networkConnected$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public pages: Array<Page>;

  public shownAvailableAler:boolean = false;

  constructor(public appConstants:AppConstants, private userService:UserService,
              private providerService:ProvidersService, private aclService:ACLService, private userSession:UserSession) {

  }


  public subscribeUser(callback:any):Subscription{
    if(!callback){
      return;
    }
    return new Subscription();
  }

  public getClientConfigure(callback?):ConfigureForClient{

    return new ConfigureForClient();
  }

  public loginUser(aclUser:ACLUser, callback?){

  }

  public logoutUser(callback?){

  }

  public updateNetwork(status:boolean){
    this.networkConnected$.next(status);
  }

  public subscribeNetwork(callback){

  }

  public saveUserInfo(userInfo:UserInfo, callback?){

  }

  /**
   * Initial method;
   * FreshOnly will always return null, need to provide callbacks!!
   */
  public checkProviderContext(refreshOnly:boolean, providerId:number, success?, failure?):ProviderContext{
    return null;
  }

  private loadProviderContext(userId:number, providerId:number, success, failure){

  }

  public l_setProviderContext(pContext:ProviderContext){
    this.userSession.setProviderContext(pContext);
  }

  public l_getProviderContext():ProviderContext{
    return this.userSession.getProviderContext();
  }

  public l_setSessionUser(userInfo:UserInfo){
    this.userSession.setSessionUser(userInfo);
  }

  public l_hasAboveInstructorAccess(providerId:number):boolean{
    return true;
  }

  public l_isSiteAdmin():boolean {
    return false;
  }

  public l_getUserId():number{
    return 1;
  }

  public l_getUserInfo():UserInfo{
    return this.userSession.getSessionUser();
  }

  public l_isAdministrator(providerId:number):boolean {
    return false;
  }

  public l_isInstructor(providerId:number):boolean {
    return false;
  }

  public l_getInstructorId(providerId:number):number{
    return 0;
  }

  public l_isMember(providerId:number):boolean {
    return false;
  }

  public l_getMemberId(providerId:number){
    return 1;
  }

  public l_hasCurrentProviderAccount(providerId:number):boolean {
    return false;
  }
}
