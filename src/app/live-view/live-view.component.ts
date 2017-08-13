import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User, Trip, Passenger } from '../_models/';

import { TripService, AlertService, UserService, HelperService, MessageService } from '../_services/';

declare var google: any;

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.sass']
})
export class LiveViewComponent implements OnInit {

  trip: Trip = new Trip();
  map;
  marker;
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
    this.activateRoute.params.subscribe((params: Params) => {
      let tripId = params['id'];
      this.tripService.getTrip(tripId).subscribe(
        data => {
          this.trip = data;
          this.loading = false;

          this.map = new google.maps.Map(document.getElementById("google-map"), {
            center: new google.maps.LatLng(data.currentLatitude, data.currentLongtitude),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          let latLng = new google.maps.LatLng(data.currentLatitude, data.currentLongtitude);

          this.marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            icon: '../../assets/ripple.gif',
            optimized: false
          });

          this.displayRoute(data);

          setTimeout(() => { this.updateData() }, 10000);
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


  updateData() {
    this.tripService.getTrip(this.trip.id).subscribe(
      data => {
        console.log("UPDATED");
        let latLng = new google.maps.LatLng(data.currentLatitude, data.currentLongtitude);
        this.marker.setPosition(latLng);

        setTimeout(() => { this.updateData() }, 10000);
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

}
