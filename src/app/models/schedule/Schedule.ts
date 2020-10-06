import {TripHill} from "../TripHill";
import {LearnType} from "../code/LearnType";
import {ProviderCourseTypeWithDetails} from "../ProviderCourseTypeWithDetails";
import {Recurrence} from "./Recurrence";
import {InstructorWithDetails} from "../InstructorWithDetails";
import {Course} from "../Course";

export class Schedule {
  id:number;
  providerId:number;
  scheduleTypeId:number;
  title:string;
  userId:number;
  ownerName:string;
  instructorId:number;
  description:string;
  notes:string;
  enabled:boolean = true;
  createdDate:any = new Date();

  // for course;
  courses:Course[];

  // for instructor time;
  instructor:InstructorWithDetails;
  tripHills:TripHill[];
  providerCourseTypes:ProviderCourseTypeWithDetails[];
  learnTypes:LearnType[];

  consent:string;
  lastUpdatedDate:any;

  recurrences:Recurrence[];

  constructor() {
  }
}
