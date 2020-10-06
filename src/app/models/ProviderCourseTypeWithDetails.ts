import {Course} from "./Course";

export class ProviderCourseTypeWithDetails {
  id:number;
  providerId:number;
  name:string;
  courseTypeCodeId:number;
  courseTypeCodeName:string;
  description:string;
  lastUpdatedDate:any;
  minStudentNum:number;
  maxStudentNum:number;
  price:number;
  countBy:number;
  enabled:boolean;
  sessionTime:any;

  // for schedule hourly rate of this providerCourseType; This is set in schedule to overwrite the default price;
  hourlyRate:number;

  forTrip:boolean; // true if this type shows on trip course registration;

  // for page checked;
  checked;

  // for show course for this type on ski-courses page;
  courses:Course[];
  expended:boolean;
  visibleCourseCount:number;

  constructor(
  ){}
}
