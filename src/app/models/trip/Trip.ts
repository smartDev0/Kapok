import {TripRegistration} from './TripRegistration';

export class Trip {
  public id: number;
  providerId: number;

  title: string;
  tripHillId:number;
  location: string;
  time: any;
  description: string;
  conditionStr: string;

  minCount: number;
  maxCount: number;
  enabled: boolean;

  deadLine: any;

  createdDate: any;
  lastUpdatedDate: any;

  tripHillName:string;
  ticketsMemberCount:number;
  ticketsNonMemberCount:number;

  tripRegistrations: TripRegistration[];
  myTripRegistrations: TripRegistration[];

  constructor(
  ){}
}
