import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-level-landing',
  templateUrl: './level-landing.page.html',
  styleUrls: ['./level-landing.page.scss'],
})
export class LevelLandingPage implements OnInit {

  public demoLevels: Array<any> = [];
  public questionLanguage;
  public categoryName;
  public category;

  constructor(private route: ActivatedRoute,
    private api: RestApiService,
    public authService: AuthService,
    public loadingController: LoadingController,
    public router: Router) { }

  ngOnInit() {
    this.categoryName = "Basic Theory Test";
    this.questionLanguage = 'english';

    const queryParams = this.route.snapshot.queryParams;
    if (queryParams !== undefined && queryParams.language !== undefined && queryParams.language !== '') {
      this.questionLanguage = queryParams.language;
    }

    if (queryParams !== undefined && queryParams.slug !== undefined && queryParams.slug !== '') {
      this.category = queryParams.slug;
      this.fetchlevels(queryParams.slug);
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

  fetchlevels(slug) {
    this.presentLoadingWithOptions();
    this.api.getStaticData('api/quiz/getlevels?search_level=level').subscribe(result => {
      this.loadingController.dismiss();
      const response: any = result;
      if (response.body !== undefined) {
        const res = response.body;
        if (res !== undefined) {
          if (res.status === 'success') {
            this.demoLevels = res.data;
          }
        }
      }
    });
    // this.demoLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  getQuestions(demolevel) {
    this.router.navigate(['/questions'], { queryParams: { slug: this.category, level: demolevel.id, language: this.questionLanguage, type: 'level' } });
  }

}
