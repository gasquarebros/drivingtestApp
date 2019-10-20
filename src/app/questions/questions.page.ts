import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';
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
  public userInfo: any = '';

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
    let selectedoptions = '';
    let correctAnswer =  '';
    let isCorrect = 0;
    const selectedOptionId = this.chooseOption.id;
    if(this.questionLanguage == 'english') {
      selectedoptions = this.chooseOption.option;
    } else {
      selectedoptions = this.chooseOption.option_tamil;
    }
    _.each(this.question.options, (options: any) => {
      if(options.is_answer == 1) {
        if(selectedOptionId === options.id) {
          isCorrect = 1;
        }
        correctAnswer = (this.questionLanguage == 'english') ? options.option: options.option_tamil;
      }
    });
    if (this.answers[this.currentIndex] !== undefined) {
      this.answers[this.currentIndex] = {
        'question_id': this.question.id, 
        'question': (this.questionLanguage == 'english') ? this.question.title : this.question.title_tamil, 
        'option_answer': selectedoptions, 
        'is_correct': isCorrect, 
        'correct_answer': correctAnswer
      };
    } else {
      this.answers.push({
        'question_id': this.question.id, 
        'question': (this.questionLanguage == 'english') ? this.question.title : this.question.title_tamil, 
        'option_answer': selectedoptions, 
        'is_correct': isCorrect, 
        'correct_answer': correctAnswer
      });
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

  selectOption(options) {
    this.chooseOption = options;
  }

  getChecked(optionId) {
    if (this.chooseOption !='' && this.chooseOption.id === optionId) {
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
    const body = new FormData();
    body.append('userid', (this.userInfo != '')? this.userInfo.id: '');
    body.append('question_language', this.questionLanguage);
    body.append('limit', this.count.toString());
    body.append('percent', '');
    body.append('questions', JSON.stringify(this.answers));
    this.api.postData('api/quiz/participate', body).subscribe(result => {
      const res: any = result;
      if (res !== undefined) {
        if (res[0].status === 'success') {
          this.router.navigate(['/questions/thankyou'], { queryParams: { percent: '90' , participationId: res[0].data.id, language: this.questionLanguage} });
          // this.router.navigateByUrl('/login');
        } else {
          // this.formError = res[0].form_error;
        }
      }
    }, err => {
      console.log(err);
    });
  }

}
