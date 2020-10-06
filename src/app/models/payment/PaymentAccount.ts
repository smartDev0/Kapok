export class PaymentAccount {
  id:number;
  providerId:number;
  //	DEVELOPMENT, QA, PRODUCTION, SANDBOX;
  environment:string;
  merchantId:string;
  publicKey:string;
  privateKey:string;
  enabled:boolean;
  createdDate:any;
  lastUpdatedDate:any;

  constructor(
  ){}
}
