

export class TimerUtil {
  // parameters:
  // public context_this:any;
  // public timeOut:number;
  // public checkingCall:any;
  // public timeOutCall:any;

  // All in milliseconds;
  timeOutDelay:any = 10*60*1000; // default wait 10 minutes;
  startCheckingDelay:any = 9*60*1000;  // default start check in 9 minutes;
  timeCheckGap:any = 10*1000; // time gap between each checking 10 seconds;

  checkingCallback:any = null;  // callback for timeout event;
  timeOutCallback:any = null;   // callback for each checking event;

  startTimer:any = null;
  checkingTimer:any = null;
  timeOutTimer:any = null;

  constructor(private context_this:any, private timeOut:number, private checkingCall:any, private timeOutCall:any) {
    if(this.timeOut>0){
      this.timeOutDelay = this.timeOut*60*1000;
    }
    this.startCheckingDelay = this.timeOutDelay - this.timeCheckGap;
    this.checkingCallback = this.checkingCall;
    this.timeOutCallback = this.timeOutCall;

    this.start();
  }

  private start(){
    let l_this = this;
    this.startTimer = setTimeout(function () {
      console.log('Wait to start checking...');
      l_this.startChecking(l_this);
    }, this.startCheckingDelay);

    this.timeOutTimer = setTimeout(function () {
      console.log('Time out now...');
      l_this.doTimeout(l_this);
    }, this.timeOutDelay);
  }

  public stop(l_this:any){
    if(l_this.startTimer){
      clearTimeout(l_this.startTimer);
      l_this.startTimer = null;
    }

    if(l_this.checkingTimer){
      clearTimeout(l_this.checkingTimer);
      l_this.checkingTimer = null;
    }

    if(l_this.timeOutTimer){
      clearTimeout(l_this.timeOutTimer);
      l_this.timeOutTimer = null;
    }
  }


  private startChecking(l_this:any){
    if(l_this.startTimer){
      clearTimeout(l_this.startTimer);
      l_this.startTimer = null;
    }

    l_this.checkingTimer = setInterval(function(){
      console.log("checking...");
      if(l_this.checkingCallback){
        l_this.checkingCallback(l_this.context_this);
      }
    }, l_this.timeCheckGap);
  }

  private doTimeout(l_this:any){
    l_this.stop(l_this);

    console.log("Timeout fired.");
    if(l_this.timeOutCallback){
      l_this.timeOutCallback(l_this.context_this);
    }
  }
}
