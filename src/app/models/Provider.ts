import {TripHill} from "./TripHill";

export class Provider {
  public id:number;
  public name:string;
  public ownerUserId:number;
  public addressStr:string;
  public phone:string;
  public iconId: number;
  public iconUrl:string;
  public iconFullUrl:string;
  public description:string;
  public activated:boolean;

  public providerTypeId:number;
  public providerTypeName:string;

  public createdDate:any;
  public lastUpdatedDate:any;

  public checked:boolean;

  public onlineMembership:boolean;  // accept online membership registration or not;
  public taxRate:number;

  public payOptionId:number;
  public payOptionName:string;

  public allowCancelCourseRegistration:boolean;
  public allowCancelHoursBeforeStartTime:number;
  public enableTripEvent:boolean; // For show school trip events;
  public enablePrograms:boolean; // For school ability programs button;
  public enableInstructors:boolean; // For school ability instructors button;
  // public enablePackages:boolean;  // for showing calendar button;

  public showRating:boolean;  // show rating stars on page;
  public showReview:boolean;  // show review button on page;
  public showEmailReview:boolean; // show review link in confirmation email;
  public showCourseTime:boolean; // show course.courseTime if provider set this to be true;
  public showCourseTag:boolean; // show course tags on courses, courseEdit and courseDetails page;
  public showPrivateCourses:boolean;  // show private courses (programs) on programs page;
  public showInstructorPhoto:boolean; // show instructor photo on available instructors page or instructor details page;

  public enableLiftTicket:boolean; 	// for lift ticket option when checking out;
  public enableRental:boolean;		// for rental options when checking out;

  public tripHills:TripHill[];

  public score:number;
  public reviewCount:number;

  public payOnline:boolean;	// show payOnline Option;
  public payOffline:boolean;	// show payOffline Option;
  public tags:string;

  public email:string;
  public auditing:boolean;
  public auditEmail:string;

  public hide:boolean;

  constructor(
  ){}
}
