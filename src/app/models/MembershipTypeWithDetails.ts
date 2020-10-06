import {PriceUnit} from "./payment/coursePayment/PriceUnit";

export class ProviderMemberTypeWithDetails {
  id:number;
  providerId:number;
  name:string;
  memberTypeCodeId:number;
  memberTypeCodeName:string;
  price:number;
  description:string;
  lastUpdatedDate:any;
  activated:boolean;

  membershipPrices:PriceUnit;
  coursePrices:PriceUnit[];

  expiredInMonths:number;
  expiredInDays:number;
  expiredOnDayOfYear:any;

  constructor(
  ){
    this.activated = true;
  }
}
