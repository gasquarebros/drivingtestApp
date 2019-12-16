import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UseractivityPage } from './useractivity.page';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path: '',
    component: UseractivityPage
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
    UseractivityPage,
    ReportComponent
  ],
  entryComponents: [
    ReportComponent
  ],
  exports: [
    ReportComponent
  ]
})
export class UseractivityPageModule {}
