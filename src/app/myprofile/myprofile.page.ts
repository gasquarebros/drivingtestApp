import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import * as _ from 'underscore';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.page.html',
  styleUrls: ['./myprofile.page.scss'],
  providers: [AuthService]
})
export class MyprofilePage implements OnInit {

  public userInfo: any;

  constructor(public loadingController: LoadingController,
    private api: RestApiService,
    public authService: AuthService,
    private route: ActivatedRoute,
    public toastCtrl: ToastController) { }

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;
    this.authService.getUserInfo().then(items => {
      const userInfo = items;
    });
    //this.presentLoadingWithOptions();
    //this.loadingController.dismiss();
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  async presentToastWithOptions(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      duration: 5000,
      position: 'bottom',
      closeButtonText: 'Done'
    });
    toast.present();
  }

}
