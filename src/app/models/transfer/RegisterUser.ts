export class ACLUser {
  public userName:string;
  public email:string;
  public languageId:number;
  public password:string;
  public agreeTerms:boolean;

  constructor(email:string, password:string){
    this.email = email;
    this.password = password;
  }
}
