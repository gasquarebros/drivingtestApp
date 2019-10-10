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

  public question_language: string;

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
    this.question_language = 'english';
    
    this.participationId = this.navParams.data.participationId;
    this.question_language = this.navParams.data.language;
    this.validations_form = this.formBuilder.group({
      answer: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
    this.fetchQuestions(this.participationId);
  }

  
  fetchQuestions(participationId) {
    const data = [
      {
        id: 1,
        title: 'The penalty for using mobile phone whilst driving is a fine not more than 1,000 dollars or maximum imprisonment of 6 months or both.',
        title_tamil: 'வாகனம் ஓட்டும்போது மொபைல் ஃபோனைப் பயன்படுத்துவதற்கான அபராதம் 1,000 டாலருக்கு மிகாமல் அபராதம் அல்லது அதிகபட்சம் 6 மாதங்கள் அல்லது இரண்டும் சிறைத்தண்டனை.',
        question: 'test',
        question_tamil: 'சோதனை',
        image: '',
        video: '',
        display_type: 'image',
        isCorrect: false,
        your_answer: 'false',
        correct_answer: 'both'
      },
      {
        id: 2,
        title: 'The penalty for using mobile phone whilst driving is a fine not more than 1,000 dollars or maximum imprisonment of 6 months or both.',
        title_tamil: 'வாகனம் ஓட்டும்போது மொபைல் ஃபோனைப் பயன்படுத்துவதற்கான அபராதம் 1,000 டாலருக்கு மிகாமல் அபராதம் அல்லது அதிகபட்சம் 6 மாதங்கள் அல்லது இரண்டும் சிறைத்தண்டனை.',
        question: 'test',
        question_tamil: 'சோதனை',
        image: '',
        video: '',
        display_type: 'image',
        isCorrect: true,
        your_answer: 'both',
        correct_answer: 'both'
      },
      {
        id: 3,
        title: 'The penalty for using mobile phone whilst driving is a fine not more than 1,000 dollars or maximum imprisonment of 6 months or both.',
        title_tamil: 'வாகனம் ஓட்டும்போது மொபைல் ஃபோனைப் பயன்படுத்துவதற்கான அபராதம் 1,000 டாலருக்கு மிகாமல் அபராதம் அல்லது அதிகபட்சம் 6 மாதங்கள் அல்லது இரண்டும் சிறைத்தண்டனை.',
        question: 'test',
        question_tamil: 'சோதனை',
        image: '',
        video: '',
        display_type: 'image',
        isCorrect: false,
        your_answer: 'false',
        correct_answer: 'both'
      },
      {
        id: 4,
        title: 'The penalty for using mobile phone whilst driving is a fine not more than 1,000 dollars or maximum imprisonment of 6 months or both.',
        title_tamil: 'வாகனம் ஓட்டும்போது மொபைல் ஃபோனைப் பயன்படுத்துவதற்கான அபராதம் 1,000 டாலருக்கு மிகாமல் அபராதம் அல்லது அதிகபட்சம் 6 மாதங்கள் அல்லது இரண்டும் சிறைத்தண்டனை.',
        question: 'test',
        question_tamil: 'சோதனை',
        image: '',
        video: '',
        display_type: 'image',
        isCorrect: false,
        your_answer: 'false',
        correct_answer: 'both'
      },
    ];
    this.questions = data;
  } 

  showForm(questionId) {
    this.showDetail = false;
    this.reportQuestionId = questionId;
    _.each(this.questions, (question: any) => {
      if (question.id == questionId) {
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
    body.append('questionId', this.reportQuestionId);
    body.append('answer', values.answer);
    this.api.postData('api/reportQuestion', body).subscribe(result => {
      const res: any = result;
      if (res !== undefined) {
        if (res[0].status === 'success') {
          this.showDetail = false;
        } else {
          this.formError = res[0].message;
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
