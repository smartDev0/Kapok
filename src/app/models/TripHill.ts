import {ProviderCourseTypeWithDetails} from "./ProviderCourseTypeWithDetails";

export class TripHill {
  id:number;
  providerId:number;
  mountainId:number;
  locationStr:string;
  description:string;
  ticketByAgeGroup:boolean; // this for some tripHill (Edelwiss) need ticket by age group price.
  activated:boolean;
  availableInstructorIds:number[];
  freeInstructorIds:number[];

  // Available providerCourseType on the tripHill and at the time;
  availableProviderCourseTypes:ProviderCourseTypeWithDetails[];

  hide:boolean;

  constructor(){}
}
