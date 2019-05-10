import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { DashBoardComponent } from './dashboard/dashboard.component';

import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { AuthGuard } from './auth-guard.service';

import { AppBootstrapModule } from './app-bootstrap.module';
import { InputBoxComponent } from './dashboard/input-box/input-box.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    DashBoardComponent,
    InputBoxComponent  
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AmplifyAngularModule,
    BrowserModule,
    AppBootstrapModule
  ],
  providers: [AmplifyService, AuthGuard],
  entryComponents: [InputBoxComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
