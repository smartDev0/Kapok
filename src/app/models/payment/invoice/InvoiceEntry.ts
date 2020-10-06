export class InvoiceEntry {
  id:number;
  invoiceCalculationId:number;
  priceTypeId:number;  // course, membership, lift, rental;
  name:string;
  unitPrice:number;
  num:number;
  description:string;
  sequence:number;
  sessionCount:number;

  // These two discount normally should not be present both;
  discountAmount:number;
  discountAmountDescription:string;
  discountPercentage:number;  // ie. 0.25 means 25% discount;
  discountPercentageDescription:string;

  constructor(
  ){}

}
