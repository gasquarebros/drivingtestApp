import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ToastController, LoadingController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'underscore';
import { MustMatch } from './mustMatch.validator';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.page.html',
  styleUrls: ['./myprofile.page.scss'],
  providers: [AuthService]
})
export class MyprofilePage implements OnInit {

  public userInfo: any;

  public formError: any;

  base64Image: any = '';
  image: any = '';
  @ViewChild('fileInput', {static: false}) fileInput;

  validations_changePassword: FormGroup;
  validations_form: FormGroup;
  valildation_changePassMessage = {
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Password cannot be more than 255 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'mustMatch', message: 'Password and Confirm Password not matched'}
    ]
  }
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
    public camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    private storage: Storage,
    public formBuilder: FormBuilder) { 
  }

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;
    this.validations_changePassword = this.formBuilder.group({
      password: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.required
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required
      ]))
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    this.validations_form = this.formBuilder.group({
      firstname: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.required
      ])),
      lastname: new FormControl( '', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(1)
      ])),
      dob: new FormControl( ''),
      gender: new FormControl( ''),
      username: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})'),
        Validators.required
      ])),
      phoneno: new FormControl('', Validators.compose([
        Validators.maxLength(12),
        Validators.minLength(5),
        Validators.pattern('[0-9]{5,10}'),
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.required
      ])),
    });

    this.authService.getUserInfo().then(items => {
      this.userInfo = items;

      this.validations_form = new FormGroup({
        firstname: new FormControl(this.userInfo.firstname, Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(5),
          Validators.required
        ])),
        lastname: new FormControl( this.userInfo.lastname, Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(1)
        ])),
        dob: new FormControl(this.userInfo.birthday),
        gender: new FormControl(this.userInfo.gender),
        username: new FormControl(this.userInfo.username, Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(5),
          Validators.required
        ])),
        email: new FormControl(this.userInfo.email, Validators.compose([
          Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})'),
          Validators.required
        ])),
        phoneno: new FormControl(this.userInfo.phoneno, Validators.compose([
          Validators.maxLength(12),
          Validators.minLength(5),
          Validators.pattern('[0-9]{5,10}'),
          Validators.required
        ])),
      });

    });
    //this.presentLoadingWithOptions();
    //this.loadingController.dismiss();
  }

  private validateAreEqual(fieldControl: FormControl) {
    return fieldControl.value === this.validations_changePassword.get("Password").value ? null : {
        NotEqual: true
    };
  }

  
  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      // title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType) {
    // Create options for the Camera Dialog
    const options: CameraOptions = {
      sourceType: sourceType,
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 600,
      targetHeight: 600,
      saveToPhotoAlbum: false
    };

    if (Camera['installed']) {
      this.camera.getPicture(options).then((imageData) => {
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        try {
          this.fileInput.nativeElement.click();
        } catch (err) {
          console.log(err);
          // this.presentToast('Sorry!! Something went wrong.');
        }
      });
    } else {
      this.fileInput.nativeElement.click();
    }
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

  updateProfile(form) {
    const body = new FormData();
    body.append('firstname', form.firstname);
    body.append('lastname', form.lastname);
    body.append('username', form.username);
    body.append('email', form.email);
    body.append('password', form.password);
    body.append('birthday', form.dob);
    body.append('gender', form.gender);
    body.append('phoneno', form.phoneno);
    body.append('userid', this.userInfo.id);
    this.api.postData('api/login/updateprofile', body).subscribe(result => {
      const res: any = result;
      let message = '';
      if (res !== undefined) {
        if (res[0].status === 'success') {
          this.storage.set('USER_DATA_drivingApp', res[0].data);
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
