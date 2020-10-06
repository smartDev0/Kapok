import {Schedule} from "../schedule/Schedule";
import {RecurrenceInstance} from "../schedule/RecurrenceInstance";

export class ChooseRecurrenceRequest {
  // for query, mandatory fields;
  fromUserId:number;
  providerId:number;
  chosenDate:any;
  withBlocked:boolean;

  // for query course schedule recurrenceInstance;
  courseId:number;

  // for query, optional fields.
  // for book lesson also.
  chosenLearnTypeId:number;
  chosenTripHillId:number;
  chosenProviderCourseTypeId:number;
  chosenUserId:number;
  chosenInstructorId:number;
  chosenStartTime:any;
  chosenEndTime:any;

  // for schedule;
  chosenSchedule:Schedule;

  // for recurrenceInstance;
  chosenInstance:RecurrenceInstance
  ;
  constructor(){
  }
}
