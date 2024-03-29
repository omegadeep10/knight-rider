import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { NewTripComponent } from './new-trip/new-trip.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { LiveViewComponent } from './live-view/live-view.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'user/:id',
    component: UserProfileComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'trip/:id',
    component: TripDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new-trip',
    component: NewTripComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'live-view/:id',
    component: LiveViewComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
