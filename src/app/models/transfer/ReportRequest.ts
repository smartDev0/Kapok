
export class ReportRequest {
  public providerId:number;
  public startTime:any;
  public endTime:any;
  public emails:string; // separate email address by ',' or ';'
  public downloadReport:boolean;
  constructor(){
  }
}
