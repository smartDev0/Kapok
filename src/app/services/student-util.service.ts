import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentUtil {

  constructor() { }

  // getAgeGroupName(ageGroupId:number):string{
  //   ageGroupId = +ageGroupId;
  //   if(!ageGroupId || ageGroupId<1){
  //     return "";
  //   }else if(ageGroupId===1){
  //     return "6 and under";
  //   }else if(ageGroupId===2){
  //     return "age 7~12";
  //   }else if(ageGroupId===3){
  //     return "age 13~17";
  //   }else if(ageGroupId===4){
  //     return "age 18 above";
  //   }else{
  //     return "";
  //   }
  // }
  //
  // getAgeGroupId(age:number):number{
  //   age = +age;
  //   if(age<=6){
  //     return 1;
  //   }else if(age>=7 && age<=12){
  //     return 2;
  //   }else if(age>=13 && age<=17){
  //     return 3;
  //   }else if(age>=18){
  //     return 4;
  //   }else{
  //     return null;
  //   }
  // }
  //
  // getLevelName(level:number):string{
  //   level = +level;
  //   if(!level || level<1){
  //     return "";
  //   }else if(level===1){
  //     return "No experience";
  //   }else if(level===2){
  //     return "Beginner";
  //   }else if(level===3){
  //     return "Intermediate";
  //   }else if(level===4){
  //     return "Advanced";
  //   }else{
  //     return "";
  //   }
  // }
}
