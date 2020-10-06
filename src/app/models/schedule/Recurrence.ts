import {Schedule} from './Schedule';
import {TimeSlot} from "./TimeSlot";

export class Recurrence {

  // Week days;
  public readonly SUNDAY:number = 1;
  public readonly MONDAY:number = 2;
  public readonly TUESDAY:number = 3;
  public readonly WEDNESDAY:number = 4;
  public readonly THURSDAY:number = 5;
  public readonly FRIDAY:number = 6;
  public readonly SATURDAY:number = 7;

  id:number;
  scheduleId:number;
  enabled:boolean;

  recurrenceTypeId:number;

  // for recurrence and instance;
  title:string;
  validFrom:any;
  validTo:any;
  timeUnit:number;
  blocked:boolean;
  description:string;
  notes:string;
  createdDate:any;
  lastUpdatedDate:any;

  deadline:any;
  deadlineHoursBefore:number;
  registerCode:string;

  // for single day, no recurrence;
  onDate:any;

  // for daily recurrence;
  everyWeekDay:boolean;
  everyWeekendDay:boolean;
  everyNumOfDay:number;
  totalRecurrence:number;

  // for weekly recurrence;
  fromDayOfWeek:number;
  toDayOfWeek:number;
  everyNumOfWeek:number;
  fromWeekOfMonth:number;
  toWeekOfMonth:number;
  fromWeekOfYear:number;
  toWeekOfYear:number;

  // for monthly recurrence;
  fromDayOfMonth:number;
  toDayOfMonth:number;
  everyNumOfMonth:number;
  fromMonthOfYear:number;
  toMonthOfYear:number;

  // for yearly recurrence;
  fromDayOfYear:number;
  toDayOfYear:number;
  everyNumOfYear:number;

  timeSlots:TimeSlot[];
  // for edit timeSlot;
  selectedTimeSlot:TimeSlot;

  // for delete on page;
  tempId:number;

  constructor() {
  }
}
