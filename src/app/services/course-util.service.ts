import { Injectable } from '@angular/core';
import {AppConstants} from './app-constants.service';
import {Course} from '../models/Course';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CourseUtil {

  constructor(private appConstants:AppConstants) {

  }

  isBeforeDeadline(course:Course):boolean{
    if(!course){
      return null;
    }
    if(!course.deadLine){
      return true;
    }

    if(moment(course.deadLine).isAfter(new Date())){
      return true;
    }else{
      return false;
    }
  }

  isCourseRegister(course:Course):boolean{
    if(!course){
      return false;
    }
    if(course.open && this.isBeforeDeadline(course)){
      return true;
    }else{
      return false;
    }
  }
}
