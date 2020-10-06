export class UserInfo {
  public id: number;
  public userName: string;
  public email: string;
  public phoneNumber: string;
  public weChatNum: string;
  public age:number;
  public languageId: number;
  public languageName: string;
  public iconId:number;
  public name:string;
  public region:string;
  public genderId:number;
  public genderName:number;
  public friendNeedConfirmation:boolean;
  public favorites:string;
  public iconUrl:string;
  public description:string;
  public isInstructor:boolean;  // is a instructor of any school;
  public isSiteAdmin:boolean;
  public blocked:boolean; // For blocking user;

  public userTypeId:number;
  public locked:boolean;
  public token:string;

  // for display;
  public checked:boolean;

  // For top menu ACL;
  public hasAnyProviderAccount:boolean;

  // For show instructor popup;
  public skiLevel:number;
  public boardLevel:number;

  constructor(){}
}
