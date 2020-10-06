export class AdminUser {
  public id:number;
  public providerId:number;
  public userId:number;
  public startDate:any;
  public expireDate:any;
  public notes:string;
  public activated:boolean;

  public userName:string;

  constructor(providerId:number, userId:number, expireDate:any){
    this.providerId = providerId;
    this.userId = userId;
    this.expireDate = expireDate;
    this.activated = true;
  }
}
