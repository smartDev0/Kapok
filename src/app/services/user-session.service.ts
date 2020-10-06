import { Injectable } from '@angular/core';
import {UserInfo} from '../models/UserInfo';
import {ProviderContext} from '../models/transfer/ProviderContext';
import {AppConstants} from './app-constants.service';
declare function require(path: string): any;

@Injectable({
  providedIn: 'root'
})
export class UserSession {

  constructor(private appConstants:AppConstants) { }


  public getSessionUser():UserInfo{
    return null;
  }

  public setSessionUser(good:UserInfo){

  }

  public subscribeProviderContext(callback:any){

  }

  public getProviderContext():ProviderContext{

    return null;
  }

  public setProviderContext(pContext:ProviderContext){

  }
}
