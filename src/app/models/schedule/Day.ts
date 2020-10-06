import {RecurrenceInstance} from "./RecurrenceInstance";

export class Day {
  year:number;
  month:number;
  dayOfWeek:number;
  dayOfMonth:number;
  dayOfYear:number;
  weekOfYear:number;
  weekOfMonth:number;
  notes:string;

  instances:RecurrenceInstance[];
  refreshedTime:any;

  day:any;	// for quick comparing with other date;

  constructor() {
  }
}
