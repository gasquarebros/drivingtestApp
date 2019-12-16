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
    public router: Router) { 
      console.log('constructor');
  }

  ngOnInit() {
    this.userData = new Userdata();
    this.userData.acitivty = [];
    this.authService.getUserInfo().then(items => {
      this.userInfo = items;
      this.userData.customer_photo = items.siteuser_profile_img;
      this.userData.customer_last_name = items.lastname;
      this.userData.customer_first_name = items.firstname;
      this.userData.levelName = 'Level 1';
      this.fetchUserActivity();
    });
  }

  ionViewWillEnter(){
    this.ngOnInit();
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
    this.router.navigate(['/useractivity'], { queryParams: { selectedCategory: this.selectedType , selectedLevel: this.selectedMethod} });
  }

}
