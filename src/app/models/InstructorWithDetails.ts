export class InstructorWithDetails {
  public id:number;
  public providerId:number;
  public userId:number;
  public skiLevel:number;
  public boardLevel:number;

  public skiCertificatedDate:any;
  public snowboardCertificatedDate:any;
  public expireDate:any;
  public description:string;
  public activated:boolean;

  public userName:string;
  public name:string;
  public email:string;
  public score:number;
  public reviewCount:number;

  public iconId:number;
  public iconUrl:string;
  public iconFullUrl:string;

  // for youtube video ids; separated by ';';
  public youtubeLinks:string;

  public hide:boolean;
  // hide for if no available schedule recurrenceInstance;
  public hideByNoSchedule:boolean;

  constructor(
  ){}
}
