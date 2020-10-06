import {ConfigureGroup} from "./ConfigureGroup";

export class AppConfiguration {
  id:number;
  name:string;
  content:string;
  lastUpdatedDate:any;
  byUserId:number;
  noEmail:boolean;
  enableTag:boolean
  showBanner:boolean;
  bannerContent:string;

  configureGroups:ConfigureGroup[];

  constructor(
  ){}
}
