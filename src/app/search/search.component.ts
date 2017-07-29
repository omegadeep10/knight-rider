import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Trip } from '../_models/';

import { AlertService, TripService } from '../_services/';

declare var google: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {
  map;
  infoWindow = new google.maps.InfoWindow();
  directionService = new google.maps.DirectionsService();
  trips: Trip[] = [];
  loading: boolean = true;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private tripService: TripService,
    private http: Http
  ) { }

  ngOnInit() {
    this.map = new google.maps.Map(document.getElementById("google-map"), {
      center: new google.maps.LatLng(32.838131, -83.634705),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.tripService.getAllTrips().subscribe(
      data => {
        this.trips = data;
        for (let trip of data) {
          this.displayRoute(trip);
        }
        this.loading = false;
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }

  displayRoute(trip: Trip) {
    let directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    let start = trip.originAddress;
    let end = trip.destAddress;
    directionsDisplay.setMap(this.map);
    
    let request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };

    let that = this;
    this.directionService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        let leg = response.routes[0].legs[0];
        that.makeMarker(leg.start_location, 'START', document.getElementById(trip.id.toString()).cloneNode(true));
        that.makeMarker(leg.end_location, 'END', document.getElementById(trip.id.toString()).cloneNode(true));
      } else {
        console.log(response, status);
      }
    });
  }

  makeMarker(latLng, label, html) {
    let that = this;

    let marker = new google.maps.Marker({
      position: latLng,
      map: that.map,
      icon: 'https://www.google.com/mapfiles/marker_purple.png',
      title: label
    });

    google.maps.event.addListener(marker, 'click', function() {
      that.infoWindow.setContent(html);
      that.infoWindow.open(that.map, marker);
    });
  }

}
