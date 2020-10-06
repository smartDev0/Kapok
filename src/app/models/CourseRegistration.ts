import {Student} from "./Student";
import {CourseRegistrationInvoice} from "./payment/coursePayment/CourseRegistrationInvoice";
import {Course} from "./Course";
import {SessionTime} from "./SessionTime";
import {InstructorWithDetails} from "./InstructorWithDetails";
import {ProviderCourseTypeWithDetails} from "./ProviderCourseTypeWithDetails";

export class CourseRegistration {
  public id: number;
  public userId: number;
// providerId can not be null, it's used for create skiCourse for;
  public providerId:number;
  public providerName:string;
  public title:string;

  // Carry in, for finding intructor and course;
  public providerCourseTypeId: number;
  public providerCourseTypeName:string;
  public providerCourseType:ProviderCourseTypeWithDetails; // for forward to ski-course-registration-confirm page as availableProviderCoruseTypes;
  public learnTypeId:number; // Ski or Snowboard;
  public learnTypeName:string;

  // for trip registration registering course;
  public tripRegistrationId:number;
  // for register course for trip;
  public tripId:number;

  /**
   * courseId:
   * are key fields to tell if this registration is for courseId (group course);
   */
  // Carry out, these fields will be filled out when course found or created;
  public courseId: number;
  public courseIdDeleted: number;

  public consentMandatory:boolean;
  public isConsent:boolean;

  public instructorId:number;
  public statusId: number;
  public paymentStatusId: number;
  public paymentStatusName:string;

  // studentNames is array of json object, contains field: name, gender, age, level
  public students:Student[];

  // For showing payment amount on courseRegistrationDetails page;
  public invoices:CourseRegistrationInvoice[];

  // For guest checkout;
  public email:string;
  public contactName:string;
  public phoneNumber:string;
  public weChatNum:string;

  // For display user checked out email;
  public userEmail:string;

  public isMember:boolean;

  public instructors:InstructorWithDetails[];

  public createdDate:any;
  public lastUpdatedDate:any;

  // readonly;
  public registerName:string;
  public instructorName:string;

  // For adding to skiCourse;
  public checked:boolean;

  public comments:string;

  // For sessionTimes added to this courseRegistration, for course package without deadline and session;
  // For registration from schedule by selected HourTripHills;
  public sessionTimes:SessionTime[];

  // for selected sessionTime for camp;
  public selectedSessionTimes:SessionTime[];
  public selectedSessionsStr:string; // for camp show sessionTimes in a string;

  // For transfer tripHillId when do registration;
  public tripHillId:number;
  // For SkiCourseRegistrations page;
  public tripHillName:string;
  // For show registering course name;
  public courseName:string;

  // For registering course through schedule or providerCourseType;
  public course:Course;

  // For tracking if already sent for payment;
  public alreadySent:boolean;

  // For confirm leave registrationConfirmPage and cancel the registration;
  public confirmedCancel:boolean;

  public hide:boolean;

  // for courseRegistration from schedule;
  public fromSchedule:boolean;

  // For schedule recurrence registration;
  public recurrenceId:number;
  public recurrenceExist:boolean;

  // For display only;
  public courseTime:any;

  constructor(
  ){}
}
