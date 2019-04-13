import { TrackerPageModule } from './tracker/tracker.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LoginPageModule } from './login/login.module';

@NgModule({
  imports: [
    HttpClientModule,
    LoginPageModule,
    TrackerPageModule
  ]
})

export class PagesModule { }
