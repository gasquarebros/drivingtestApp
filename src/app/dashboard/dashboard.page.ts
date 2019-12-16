import { Component, OnInit } from '@angular/core';
import { Userdata } from './userdata';

import { RestApiService } from '../rest-api.service';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public userInfo: any;
  public userData: Userdata;
  public selectedType: string = '';
  public selectedMethod: string = '';

  constructor(private route: ActivatedRoute,
    private api: RestApiService,
    public authService: AuthService,
    public loadingController: LoadingController,
    public router: Router) { }

  ngOnInit() {
    this.authService.getUserInfo().then(items => {
      this.userInfo = items;
      this.fetchUserActivity();
    });
    this.userData = new Userdata();
    this.userData.customer_photo = '';
    this.userData.customer_last_name = 'User';
    this.userData.customer_first_name = 'Info';
    this.userData.levelName = 'Level 1';
    this.userData.acitivty = [];
    
    //Retrieveactivity 
  }

  setFilterMethod(event) {
    this.selectedMethod = event;
    this.fetchUserActivity();
  }

  setFilterType(event) {
    this.selectedType = event;
    this.fetchUserActivity();
  }

  ngAfterViewInit() {
    /*if(this.userInfo == '' && this.userInfo == null || this.userInfo.id == '') {
      this.router.navigate(['/login']);
    }*/
  }

  fetchUserActivity() {
    this.userData.acitivty = [];
    let queryParams = 'userid=' + this.userInfo.id + '&limit=2&category_name='+this.selectedType+'&category_type='+this.selectedMethod;
    this.api.getStaticData('api/login/retrieveactivity?' + queryParams).subscribe(result => {
      const response: any = result;
      if (response.body !== undefined) {
        const res = response.body;
        if (res !== undefined) {
          if (res.status === 'success') {
            this.userData.acitivty = res.data;
          }
        }
      }
    });
  }

  showActivity() {
    this.router.navigate(['/useractivity']);
  }

}
