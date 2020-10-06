export class Question {
  id:number;
  userId:number;
  userName:string;
  courseId:number;
  assignedUserId:number;
  providerId:number;
  title:string;
  isOpen:boolean;

  createdDate:any;
  lastUpdatedDate:any;

  // for display only;
  readonly iconId:number;
  readonly iconUrl:string;
  readonly courseName:string;

  // for accept video in question and answer;
  acceptVideo:boolean;

  hide:boolean;

  constructor() {
  }
}
