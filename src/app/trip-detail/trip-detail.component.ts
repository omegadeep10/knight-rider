import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User, Trip, Passenger } from '../_models/';

import { TripService, AlertService, UserService, HelperService } from '../_services/';


@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.sass']
})
export class TripDetailComponent implements OnInit {

  trip: Trip = new Trip();
  loading: boolean = true;

  constructor(
    private tripService: TripService,
    private userService: UserService,
    private alertService: AlertService,
    private helperService: HelperService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) { 
    activateRoute.params.subscribe((params: Params) => {
      let tripId = params['id'];
      tripService.getTrip(tripId).subscribe(
        data => {
          this.trip = data;
          this.loading = false;
        },
        error => {
          this.alertService.error(error);
        }
      )
    })
  }

  ngOnInit() {
  }

  deleteRide() {
    this.tripService.deleteTrip(this.trip).subscribe(
      data => {
        this.alertService.success('Ride successfully deleted.', true);
        this.router.navigate(['/home']);
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  leaveRide() {
    this.tripService.leaveTrip(this.trip, this.helperService.getUserId).subscribe(
      data => {
        this.alertService.success('Your reservation was successfully canceled.');
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  joinRide() {
    this.tripService.joinTrip(this.trip, this.helperService.getUserId).subscribe(
      data => {
        this.alertService.success('Your trip reservation was successfully made.');
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  currentUserIsTheDriver() {
    if (this.trip.driver) {
      return this.helperService.getUserId() == this.trip.driver.id;
    } else {
      return false;
    }
  }

  currentUserIsAPassenger() {
    let passengerIds = [];

    if (this.trip.passengers) {
      this.trip.passengers.forEach(element => {
        passengerIds.push(element.userId);
      });
    }

    return passengerIds.includes(this.helperService.getUserId());
  }

}
