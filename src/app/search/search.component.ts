import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Trip } from '../_models/user';

import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';

declare var google: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {
  map;
  trips: Trip[] = [];
  directionService = new google.maps.DirectionsService();

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private http: Http
  ) { }

  ngOnInit() {
    this.map = new google.maps.Map(document.getElementById("google-map"), {
      center: new google.maps.LatLng(32.838131, -83.634705),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.userService.getAllTrips().subscribe(
      data => {
        this.trips = data;
        for (let trip of data) {
          this.displayRoute(trip);
        }
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  displayRoute(trip: Trip) {
    let directionsDisplay = new google.maps.DirectionsRenderer();
    let start = trip.origin;
    let end = trip.destination;
    directionsDisplay.setMap(this.map);
    
    let request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        console.log(response, status);
      }
    });
  }

}
