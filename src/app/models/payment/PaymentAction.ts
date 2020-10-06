export class PaymentAction {
  id:number;
  providerId:number;
  userId:number;
  invoiceId:number;
  paymentNonce:string;
  message:string;
  statusId:number;
  prePaymentId:number;

  amount:number;
  title:string;

  constructor(
  ){}
}
