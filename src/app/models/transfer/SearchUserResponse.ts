import {UserInfo} from "../../models/UserInfo";
export class SearchUserResponse {
  userId:number;
  userName:string;
  email:string;
  start:number;
  numberOnPage:number;

  users:UserInfo[];

  constructor(
  ){}
}
