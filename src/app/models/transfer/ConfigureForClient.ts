
export class ConfigureForClient {
  public fromServer = false;
  public InvoiceExpireMinutes:number;  // default = 10 minutes;
  public clientRequiredVersion:string;
  public enableTag:boolean;
  public showBanner:boolean;
  public bannerContent:string;

  constructor(){
    this.InvoiceExpireMinutes = 10;
  }
}
