
export class GeneralPaginationRequest {
  start:number;
  numberOnPage:number;
  parameter:string;
  noMoreResult:boolean;
  needTotal:boolean;

  // For get skiCourses;
  providerId:number;
  instructorId:number;
  memberId:number;
  startTime:any;
  endTime:any;

  // for return back searched result;
  results:any[];

  constructor(start:number, numberPage:number){
    this.start = start;
    this.numberOnPage = numberPage;
    this.noMoreResult = false;
    this.needTotal = true;
  }
}
