import {CourseRegistration} from "./CourseRegistration";
import {InstructorWithDetails} from "./InstructorWithDetails";
import {TripHill} from "./TripHill";
import {SessionTime} from "./SessionTime";
import {AttachedFile} from './AttachedFile';
import {CoursePriceFormula} from "./payment/coursePayment/CoursePriceFormula";
import {AgeRangeOption} from "./courseOptions/AgeRangeOption";
import {LevelOption} from "./courseOptions/LevelOption";

export class Course {
  public id: number;

  ownerUserId:number;
  name: string;
  instructorId:number;
  instructorName:string;
  instructorReviewScore:number;
  instructorReviewCount:number;

  providerCourseTypeId: number;
  providerCourseTypeName: string;

  sessionTimes:SessionTime[];
  sessionTimesStr:string; // for show sessionTimes in a string;

  description:string;
  conditionStr:string;
  emailMessage:string;  // for course registration confirm message sent by email;

  learnTypeId:number;
  learnTypeName:string;

  deadLine:any;
  courseTime:any;

  totalStudentLimit:number;
  registStudentLimit:number;

  tripHillId:number;
  tripHill:TripHill;
  tripHillName:string;

  open: boolean;
  registerCode:string;

  statusId: number;
  statusName: string;
  comments: string;

  featured: boolean;

  minStudentCount:number;
  consentMandatory:boolean;

  tags:string;

  useAgeOption:boolean;
  useLevelOption:boolean;
  useBirthDayOption:boolean;
  ageRangeOptions:AgeRangeOption[];
  levelOptions:LevelOption[];

  // For camp course;
  isCamp:boolean;

  // Only show up for trip;
  forTrip:boolean;

  // For managing course request relationship;
  providerId:number;

  // for accept video in question and answer;
  acceptVideo:boolean;
  acceptQuestion:boolean;

  // for payment;
  unitPrice:number;

  // for youtube video ids; separated by ';';
  youtubeLinks:string;

  // for choose sessionTime;
  allowSelectSessions:boolean;

  createdDate:any;
  createdTypeId:number;	// 1 by select time, 2 by open course from instructor; 3 by select provider course type;
  createdTypeName:string;

  registrations:CourseRegistration[];
  instructors:InstructorWithDetails[];

  checked:boolean; //For checkbox;

  registrationCount:number;

  attachedFiles:AttachedFile[];

  hide:boolean; // for getItem search;
  hidePickList:boolean; // for pick list;
  filterHide:boolean;

  priceFormulas:CoursePriceFormula[];

  keepOpen:boolean;

  sessionTimesExpended:boolean; // for showing sessionTimes on skiCourses page and skiCourseDetailsPage.
  registrationsExpended:boolean;  // for showing courseRegistrations;

  constructor(){}
}
