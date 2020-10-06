import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CallbackValue} from "../models/transfer/CallbackValue";

@Injectable({
  providedIn: 'root'
})
export class CallbackValuesService {
  public callbackDataSubject: BehaviorSubject<CallbackValue> = new BehaviorSubject<CallbackValue>(null);

  constructor() { }
}
