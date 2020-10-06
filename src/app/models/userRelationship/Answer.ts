import {AttachedFile} from '../AttachedFile';

export class Answer {
  id:number;
  userId:number;
  userName:string;
  iconId:number;
  iconUrl:string;
  questionId:number;
  content:string;

  createdDate:any;
  lastUpdatedDate:any;

  attachedFiles:AttachedFile[];

  constructor() {
  }
}
