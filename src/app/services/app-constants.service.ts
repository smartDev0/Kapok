import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConstants {
  // This matches the iOS version: version 2.11, build 1;
  // ** all the minor version end with 0 is production release!!! the others are beta versions;
  public readonly appVersion:string = "3.26.0";
  public beta:boolean = false; // this come from server;


  public INITIAL_SERVICE_URL:string;



  // General service url;
  public BASE_URL:string; // Test on browser;

  public readonly ROOT_PAGE:string = '/available-mountains';
  public readonly LOGIN_PAGE = "login";

  public SORT_DISTANCE:string = 'distance';
  public SORT_TITLE:string = 'title';
  public SORT_TIME:string = 'time';
  public SORT_USERNAME:string = 'userName';


  // Token key;
  public readonly SAVED_USER = "SAVED_USER";
  public readonly SAVED_PROVIDER_CONTEXT = "SAVED_PROVIDER_CONTEXT";
  public readonly KAPOK_TOKEN:string = "KAPOK_TOKEN";
  public readonly CLIENT_VERSION_TOKEN = "CLIENT_VERSION_TOKEN";

  // Default NearBy filter id:
  public readonly NEARBY_FILTER_ID = -1001;
  public readonly QUICK_SEARCH_FILTER_ID = -1002;

  // Store language;
  public readonly STORE_LANGUAGE = "STORE_LANGUAGE";

  // To be retrieve from server;
  public readonly LANGUAGE_EN_ID = 1;
  public readonly LANGUAGE_FR_ID = 2;
  public readonly LANGUAGE_CN_ID = 3;

  public readonly GOOGLE_MAPS_PREFIX = "https://www.google.ca/maps/place/";

  // For comment service, to specify which class to comment on, like Provider, Event, Instructor, SkiCourse, etc.
  public readonly COMMENT_TYPE_PROVIDER = 1;
  public readonly COMMENT_TYPE_COURSE = 2;
  public readonly COMMENT_TYPE_INSTRUCTOR = 3;
  public readonly COMMENT_TYPE_COURSE_REGISTRATION = 4;

  // This is temporary for now, should be loaded for provider specific member types;
  public readonly BASIC_MEMBER_TYPE = 2;

  public readonly CODE_INSTRUCTOR_TIME_FREE = 1;
  public readonly CODE_INSTRUCTOR_TIME_FREE_NAME = 'Free';
  public readonly CODE_INSTRUCTOR_TIME_SEMI_PRIVATE = 2;
  public readonly CODE_INSTRUCTOR_TIME_SEMI_PRIVATE_NAME = "Semi Private";
  public readonly CODE_INSTRUCTOR_TIME_OCCUPIED = 3;
  public readonly CODE_INSTRUCTOR_TIME_OCCUPIED_NAME = 'Occupied';

  public readonly CODE_COURSE_PRIVATE = 1;
  public readonly CODE_COURSE_SEMI_PRIVATE = 2;
  public readonly CODE_COURSE_GROUP = 3;

  // Command for show where page came from:
  public readonly PAGE_FOR_PROVIDER:number = 1;
  public readonly PAGE_FOR_INSTRUCTOR:number = 2;
  public readonly PAGE_FOR_MEMBER:number = 3;
  public readonly PAGE_FOR_AVAILABLE:number = 4;
  public readonly PAGE_FOR_CHOOSE:number = 5;
  public readonly PAGE_FOR_PROGRAM_REQUESTS:number = 6;
  // public readonly PAGE_FOR_TRIP:number = 7;
  public readonly PAGE_FOR_CAMP:number = 8;

  // Commands for show favorites:
  public readonly PAGE_FOR_FAVORITE_COURSES:number = 1;
  public readonly PAGE_FOR_FAVORITE_INSTRUCTORS:number = 2;

  // Commands for show question and answers;
  public readonly PAGE_FOR_STUDENT_QUESTIONS:number = 1;
  public readonly PAGE_FOR_INSTRUCTOR_QUESTIONS:number = 2;

  public readonly INSTRUCTOR_LEVELS:number[] = [1,2,3,4];
  public readonly SKI_LEVELS:string[] = ["neverever","beginner","novice","intermediate","advanced"];

  private initPaymentId:number = 1;
  public readonly PAYMENT_UNPAID_ID = this.initPaymentId++;
  public readonly PAYMENT_FULLY_ID = this.initPaymentId++;
  public readonly PAYMENT_PRE_APPROVED = this.initPaymentId++;
  public readonly PAYMENT_CLIENT_TIMEOUT_ID = this.initPaymentId++;
  public readonly PAYMENT_SERVER_TIMEOUT_ID = this.initPaymentId++;
  public readonly PAYMENT_FAILED_ID = this.initPaymentId++;
  public readonly PAYMENT_CANCELLED_ID = this.initPaymentId++;
  public readonly PAYMENT_WAIVED_ID = this.initPaymentId++;
  public readonly PAYMENT_TOPAY_OFFLINE_ID = this.initPaymentId++;
  public readonly PAYMENT_PAID_OFFLINE_ID = this.initPaymentId++;
  public readonly PAYMENT_TOPAY_ONLINE_ID = this.initPaymentId++;
  public readonly PAYMENT_PAID_ONLINE_ID = this.initPaymentId++;

  // Course created type:
  public readonly COURSE_CREATED_FROM_TIME:number = 1;
  public readonly COURSE_CREATED_FROM_INSTRUCTOR:number = 2;
  public readonly COURSE_CREATED_FROM_PROVIDER_TYPE:number = 3;
  public readonly COURSE_CREATED_FROM_SCHEDULE:number = 3;

  // Course status type:
  public readonly COURSE_NEW = 1;
  public readonly COURSE_CONFIRMED = 2;
  public readonly COURSE_CANCELLED = 3;

  // Schedule recurrenceType;
  public readonly RECURRENCE_TYPE_ONDATE = 1;
  public readonly RECURRENCE_TYPE_DAILY = 2;
  public readonly RECURRENCE_TYPE_WEEKLY = 3;
  public readonly RECURRENCE_TYPE_MONTHLY = 4;
  public readonly RECURRENCE_TYPE_YEARLY = 5;


  // This for code updating FAB menu button, may not needed;
  // public readonly SCROLL_BTN_TIMEOUT = 3000;

  // 1: course total price or package price; 2: per person price;
  public readonly PROVIDER_COURSE_TYPE_COUNT_BY_PACKAGE = 1;
  public readonly PROVIDER_COURSE_TYPE_COUNT_BY_STUDENT = 2;

  public readonly SCHEDULE_TYPE_WEEKLY = 1;
  public readonly SCHEDULE_TYPE_MONTHLY = 2;
  public readonly SCHEDULE_TYPE_SPECIALDAY = 3;

  public readonly MAX_SCORE = 5;

  public readonly MAX_STRING_LENGTH = 150;
  public readonly MAX_STRING_DESCRIPTION = 150;

  public readonly SEARCH_BAR_SHOW_DELAY = 5000;  // search bar will hide after 5 seconds;

  public readonly CALLBACK_HOOKED_COMPONENT = "CALLBACK_HOOKED_COMPONENT";

  public readonly MEDIA_IMAGE = 1;
  public readonly MEDIA_VEDIO = 2;
  public readonly MEDIA_OTHERS = 100;

  public readonly MAX_UPLOAD_FILE_SIZE=30*1000*1000; // 30M;
  public readonly URL_EXPIRED = "expired";

  public readonly DEADLINE_BEFORE_START_TIME = 0; // hours;

  public readonly SCHEDULE_TYPE_TIME = 1;
  public readonly SCHEDULE_TYPE_COURSE = 2;

  public readonly weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  constructor() {
	  console.log('Hello AppConstants Provider');
  }
}
