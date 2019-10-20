import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { RestApiService } from '../../rest-api.service';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as _ from 'underscore';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {

  public showDetail: boolean;
  public formError: string;

  public reportQuestionId: any;
  public questions: Array<any>;

  public participationId: any;
  public reportQuestionSection: any;

  public questionLanguage: string;

  validations_form: FormGroup;
  validation_messages = {
    'answer': [
      { type: 'required', message: 'Answer is required.' }
    ]
  };

  constructor(
    public formBuilder: FormBuilder,
    public api: RestApiService,
    public navParams: NavParams,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.reportQuestionId = '';
    this.reportQuestionSection = '';
    this.showDetail = false;
    this.questionLanguage = 'english';
    this.participationId = this.navParams.data.participationId;
    this.questionLanguage = this.navParams.data.language;
    this.validations_form = this.formBuilder.group({
      answer: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
    this.fetchQuestions(this.participationId);
  }

  fetchQuestions(participationId) {
    const body = new FormData();
    body.append('participate_id', participationId.toString());
    this.api.postData('api/quiz/retreive-participate', body).subscribe(result => {
      const res: any = result;
      if (res !== undefined) {
        if (res[0].status === 'success') {
          console.log(res);
          const date = res[0].data;
          _.each(date.options, (option: any) => {
            const newopt = {
              id: option.quiz_participate_options_questionId,
              title: option.quiz_participate_options_question,
              title_tamil: option.quiz_participate_options_question,
              isCorrect: (option.quiz_participate_options_iscorrect === 1) ? true : false,
              your_answer: option.quiz_participate_options_options_answered,
              correct_answer: option.quiz_participate_options_correct_answer
            };
            this.questions.push(newopt);
          });
        } else {
          this.questions = [];
        }
      }
    }, err => {
      console.log(err);
    });
  }

  showForm(questionId) {
    this.showDetail = false;
    this.reportQuestionId = questionId;
    _.each(this.questions, (question: any) => {
      if (question.id === questionId) {
        this.reportQuestionSection = question;
      }
    });
  }

  hideForm() {
    this.showDetail = true;
    this.reportQuestionId = '';
    this.reportQuestionSection = '';
  }

  reportQuestion(values) {
    this.formError = '';
    const body = new FormData();
    body.append('question_id', this.reportQuestionId);
    body.append('answer', values.answer);
    this.api.postData('api/quiz/report-question', body).subscribe(result => {
      const res: any = result;
      if (res !== undefined) {
        if (res[0].status === 'success') {
          this.showDetail = false;
        } else {
          this.formError = res[0].error;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  goBack() {
    this.closeModalPopup();
  }

  closeModalPopup(data = '') {
    this.modalController.dismiss(data);
  }

}
