import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IonRouterOutlet, IonSlides, NavController} from "@ionic/angular";
import {UserService} from "../../services/user-service.service";
import {TranslateUtil} from "../../services/translate-util.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../services/app-constants.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-test-wizard',
  templateUrl: './test-wizard.page.html',
  styleUrls: ['./test-wizard.page.scss'],
})
export class TestWizardPage  implements OnInit {
  @ViewChild('slides') slides: IonSlides;
  isSlideBegin:boolean = false;
  isSlideEnd:boolean = false;

  @ViewChild("formRef_1") formRef_1:NgForm;
  @ViewChild("formRef_2") formRef_2:NgForm;
  @ViewChild("formRef_3") formRef_3:NgForm;
  forms:NgForm[] = [];
  submits:boolean[] = [];
  finalSubmit:boolean = false;

  // Optional parameters to pass to the swiper instance.
  // See http://idangero.us/swiper/api/ for valid options.
  slideOpts = {
    initialSlide: 0,
    allowTouchMove: false,
    speed: 400,
    pagination: false,

  };

  firstName:string;

  constructor(public navCtrl: NavController, private userService:UserService, public translateUtil:TranslateUtil,
              private ionRouterOutlet: IonRouterOutlet, public router:Router, public appConstants:AppConstants,) {

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.forms = [];
    this.forms.push(this.formRef_1);
    this.forms.push(this.formRef_2);
    this.forms.push(this.formRef_3);
    this.checkBeginEnd();
  }

  goPrevious(){
    console.log("Good goPrevious.");
    this.slides.slidePrev().then((value:void) => {
      this.checkBeginEnd();
    });
  }

  continueSlide(){
    this.slides.getActiveIndex().then((index:number) => {
      console.log("activeIndex: " + index);
      if(index>=0){
        this.submits[index] = true;
        let currentForm:NgForm = this.forms[index];
        if(!currentForm){
          return;
        }

        if(!currentForm.valid){
          console.log("Form is not valid");
        }else{
          console.log("Good, form is valid, go to next slide.");
          if(index<this.forms.length-1){
            this.goNext();
          }else{
            this.submit();
          }
        }
      }
    });
  }

  goNext(){
    console.log("Good goNext.");
    this.slides.slideNext().then((value:void) => {
      this.checkBeginEnd();
    });
  }

  checkBeginEnd(){
    this.isSlideBegin = true;
    if(!this.slides){
      this.isSlideBegin = true;
    }else{
      this.slides.isBeginning().then((istrue) => {
        this.isSlideBegin = istrue;
      });
    }

    this.isSlideEnd = true;
    if(!this.slides){
      this.isSlideEnd = true;
    }else{
      this.slides.isEnd().then((istrue) => {
        this.isSlideEnd = istrue;
      });
    }
  }

  submit(){
    console.log("Good submit.");
    this.finalSubmit = true;
  }
}
