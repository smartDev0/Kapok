import {ConfigureEntry} from "./ConfigureEntry";

export class ConfigureGroup {
  name:string;
  description:string;
  enabled:boolean;
  sequence:number;
  entries:ConfigureEntry[];

  constructor(
  ){}
}
