import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';
import { timer } from 'rxjs';
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
  public categoryName: string = '';
  public categoryId;

  public timeLeft: number = 60;
  public interval;
  public displayTime: string = '';

  public type: string;

  public showallQuestions: boolean = false;
  public level;
  constructor(
    private api: RestApiService,
    public authService: AuthService,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.authService.getUserInfo().then(items => {
      this.userInfo = items;
    });
    this.categoryName = 'Basic Theory Test';
    this.appID = 'drivingAPP';
    this.questions = [];
    this.answers = [];
    this.count = 0;
    this.currentIndex = 0;
    this.chooseOption = '';
    this.questionLanguage = 'english';
    //this.categoryName = "";
    this.displayTime = '01:00';
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams !== undefined && queryParams.count !== undefined && queryParams.count !== '') {
      this.count = queryParams.count;
    }
    if (queryParams !== undefined && queryParams.language !== undefined && queryParams.language !== '') {
      this.questionLanguage = queryParams.language;
    }
    if (queryParams !== undefined && queryParams.level !== undefined && queryParams.level !== '') {
      this.level = queryParams.level;
      if (queryParams !== undefined && queryParams.type !== undefined && queryParams.type !== '') {
        this.type = queryParams.type;
      } else {
        this.type = '';
      }

      if (queryParams !== undefined && queryParams.slug !== undefined && queryParams.slug !== '') {
        this.fetchQuestions(queryParams.slug, this.count, queryParams.level, queryParams.type);
      }
    }
  }

  fetchQuestions(slug, count, levelID, type) {
    let queryParams = '?app_id=' + this.appID;
    queryParams += '&limit=-1';
    queryParams += '&search_category=' + slug;
    queryParams += '&search_level='+levelID;
    this.api.getStaticData('api/quiz' + queryParams).subscribe(result => {
      const response: any = result;
      if (response.body !== undefined) {
        const res = response.body;
        if (res !== undefined) {
          if (res.status === 'success') {
            this.questions = res.data;
            this.categoryName = this.questions[0].category_name;
            this.categoryId = this.questions[0].category_id;
            this.count = this.questions.length;
            this.question = this.questions[this.currentIndex];
            this.getCountPercentage();
            if(this.type === 'level') {
              this.timeLeft = res.timings.level;
              this.startTimer();
            }
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
    if (this.questionLanguage === 'english') {
      selectedoptions = this.chooseOption.option;
    } else {
      selectedoptions = this.chooseOption.option_tamil;
    }
    _.each(this.question.options, (options: any) => {
      if (options.is_answer == 1) {
        if (selectedOptionId === options.id) {
          isCorrect = 1;
        }
        correctAnswer = (this.questionLanguage === 'english') ? options.option : options.option_tamil;
      }
    });
    if (this.answers[this.currentIndex] !== undefined) {
      this.answers[this.currentIndex] = {
        'question_id': this.question.id,
        'question': (this.questionLanguage === 'english') ? this.question.title : this.question.title_tamil,
        'option_answer': selectedoptions,
        'is_correct': isCorrect,
        'correct_answer': correctAnswer
      };
    } else {
      this.answers.push({
        'question_id': this.question.id,
        'question': (this.questionLanguage === 'english') ? this.question.title : this.question.title_tamil,
        'option_answer': selectedoptions,
        'is_correct': isCorrect,
        'correct_answer': correctAnswer
      });
    }
  }

  showList() {
    this.showallQuestions = true;
  }

  fetchNextQuestion(type) {
    if (type === 'inc') {
      this.currentIndex++;
    } else {
      this.currentIndex--;
    }
    this.question = this.questions[this.currentIndex];
    this.chooseOption = (this.answers[this.currentIndex] !== undefined) ? this.answers[this.currentIndex].selected_option : '';
    this.getCountPercentage();
  }

  getCountPercentage() {
    const questionper: number = ((this.currentIndex+1)/this.count)*100;
    const remainper: number = 100 - questionper; 
    console.log(this.count);
    console.log(questionper);
    if(document.getElementById('background')) {
      document.getElementById('background').style.cssText = 'width: '+questionper+'%';
    }
  }

  goPrev() {
    this.setAnswers();
    this.fetchNextQuestion('desc');
  }

  goBack() {
    this.router.navigate(['/category']);
  }

  goNext() {
    this.setAnswers();
    this.fetchNextQuestion('inc');
  }

  getQuestions(index) {
    this.showallQuestions = false;
    this.currentIndex = index;
    this.question = this.questions[this.currentIndex];
    this.chooseOption = (this.answers[this.currentIndex] !== undefined) ? this.answers[this.currentIndex].selected_option : '';
    this.getCountPercentage();
  }

  selectOption(options) {
    this.chooseOption = options;
  }

  getChecked(optionId) {
    if (this.chooseOption  != undefined && this.chooseOption !='' && this.chooseOption.id === optionId) {
      return true;
    } else {
      return false;
    }
  }

  getPercentage() {
    let correctCount = 0;
    _.each(this.answers, (answer: any) => {
      if(answer.is_correct == 1) {
        correctCount += 1;
      }
    });
    return ((correctCount/this.count)*100).toFixed(2);
  }

  submitAnswers() {
    this.setAnswers();
    this.saveAnswers();
  }

  saveAnswers() {
    const body = new FormData();
    const percent = this.getPercentage();
    body.append('userid', (this.userInfo != '')? this.userInfo.id: '');
    body.append('question_language', this.questionLanguage);
    body.append('limit', this.count.toString());
    body.append('level', this.level); 
    body.append('percent', percent);
    body.append('categoryId', this.categoryId);
    body.append('categoryName', this.categoryName);
    body.append('questions', JSON.stringify(this.answers));
    this.api.postData('api/quiz/participate', body).subscribe(result => {
      const res: any = result;
      if (res !== undefined) {
        if (res[0].status === 'success') {
          this.router.navigate(['/questions/thankyou'], 
          { queryParams: { percent: percent , participationId: res[0].data.id, language: this.questionLanguage} });
          // this.router.navigateByUrl('/login');
        } else {
          // this.formError = res[0].form_error;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  startTimer() {
    // document.querySelector("circle").style.cssText = 'animation: countdown 60s linear infinite forwards';
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        const min = Math.floor(this.timeLeft/60);
        const sec = Math.floor(this.timeLeft%60);
        const hour = Math.floor(min/60);
        this.displayTime = ("0" + hour).slice(-2) + ':' + ("0" + min).slice(-2) + ':' + ("0" + sec).slice(-2);
      } else {
        this.pauseTimer();
        this.submitAnswers();
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  getAnswered(index) {
    if (this.answers[index] !== undefined) {
      return true;
    } else {
      return false;
    }
  }

}
