
export class VerifyPreApprovedPaymentRequest {
  providerId:number;
  email:string;
  verifyCode:string;
  invoiceId:number;

  constructor(providerId:number, email:string, verifyCode:string, invoiceId:number){
    this.providerId = providerId;
    this.email = email;
    this.verifyCode = verifyCode;
    this.invoiceId = invoiceId;
  }
}
