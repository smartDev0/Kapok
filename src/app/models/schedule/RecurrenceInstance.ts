import {Schedule} from "./Schedule";
import {Recurrence} from "./Recurrence";


export class RecurrenceInstance {
  id:number;
  dayId:number;
  recurrenceId:number;
  scheduleId:number;
  sequencedCount:number;

  // for daily recurrence and instance;
  blocked:boolean;
  notes:string;
  cancelled:boolean;
  createdDate:any;
  lastUpdatedDate:any;

  clonedSchedule:Schedule;
  clonedRecurrence:Recurrence;

  day:any;

  expended:boolean;

  constructor() {
  }
}
