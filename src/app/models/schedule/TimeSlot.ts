
export class TimeSlot {
  id:number;
  recurrenceId:number;
  startTime:any;
  endTime:any;

  createdDate:any;
  lastUpdatedDate:any;

  minutesSlot:number;
  minutesSpaceBefore:number;
  minutesSpaceAfter:number;

  // for delete on page;
  tempId:number;

  constructor() {
  }
}
