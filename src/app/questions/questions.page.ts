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
  public question_language: any = '';
  public chooseOption: any;

  constructor(
    private api: RestApiService,
    public authService: AuthService,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.questions = [];
    this.answers = [];
    this.count = 0;
    this.currentIndex = 0;
    this.chooseOption = '';
    this.question_language = 'english';
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams !== undefined && queryParams.slug != undefined && queryParams.slug != '') {
      this.fetchQuestions(queryParams.slug);
    }
  }

  fetchQuestions(slug) {
      const data = [
        {
          title: 'The penalty for using mobile phone whilst driving is a fine not more than 1,000 dollars or maximum imprisonment of 6 months or both.',
          title_tamil: 'வாகனம் ஓட்டும்போது மொபைல் ஃபோனைப் பயன்படுத்துவதற்கான அபராதம் 1,000 டாலருக்கு மிகாமல் அபராதம் அல்லது அதிகபட்சம் 6 மாதங்கள் அல்லது இரண்டும் சிறைத்தண்டனை.',
          question: 'test',
          question_tamil: 'சோதனை',
          image: '',
          video: '',
          display_type: 'image',
          options: [
            {
              option: 'true, and most likely licence will also be revoked',
              option_tamil: 'உண்மை, பெரும்பாலும் உரிமமும் ரத்து செய்யப்படும்',
              is_answer: 1,
              id: 1,
            },
            {
              option: 'false',
              option_tamil: 'தவறு',
              is_answer: 0,
              id: 2,
            },
            {
              option: 'true, and most likely licence will not be revoked',
              option_tamil: 'உண்மை, பெரும்பாலும் உரிமம் ரத்து செய்யப்படாது',
              is_answer: 0,
              id: 3,
            }
          ]
        },
        {
          title: 'The penalty for using mobile phone whilst driving is a fine not more than 1,000 dollars or maximum imprisonment of 6 months or both.',
          title_tamil: 'வாகனம் ஓட்டும்போது மொபைல் ஃபோனைப் பயன்படுத்துவதற்கான அபராதம் 1,000 டாலருக்கு மிகாமல் அபராதம் அல்லது அதிகபட்சம் 6 மாதங்கள் அல்லது இரண்டும் சிறைத்தண்டனை.',
          question: 'test',
          question_tamil: 'சோதனை',
          image: '',
          video: '',
          display_type: 'image',
          options: [
            {
              option: 'true, and most likely licence will also be revoked',
              option_tamil: 'உண்மை, பெரும்பாலும் உரிமமும் ரத்து செய்யப்படும்',
              is_answer: 1,
              id: 4,
            },
            {
              option: 'false',
              option_tamil: 'தவறு',
              is_answer: 0,
              id: 5,
            },
            {
              option: 'true, and most likely licence will not be revoked',
              option_tamil: 'உண்மை, பெரும்பாலும் உரிமம் ரத்து செய்யப்படாது',
              is_answer: 0,
              id: 6,
            }
          ]
        },
        {
          title: 'The penalty for using mobile phone whilst driving is a fine not more than 1,000 dollars or maximum imprisonment of 6 months or both.',
          title_tamil: 'வாகனம் ஓட்டும்போது மொபைல் ஃபோனைப் பயன்படுத்துவதற்கான அபராதம் 1,000 டாலருக்கு மிகாமல் அபராதம் அல்லது அதிகபட்சம் 6 மாதங்கள் அல்லது இரண்டும் சிறைத்தண்டனை.',
          question: 'test',
          question_tamil: 'சோதனை',
          image: '',
          video: '',
          display_type: 'image',
          options: [
            {
              option: 'true, and most likely licence will also be revoked',
              option_tamil: 'உண்மை, பெரும்பாலும் உரிமமும் ரத்து செய்யப்படும்',
              is_answer: 1,
              id: 7,
            },
            {
              option: 'false',
              option_tamil: 'தவறு',
              is_answer: 0,
              id: 8,
            },
            {
              option: 'true, and most likely licence will not be revoked',
              option_tamil: 'உண்மை, பெரும்பாலும் உரிமம் ரத்து செய்யப்படாது',
              is_answer: 0,
              id: 9,
            }
          ]
        },
        {
          title: 'The penalty for using mobile phone whilst driving is a fine not more than 1,000 dollars or maximum imprisonment of 6 months or both.',
          title_tamil: 'வாகனம் ஓட்டும்போது மொபைல் ஃபோனைப் பயன்படுத்துவதற்கான அபராதம் 1,000 டாலருக்கு மிகாமல் அபராதம் அல்லது அதிகபட்சம் 6 மாதங்கள் அல்லது இரண்டும் சிறைத்தண்டனை.',
          question: 'test',
          question_tamil: 'சோதனை',
          image: '',
          video: '',
          display_type: 'image',
          options: [
            {
              option: 'true, and most likely licence will also be revoked',
              option_tamil: 'உண்மை, பெரும்பாலும் உரிமமும் ரத்து செய்யப்படும்',
              is_answer: 1,
              id: 10,
            },
            {
              option: 'false',
              option_tamil: 'தவறு',
              is_answer: 0,
              id: 11,
            },
            {
              option: 'true, and most likely licence will not be revoked',
              option_tamil: 'உண்மை, பெரும்பாலும் உரிமம் ரத்து செய்யப்படாது',
              is_answer: 0,
              id: 12,
            }
          ]
        },
      ];
      this.questions = data;
      this.count = 4;
      this.question = this.questions[this.currentIndex];
  }

  setAnswers() {
    if(this.answers[this.currentIndex] != undefined) { 
      this.answers[this.currentIndex] = {title: this.question.title, title_tamil: this.question.title_tamil, selected_option: this.chooseOption};
    } else {
      this.answers.push({title: this.question.title, title_tamil: this.question.title_tamil, selected_option: this.chooseOption});
    }
  }

  fetchNextQuestion(type) {
    if(type == 'inc') {
      this.currentIndex++;
    } else {
      this.currentIndex--;
    }
    this.question = this.questions[this.currentIndex];
    this.chooseOption = (this.answers[this.currentIndex] != undefined)? this.answers[this.currentIndex].selected_option: '';
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
    if(this.chooseOption == optionId) {
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
    this.router.navigate(['/category'], { queryParams: { slug: '123123' } });
  }

}
