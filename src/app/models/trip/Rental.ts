
export class Rental {
  id: number;
  tripRegistrationId: number;

  firstName: string;
  lastName: string;

  rentalType: number;	// 1: ski; 2: snow board;
  height: number;		// cm;
  weight: number;		// kg;
  shoeSize: number;		// from 1 to 13 step by 0.5.
  ageRange:number;
  needHelmet: number;
  isMember: boolean;
  createdDate: any;
  lastUpdatedDate: any;

  constructor(
  ){}
}
