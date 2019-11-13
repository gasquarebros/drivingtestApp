import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  public category: any = [];
  public count: any;
  public selLanguage: string;
  public selDifficulity: string;
  public userInfo;

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 2,
    autoplay: false
  };
  constructor(
    private router: Router,
    private api: RestApiService,
    public authService: AuthService,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.selDifficulity = 'demo';
    this.authService.getUserInfo().then(items => {
      this.userInfo = items;
    });
    this.selLanguage = 'english';
    this.fetchCategory();
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

  fetchCategory() {
    this.presentLoadingWithOptions();
    this.api.getStaticData('api/category').subscribe(result => {
      this.loadingController.dismiss();
      const response: any = result;
      if (response.body !== undefined) {
        const res = response.body;
        if (res !== undefined) {
          if (res.status === 'success') {
            this.category = res.data;
          } else {
            this.category = [];
          }
        }
      }
    }, err => {
      console.log(err);
    });
  }

  changeValue(data, type) {
    if (type === 'count') {
      this.count = data.detail.value;
    } else if(type === 'difficulity') { 
      this.selDifficulity = data.detail.value;
    } else {
      this.selLanguage = data.detail.value;
    }
  }

  startTest(category) {
    if(this.selDifficulity == 'demo') {
      this.router.navigate(['/demo-landing'], { queryParams: { slug: category, language: this.selLanguage}});
    } else {
      this.router.navigate(['/level-landing'], { queryParams: { slug: category, language: this.selLanguage}});
    }
    // this.router.navigate(['/questions'], { queryParams: { slug: category, limit: this.count, language: this.selLanguage } });
  }

}
