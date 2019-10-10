import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuestionsPage } from './questions.page';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionsPage
  },
  {
    path: 'thankyou',
    component: ThankyouComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    QuestionsPage,
    ThankyouComponent,
    ReportComponent
  ],
  entryComponents: [
    ReportComponent
  ],
  exports: [
    ThankyouComponent,
    ReportComponent
  ]
})
export class QuestionsPageModule {}
