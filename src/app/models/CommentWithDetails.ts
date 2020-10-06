export class CommentWithDetails {
  public ownerUserName:string;
  public id:number;
  public providerId:number;
  public fromUserId:number;
  public fromUserEmail:string;
  public fromLink:boolean;
  public entityId:number;
  public title:string;
  public comments:string;
  public createdDate:any;
  public lastUpdatedDate:any;
  public commentEntityTypeId:number;
  public commentEntityTypeName:string;
  public score:number;

  public courseName:string;
  public showRate:boolean;

  public hide:boolean; // for getItem search;

  constructor(
  ){}
}
