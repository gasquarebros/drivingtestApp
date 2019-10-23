import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'underscore';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.page.html',
  styleUrls: ['./myprofile.page.scss'],
  providers: [AuthService]
})
export class MyprofilePage implements OnInit {

  public userInfo: any;

  public formError: any;


  validations_form: FormGroup;
  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Password cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'email': [
      { type: 'required', message: 'EmailId is required.' },
      { type: 'pattern', message: 'Invalid Email' },
      { type: 'validEmail', message: 'Your Email has already been taken.' }
    ],
    'firstname': [
      { type: 'required', message: 'Firstname is required.' },
    ],
    'phoneno': [
      { type: 'required', message: 'Phone number is required' },
      { type: 'pattern', message: 'Invalid Phone number' },
    ]
  };

  constructor(public loadingController: LoadingController,
    private api: RestApiService,
    public authService: AuthService,
    private route: ActivatedRoute,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder) { 
  }

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

  updateProfile(formValues) {
    const body = new FormData();
    _.each(formValues, function(val: any, key: any) {
      body.append(key, val);
    });
    body.append('user_id', this.userInfo.bg_user_id);
    this.api.postData('profile/updateInfo', body).subscribe(result => {
      const res: any = result;
      let message = '';
      if (res !== undefined) {
        if (res[0].status === 'success') {
          message = 'Profile updated successfully';
        } else {
          this.formError = res[0].error;
          message = 'Please provide proper details';
        }
      } else {
        message = 'Something went Wrong, Try again later';
      }
      this.presentToastWithOptions(message);
    });
  }

}
