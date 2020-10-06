import {InstructorWithDetails} from "./InstructorWithDetails";

export class SessionTime {
  public id:number;
  public courseId:number;
  public name:string;
  public startTime:any;
  public endTime:any;
  public description:string;

  public tripHillId:number;
  public mandatory:boolean;
  public tripHillName:string;
  public instructorId:number;
  public courseName:string;

  // This is for adding sessionTime to coruseRegistration, which to course has no deadline or session, or from schedule,
  //   so the session has to added to coruseRegistration;
  public courseRegistrationId:number;

  // for display student;
  public studentName:string;
  public studentEmail:string;
  public guestName:string;
  public guestEmail:string;

  public instructorName:string;
  public instructor:InstructorWithDetails;

  // additional instructors;
  public instructors:InstructorWithDetails[];

  public recurrenceId:number;
  public recurrenceExist:boolean;

  // for choose sessionTime for courseRegistrationConfirmPage;
  public checked:boolean;

  public hide:boolean;

  constructor(
  ){}
}
