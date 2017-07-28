import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User, Trip } from '../_models/';

import { TripService, AlertService, UserService } from '../_services/';


@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.sass']
})
export class TripDetailComponent implements OnInit {

  trip: Trip = new Trip();
  driver: User = new User();

  constructor(
    private tripService: TripService,
    private userService: UserService,
    private alertService: AlertService, 
    private activateRoute: ActivatedRoute
  ) { 
    activateRoute.params.subscribe((params: Params) => {
      let tripId = params['id'];
      tripService.getTrip(tripId).subscribe(
        data => {
          this.trip = data;
          
          userService.getUser(data.userId).subscribe(
            data => {
              this.driver = data;
            },
            error => {
              this.alertService.error(error);
            }
          );
        },
        error => {
          this.alertService.error(error);
        }
      )
    })
  }

  ngOnInit() {
  }

}
