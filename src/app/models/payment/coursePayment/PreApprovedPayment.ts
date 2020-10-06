export class PreApprovedPayment {
  id:number;
  providerId:number;
  instructorId:number;
  email:string;
  verifyCode:string;
  maxAmount:number;
  enabled:boolean;
  comments:string;
  usedDate:any;
  createdDate:any;
  lastUpdatedDate:any;

  hide:boolean;

  constructor(
  ){}
}
