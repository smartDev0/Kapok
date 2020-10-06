import {Rental} from './Rental';
import {CourseRegistration} from "../CourseRegistration";

export class TripRegistration {
  id:number;
  userId:number;// userId who has registered this course;
  tripId:number;
  consent:boolean;
  firstName:string;
  lastName:string;
  phoneNumber;
  email:string;
  clubMember:boolean;
  memberShipPaid:boolean;

  ticketByAgeGroup:boolean;
  overallMemberTickets:number;
  overallNonMemberTickets:number;

  ticketsMemberGrp1:number;
  ticketsMemberGrp2:number;
  ticketsMemberGrp3:number;
  ticketsMemberGrp4:number;

  ticketsNonMemberGrp1:number;
  ticketsNonMemberGrp2:number;
  ticketsNonMemberGrp3:number;
  ticketsNonMemberGrp4:number;

  needLesson:boolean;
  weChatId:string;

  cancelled:boolean;
  member13OlderCount:number;

  carPool:number;		// Options:1: need carpool; 2: provide carpool 3: NA.
  carPoolLocation:string;
  numberCarPool:number;

  needRental:boolean;
  rentals:Rental[];

  registrantName:string;  // userId name;

  courseRegistrations:CourseRegistration[];

  createdDate:any;
  lastUpdatedDate:any;

  // for showing trip for tripRegistration;
  providerId:number;
  public providerName:string;
  tripTitle:string;
  tripLocation:string;
  tripTime:any;

  hide:boolean;

  constructor(
  ){}

  public getMemberTicketsNumber(){
    return this.ticketsMemberGrp1 + this.ticketsMemberGrp2 + this.ticketsMemberGrp3 + this.ticketsMemberGrp4;
  }
}
