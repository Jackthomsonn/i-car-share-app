import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LoginPageModule } from './login/login.module';

@NgModule({
  imports: [
    HttpClientModule,
    LoginPageModule
  ]
})

export class PagesModule { }
