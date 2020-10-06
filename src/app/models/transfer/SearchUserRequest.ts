export class SearchUserRequest {
  userId:number;
  email:string;
  userName:string;

  start:number;
  numberOnPage:number;

  noMoreResult:boolean;
  needTotal:boolean;

  constructor(
  ){
    this.start = 0;
    this.numberOnPage = 30;
    this.noMoreResult = false;
    this.needTotal = true;
  }
}
