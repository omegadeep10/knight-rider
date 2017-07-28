import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './_directives/alert/alert.component';
import { MenuComponent } from './_directives/menu/menu.component';
import { AuthGuard } from './_guards/auth.guard';

import { AlertService, TripService, AuthenticationService, CarService, UserService, HelperService } from './_services/';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { NewTripComponent } from './new-trip/new-trip.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    MenuComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    TripDetailComponent,
    NewTripComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    CalendarModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    CarService,
    TripService,
    HelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
