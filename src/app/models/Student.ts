export class Student {
  id:number;
  name: string;

  ageRangeOptionId:number;
  levelOptionId:number;

  useBirthDay:boolean;
  birthDay:any;

  liftTicket: boolean;
  skiRental:boolean;
  helment:boolean;
  comments:string;
  userId:number;

  ageRangeOptionName:string;
  levelOptionName:string;

  // For validate skiRegistration student;
  public error:string;

  constructor() {
  }
}
