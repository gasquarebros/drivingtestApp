import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'category', loadChildren: './category/category.module#CategoryPageModule' },
  { path: 'questions', loadChildren: './questions/questions.module#QuestionsPageModule' },
  { path: 'myprofile', loadChildren: './myprofile/myprofile.module#MyprofilePageModule' },
  { path: 'demo-landing', loadChildren: './demo-landing/demo-landing.module#DemoLandingPageModule' },
  { path: 'level-landing', loadChildren: './level-landing/level-landing.module#LevelLandingPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
