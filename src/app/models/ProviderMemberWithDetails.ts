export class ProviderMemberWithDetails {
  public id:number;
  public providerId:number;
  public userId:number;

  public startDate:any;
  public expireDate:any;
  public description:string;
  public activated:boolean;
  public providerMemberTypeId:number;  // This is the providerMemberType, which is provider defined memberType(code);
  public providerMemberTypeName:string;

  public paymentStatusId:number;
  public paymentStatusName:string;

  public userName:string;
  public providerName:string;

  public hide:boolean;

  constructor(
  ){}
}
