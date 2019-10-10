import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { MenuController, PopoverController, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { ReportComponent } from './../report/report.component';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss'],
})
export class ThankyouComponent implements OnInit {

  public percentage: any;
  public participationId: number;
  public language: string;

  constructor(private route: ActivatedRoute,
    public popoverController: PopoverController,
    public modalController: ModalController,
    public loadingController: LoadingController,
    private toastCtrl: ToastController,
    public router: Router
  ) { }

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams !== undefined && queryParams.percent != undefined && queryParams.percent != '') {
      this.percentage = queryParams.percent;
    }
    if (queryParams !== undefined && queryParams.participationId != undefined && queryParams.participationId != '') {
      this.participationId = queryParams.participationId;
    }
    if (queryParams !== undefined && queryParams.language != undefined && queryParams.language != '') {
      this.language = queryParams.language;
    } else {
      this.language = 'english'
    }
  }

  async showFilter() {
    const modal = await this.modalController.create({
      component: ReportComponent,
      componentProps: {
        'participationId': this.participationId,
        'language': this.language
      }
    });
    return await modal.present();
  }

  gotoDash() {
    this.router.navigate(['/category']);
  }

}