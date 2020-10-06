
export class PriceUnit {
  id:number;
  title:string;
  providerId:number;
  providerMemberTypeId:number;
  providerMemberTypeName:string;

  /**
   * Base prices fields for course;
   */
  coursePrice:number;

  /**
   * membership price;
   */
  membershipPrice:number;


  discountThreshHold:number;
  tripHillId:number;
  tripHillName:string;

  /**
   * Extra price fields for lift, rental, helmet, etc;
   * These prices are for students;
   */
  liftPrice:number;
  skiBoardRentalPrice:number;
  helmentRentalPrice:number;

  /**
   * Late registration fee; After registration deadline;
   */
  latePriceAmount:number;
  latePricePercentage:number;

  providerCourseTypeId:number;
  providerCourseTypeName:string;

  learnTypeId:number;
  learnTypeName:string;
  enabled:boolean;
  description:string;
  comments:string;
  effectiveTime:any;
  expireTime:any;
  minStudentCount:number;
  maxStudentCount:number;
  discountAmount:number;
  discountPercentage:number;
  discountAmountDescription:string;
  discountPercentageDescription:string;

  createdDate:any;
  lastUpdatedDate:any;

  constructor(
  ){}
}
