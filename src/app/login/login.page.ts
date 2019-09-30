import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { RestApiService } from '../rest-api.service';
import { Storage } from '@ionic/storage';
import { Events } from '@ionic/angular';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [ AuthService, Events]
})
export class LoginPage implements OnInit {
  public formError: string;
  public formForgotError: string;
  public showForgotSection: boolean = false;
  validations_form: FormGroup;
  validations_Forgot_form: FormGroup;
  validation_messages = {
    'username': [
      { type: 'required', message: 'EmailId/Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 255 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Password cannot be more than 255 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
  };
  validation_forgot_messages = {
    'email': [
      { type: 'required', message: 'EmailId is required.' },
      { type: 'pattern', message: 'Invalid Email' }
    ],
  };
  constructor(
    public formBuilder: FormBuilder,
    public api: RestApiService,
    private authService: AuthService,
    private storage: Storage,
    public events: Events,
    public myApp: AppComponent,
    private router: Router) {
  }

  ngOnInit() {
      this.validations_form = this.formBuilder.group({
        username: new FormControl('', Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(5),
          // Validators.pattern('^(?=.*[a-zA-Z])(?=.*[@0-9])[a-zA-Z0-9]+$'),
          Validators.required
        ])),
        password: new FormControl('', Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(5),
          Validators.required
        ])),
      });

      this.validations_Forgot_form = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})'),
          Validators.required
        ]))
      });

      this.authService.getUserInfo().then(items => {
        const userInfo = items;
        if (userInfo !== null) {
          this.router.navigateByUrl('/category');
          this.router.navigate(['/category']);
        }
      });
  }

  OpenSignup() {
    this.router.navigateByUrl('/signup');
  }

  showForgot() {
    this.showForgotSection = true;
    this.formForgotError = '';
  }
  goBack() {
    this.showForgotSection = false;
  }

  resetPassword(values) {
    this.formError = '';
    const body = new FormData();
    body.append('email', values.email);
    this.api.postData('api/login', body).subscribe(result => {
      const res: any = result;
      if (res !== undefined) {
        if (res[0].status === 'success') {
          this.showForgotSection = false;
        } else {
          this.showForgotSection = true;
          this.formForgotError = res[0].message;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  launchPage(values) {
    this.formError = '';
    const body = new FormData();
    body.append('username', values.username);
    body.append('password', values.password);
    this.api.postData('api/login', body).subscribe(result => {
      const res: any = result;
      if (res !== undefined) {
        if (res[0].status === 'success') {
          // this.storage.set('ACCESS_TOKEN', res[0].data.access_token);
          this.storage.set('USER_DATA_drivingApp', res[0].data);
          this.events.publish('user:login');
          this.myApp.loggedIn();
          this.router.navigateByUrl('/category');
        } else {
          this.formError = res[0].message;
        }
      }
    }, err => {
      console.log(err);
    });
  }



}
