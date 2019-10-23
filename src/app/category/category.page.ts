import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  public category: any = [];
  public count: any;
  public selLanguage: string;

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 3,
    autoplay: false
  };
  constructor(
    private router: Router,
    private api: RestApiService,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
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
    } else {
      this.selLanguage = data.detail.value;
    }
  }

  startTest(category) {
    this.router.navigate(['/questions'], { queryParams: { slug: category, limit: this.count, language: this.selLanguage } });
  }

}
