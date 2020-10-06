import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, IonContent, ModalController} from "@ionic/angular";
import {InvoiceCalculation} from "../../../models/payment/invoice/InvoiceCalculation";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateUtil} from "../../../services/translate-util.service";
import {AppConstants} from '../../../services/app-constants.service';

@Component({
  selector: 'app-course-calculation-details',
  templateUrl: './course-calculation-details.page.html',
  styleUrls: ['./course-calculation-details.page.scss'],
})
export class CourseCalculationDetailsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  private actionSheet:any;

  public providerId:number;
  @Input() invCal:InvoiceCalculation;

  constructor(private route: ActivatedRoute, private router: Router, public modalController: ModalController,
              private actionsheetCtrl: ActionSheetController, public translateUtil:TranslateUtil, public appConstants:AppConstants) {
  }

  ngOnInit() {
    if(this.invCal){
      console.log("ngOnInit: Total: " + this.invCal.total);
    }
  }


  ionViewDidEnter() {

  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  onClose(){
    this.modalController.dismiss();
  }

  hasDiscount(){
    if(!this.invCal){
      return false;
    }
    if(this.invCal.discountAmountBeforeTax>0 || this.invCal.discountPercentageBeforeTax>0 || this.invCal.discountAmountAfterTax ||
      this.invCal.discountMemberAmount>0 || this.invCal.discountMemberPercentage>0){
      return true;
    }else{
      return false;
    }
  }

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('Close'),
          handler: () => {
            this.onClose();
          }
        },
      ]
    });
    this.actionSheet.present();
  }

}
