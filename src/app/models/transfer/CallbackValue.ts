export class CallbackValue {
  public target:string;
  public values:any[];

  constructor(target:string, values:any[]){
    this.target = target;
    this.values = values;
  }
}
