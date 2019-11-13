import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-demo-landing',
  templateUrl: './demo-landing.page.html',
  styleUrls: ['./demo-landing.page.scss'],
})
export class DemoLandingPage implements OnInit {

  public demoLevels: Array<any> = [];
  public questionLanguage;
  public categoryName;
  public category;

  constructor(private api: RestApiService,
    public authService: AuthService,
    private route: ActivatedRoute,
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

  fetchlevels(slug) {
    this.demoLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  getQuestions(demolevel) {
    this.router.navigate(['/questions'], { queryParams: { slug: this.category, level: demolevel, language: this.questionLanguage, type: 'demo' } });
  }

}
