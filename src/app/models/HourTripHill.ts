export class HourTripHill {
  public sequence:number;
  public startHour:number;
  public startMinute:number;
  public endHour:number;
  public endMinute:number;
  public tripHillId:number;
  public courseId:number;
  public sessionTimeId:number; // for redirect to booked sessionTime page;

  public registerCode:string;
  public occupied:boolean;
  public checked:boolean;

  public showId:number; // for show fake instructorId;
  public deadLine:any;
  public deadlineHoursBefore:number;

  public blocked:boolean; // locked by schedule recurrence;

  constructor(
  ){}
}
