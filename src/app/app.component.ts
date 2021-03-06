import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Events, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AuthService, Events]
})
export class AppComponent {

  public userInfo: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    public router: Router,
    public events: Events,
    public menuCtrl: MenuController,
  ) {
    this.initializeApp();
    this.events.subscribe('user:login', () => {
      this.loggedIn();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // let status bar overlay webview
      // this.statusBar.overlaysWebView(true);

      // set status bar to white
      this.statusBar.backgroundColorByHexString('#ffffff');
      this.splashScreen.hide();
    });
    
  }

  loggedIn() {
    console.log('logged inn');
    setTimeout(() => {
      this.authService.getUserInfo().then(items => {
        this.userInfo = items;
        console.log(this.userInfo);
      });
    }, 100);
  }
  logout() {
    this.menuCtrl.close('content1');
    this.authService.removeUserInfo();
    this.router.navigateByUrl('/login');
  }
  profile() {
    this.menuCtrl.close();
  }
}
