import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User, Trip, Passenger } from '../_models/';

import { TripService, AlertService, UserService, HelperService, MessageService } from '../_services/';

declare var google: any;

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.sass']
})
export class TripDetailComponent implements OnInit {

  trip: Trip = new Trip();
  map;
  loading: boolean = true;
  directionService = new google.maps.DirectionsService();
  loggedInUserId = this.helperService.getUserId();

  constructor(
    private tripService: TripService,
    private userService: UserService,
    private alertService: AlertService,
    private helperService: HelperService,
    private messageService: MessageService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.map = new google.maps.Map(document.getElementById("google-map"), {
      center: new google.maps.LatLng(32.838131, -83.634705),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.activateRoute.params.subscribe((params: Params) => {
      let tripId = params['id'];
      this.tripService.getTrip(tripId).subscribe(
        data => {
          this.trip = data;
          this.loading = false;

          this.displayRoute(data);
        },
        error => {
          this.alertService.error(error);
        }
      )
    });

  }

  displayRoute(trip: Trip) {
    let directionsDisplay = new google.maps.DirectionsRenderer();
    let start = trip.originAddress;
    let end = trip.destAddress;
    directionsDisplay.setMap(this.map);

    let waypnts = [];
    for (let passenger of trip.passengers) {
      waypnts.push({
        location: passenger.address,
        stopover: true
      });
    }
    
    let request = {
      origin: start,
      destination: end,
      waypoints: waypnts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    };

    let that = this;
    this.directionService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        console.log(response, status);
      }
    });
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
    this.tripService.leaveTrip(this.trip, this.helperService.getUserId()).subscribe(
      data => {
        this.alertService.success('Your reservation was successfully canceled.', true);
        this.router.navigate(['/home']);
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  joinRide() {
    this.userService.getUser().subscribe(
      data => {
        this.tripService.joinTrip(this.trip, data).subscribe(
          data => {
            this.alertService.success('Your trip reservation was successfully made.', true);
            location.reload();
          },
          error => {
            console.log(error);
            this.alertService.error(error);
          }
        );
      },
      error => {
        console.log(error);
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
        passengerIds.push(element.userId.toString());
      });
    }

    return passengerIds.includes(this.helperService.getUserId());
  }

  submitMessage(message) {
    this.messageService.createMessage(this.trip.id, this.helperService.getUserId(), message).subscribe(
      data => {
        console.log(data);
        (<HTMLInputElement>document.getElementById('messagebox')).value = '';
        this.messageService.getMessages(this.trip.id).subscribe(
          data => {
            this.trip.messages = data;
          },
          error => {
            this.alertService.error(error);
          }
        )
      },
      error => {
        console.log(error);
      }
    );
  }

}
