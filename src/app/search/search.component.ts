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
        this.trips = data.filter(elm => { return elm.completed === false; });
        for (let trip of this.trips) {
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

        
        let leg = response.routes[0].legs[0];
        //that.makeMarker(leg.start_location, 'START', document.getElementById(trip.id.toString()).cloneNode(true), 'http://maps.google.com/mapfiles/marker_purpleA.png');
        //that.makeMarker(leg.end_location, 'END', document.getElementById(trip.id.toString()).cloneNode(true), 'http://maps.google.com/mapfiles/marker_purpleB.png');
        
      } else {
        console.log(response, status);
      }
    });
  }

  makeMarker(latLng, label, html, iconImage) {
    let that = this;
    let offset = Math.random() < 0.5 ? (Math.random() / -1000) : (Math.random() / 1000);
    let offset2 = Math.random() < 0.5 ? (Math.random() / -1000) : (Math.random() / 1000);

    let offsettedLatLng = {
      lat: latLng.lat() + offset,
      lng: latLng.lng() + offset2
    };

    let marker = new google.maps.Marker({
      position: offsettedLatLng,
      map: that.map,
      icon: iconImage,
      title: label
    });

    google.maps.event.addListener(marker, 'click', function() {
      that.infoWindow.setContent(html);
      that.infoWindow.open(that.map, marker);
    });
  }

  expandCard(trip_id, event) {
    let card = document.getElementById(trip_id);
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    //on tablets and below, just route directly no accordian style clicking
    if (width < 769) {
      this.router.navigate(['/trip/' + trip_id]);
    }

    if ((event.target.tagName == "A" || event.target.tagName == "H3") && card.classList.contains('open')) {
      card.classList.remove('open');
      return;
    }

    if (card.classList.contains('open')) {
      this.router.navigate(['/trip/' + trip_id]);
    } else {
      card.classList.add('open');
    }
  }

}
