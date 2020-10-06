import { Injectable } from '@angular/core';
import {AppConstants} from './app-constants.service';
import {ToastUtil} from './toast-util.service';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpUtil {
  public httpDelegate: any;

  constructor(private http: HttpClient, private toastUtil:ToastUtil, private appConstants:AppConstants,) {
    this.httpDelegate = this.http;
  }

  s_call(objName:string, urlStr:string, method:string, requestObj:any, keyStr?:string, groupKeyStr?:string, ttl?:number, callback?) {
    let requestMethod = null;
    if (method === "get") {
      if (urlStr) {
        urlStr = urlStr + "?" + new Date().getTime().toString();
        // console.log("get urlStr: " + urlStr);
      }
      requestMethod = this.httpDelegate.get(urlStr);
    } else if (method === "post") {
      requestMethod = this.httpDelegate.post(urlStr, requestObj);
    } else if (method === "put") {
      requestMethod = this.httpDelegate.put(urlStr, requestObj);
    } else if (method === "delete") {
      requestMethod = this.httpDelegate.delete(urlStr);
    } else {
      console.log("Error: Unknown http method: " + method);
    }

    requestMethod.subscribe((data: any) => {
      this.l_handleResult(data, callback);

      // .map(response => response.json())
      // .catch((error) => {
      //   console.log("Error!: " + error);
      //   if(error.status===401){
      //     this.appConstants.BASE_URL = null;
      //     this.toastUtil.showToast("Please login again.");
      //     this.l_handleResult(null, callback);
      //     return;
      //   }else{
      //     this.toastUtil.showToastForTime("Sending request to server failed. Please check your network connection. Also check if your have latest version of this app.", 5000);
      //   }
      //
      //   // load cache data here if available.
      //   // if(keyStr) {
      //   //   this.cache.getItem(keyStr)
      //   //     .catch(() => {
      //   //       console.log("Can not find catch or expired for key: " + keyStr);
      //   //     })
      //   //     .then((data) => {
      //   //       this.l_handleResult(data, callback);
      //   //     })
      //   // }
      // })
      // .subscribe(data => {
      //   // if(keyStr && data){
      //   //   this.cache.saveItem(keyStr, data, groupKeyStr);
      //   // }
      //   this.l_handleResult(data, callback);
      // });
    });
  }

  l_handleResult(data:any, callback:any){
    if(callback) {
      callback(data);
    }
  }
}
