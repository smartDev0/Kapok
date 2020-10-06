export class CancelRegistrationAction {
  providerId:number;
  registrationId:number;

  // for checking access;
  email:string; // for guest checked out using email;
  userId:number;

  constructor(
  ){}
}
