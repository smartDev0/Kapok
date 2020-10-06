export class AttachedFile {
  id:number;
  ownerUserId:number;
  name:string;
  title:string;
  fileName:string;
  extName:string;
  size:number;
  length:number;
  expire:boolean;
  lastAccessed:any;
  locked:boolean;
  createdDate:any;				// CreatedDate must not be changed, it's used to find the location of the video file.
  lastUpdatedDate:any;
  mediaType:number;   // 1: image, 2: video, 100: others;
  description:string;

  content:any;
  iconContent:any;

  based64Content:string;    // for downloading attached file content;

  // for inline editing description on page;
  isEdit:boolean;
  tempDescription:string;


  constructor(
  ){}
}
