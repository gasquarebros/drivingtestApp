import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as moment from 'moment';

@Component({
  selector: 'app-useractivity',
  templateUrl: './useractivity.page.html',
  styleUrls: ['./useractivity.page.scss'],
  providers: [DatePipe]
})
export class UseractivityPage implements OnInit {

  public MonthsFilter: Array<string>;


  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.MonthsFilter = [];
    const currentMonth = this.getMonthNames(new Date().getMonth());
    this.MonthsFilter.push(currentMonth);
    
    const prevMonth = this.getMonthNames(new Date().getMonth() - 1);
    this.MonthsFilter.push(prevMonth);
    
    const secondPrevMonth = this.getMonthNames(new Date().getMonth() - 2);
    this.MonthsFilter.push(secondPrevMonth);
  }

  getMonthNames(monthNumber) {
    const monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December' ];
    return monthNames[monthNumber - 1];
  }

}
