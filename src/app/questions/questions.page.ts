import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {

  public questions: any = [];
  public question: any = {};
  public answers: Array<any> = [];
  public currentIndex: number;
  public count: number;
  public questionLanguage: any = '';
  public chooseOption: any;
  public appID: string;

  constructor(
    private api: RestApiService,
    public authService: AuthService,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.appID = 'drivingAPP';
    this.questions = [];
    this.answers = [];
    this.count = 0;
    this.currentIndex = 0;
    this.chooseOption = '';
    this.questionLanguage = 'english';
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams !== undefined && queryParams.count !== undefined && queryParams.count !== '') {
      this.count = queryParams.count;
    }
    if (queryParams !== undefined && queryParams.language !== undefined && queryParams.language !== '') {
      this.questionLanguage = queryParams.language;
    }

    if (queryParams !== undefined && queryParams.slug !== undefined && queryParams.slug !== '') {
      this.fetchQuestions(queryParams.slug, this.count);
    }
  }

  fetchQuestions(slug, count) {
    let queryParams = '?app_id=' + this.appID;
    queryParams += 'limit = ' + count;
    queryParams += 'search_category = ' + slug;
    this.api.getStaticData('api/quiz' + queryParams).subscribe(result => {
      const response: any = result;
      if (response.body !== undefined) {
        const res = response.body;
        if (res !== undefined) {
          if (res.status === 'success') {
            this.questions = res.data;
            this.count = this.questions.length;
            this.question = this.questions[this.currentIndex];
          } else {
            // this.formError = res.message;
          }
        }
      }
    }, err => {
      console.log(err);
    });
  }

  setAnswers() {
    if (this.answers[this.currentIndex] !== undefined) {
      this.answers[this.currentIndex] = {
        title: this.question.title, title_tamil: this.question.title_tamil, selected_option: this.chooseOption
      };
    } else {
      this.answers.push({title: this.question.title, title_tamil: this.question.title_tamil, selected_option: this.chooseOption});
    }
  }

  fetchNextQuestion(type) {
    if (type === 'inc') {
      this.currentIndex++;
    } else {
      this.currentIndex--;
    }
    this.question = this.questions[this.currentIndex];
    this.chooseOption = (this.answers[this.currentIndex] !== undefined) ? this.answers[this.currentIndex].selected_option : '';
  }

  goPrev() {
    this.setAnswers();
    this.fetchNextQuestion('desc');
  }

  goNext() {
    this.setAnswers();
    this.fetchNextQuestion('inc');
  }

  selectOption(optionId) {
    this.chooseOption = optionId;
  }

  getChecked(optionId) {
    if (this.chooseOption === optionId) {
      return true;
    } else {
      return false;
    }
  }

  submitAnswers() {
    this.setAnswers();
    this.saveAnswers();
  }

  saveAnswers() {
    this.router.navigate(['/questions/thankyou'], { queryParams: { percent: '90' , participationId: 1, language: this.questionLanguage} });
  }

}
