import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';


import { RestApiService } from '../rest-api.service';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import { CalendarComponentOptions } from 'ion2-calendar';

import { MenuController, PopoverController, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { ReportComponent } from './report/report.component';

import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult
} from 'ion2-calendar';

@Component({
  selector: 'app-useractivity',
  templateUrl: './useractivity.page.html',
  styleUrls: ['./useractivity.page.scss'],
  providers: [DatePipe]
})
export class UseractivityPage implements OnInit {

  public userInfo: any;
  public MonthsFilter: Array<string>;
  public selectedMonth: string;
  public selectedType: string;
  public selectedDateRange: Array<string>;
  public acitivty: Array<any>;

  public selectedCategory;
  public selectedLevel;

  dateRange: {
    from: Date;
    to: Date
  };

  constructor(private datePipe: DatePipe,
    public modalCtrl: ModalController,
    private route: ActivatedRoute,
    private api: RestApiService,
    public authService: AuthService,
    public loadingController: LoadingController,
    public router: Router) { }

  ngOnInit() {
    this.acitivty = [];
    this.authService.getUserInfo().then(items => {
      this.userInfo = items;
      this.fetchUserActivity();
    });

    this.selectedCategory = '';
    this.selectedLevel = '';

    this.selectedType = '';
    this.selectedDateRange = [];
    this.MonthsFilter = [];
    const currentMonth = this.getMonthNames(new Date().getMonth());
    this.MonthsFilter.push(currentMonth);
    
    const prevMonth = this.getMonthNames(new Date().getMonth() - 1);
    this.MonthsFilter.push(prevMonth);
    
    const secondPrevMonth = this.getMonthNames(new Date().getMonth() - 2);
    this.MonthsFilter.push(secondPrevMonth);
  }

  getMonthNames(monthNumber) {
    const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    return monthNames[monthNumber - 1];
  }

  fetchUserActivity() {
    let queryParams = 'userid=' + this.userInfo.id + '&limit=15&category_name='+this.selectedLevel+'&category_type='+this.selectedCategory;
    if(this.selectedType) {
      queryParams += '&type='+this.selectedType+'&date='+this.selectedMonth;
    }
    this.acitivty = [];
    this.api.getStaticData('api/login/retrieveactivity?' + queryParams).subscribe(result => {
      const response: any = result;
      if (response.body !== undefined) {
        const res = response.body;
        if (res !== undefined) {
          if (res.status === 'success') {
            this.acitivty = res.data;
          }
        }
      }
    });
  }

  monthSelection(month) {
    this.selectedType = 'month';
    this.selectedDateRange = [];
    this.selectedMonth = month;
    this.fetchUserActivity();
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      title: 'CUSTOM',
      pickMode: 'range',
      canBackwardsSelected: true,
      defaultDateRange: this.dateRange
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: any = event.data;
    if(date) {
      this.selectedType = 'custom';
      this.selectedMonth = date.from.string+'|'+date.to.string;
    }
  }

  async showFilter(activiti) {

    const modal = await this.modalCtrl.create({
      component: ReportComponent,
      componentProps: {
        'participationId': activiti.quiz_participation_id,
        'language': activiti.quiz_participation_language
      }
    });
    return await modal.present();
  }

}
