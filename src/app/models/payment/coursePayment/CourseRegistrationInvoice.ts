import {InvoiceCalculation} from "../invoice/InvoiceCalculation";

export class CourseRegistrationInvoice {
  id:number;
  registrationId:number;
  amount:number;
  invoiceDate:any;
  statusId:number;
  createdDate:any;
  lastUpdatedDate:any;
  comments:string;

  statusName:string;

  invoiceCalculationId:number;
  invoiceCalculation:InvoiceCalculation;

  // already alerted on the payment details page;
  alerted:boolean = false;

  constructor(
  ){}
}
