import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User, Review } from '../_models/';
import { TripService, UserService, HelperService, AlertService } from '../_services/';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private tripService: TripService,
    private userService: UserService,
    private alertService: AlertService,
    private helperService: HelperService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activateRoute.params.subscribe((params: Params) => {
      let userId = params['id'];
      //to-do get user data, get user reviews, wire up info to the view
    });
  }

}
