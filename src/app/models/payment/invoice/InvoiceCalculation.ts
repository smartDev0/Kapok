import {InvoiceEntry} from "./InvoiceEntry";

export class InvoiceCalculation {
  id:number;
  discountAmountBeforeTax:number;
  discountAmountBeforeTaxDescription:string;
  discountPercentageBeforeTax:number;
  discountPercentageBeforeTaxDescription:string;

  taxRate:number;  // for example: 0.135 means 13.5% tax;
  taxRateDescription:string;
  tax:number;

  discountAmountAfterTax:number;
  discountAmountAfterTaxDescription:string;

  discountMemberAmount:number;
  discountMemberAmountDescription:string;
  discountMemberPercentage:number;
  discountMemberPercentageDescription:string;

  // Identify where this calculation used.
  // format: tablename-id;
  source:string;
  entries:InvoiceEntry[];

  total:number;

  constructor(
  ){}

}
