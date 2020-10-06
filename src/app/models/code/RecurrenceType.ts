import {Recurrence} from "../schedule/Recurrence";

export class RecurrenceType {
  id:number;
  name:string;
  description:string;
  lastUpdatedDate:any;
  enabled:boolean;

  // for display recurrences in type;
  recurrences:Recurrence[];
  expended:boolean = false;
  selectedRecurrence:Recurrence;

  constructor(
  ){}
}
