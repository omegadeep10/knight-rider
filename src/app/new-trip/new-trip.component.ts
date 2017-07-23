import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { Trip } from '../_models/user';
import 'rxjs/add/operator/map';
import * as async from 'async';

import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';

declare var google: any;

@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.sass']
})

export class NewTripComponent implements OnInit {
  form;
  saved_addresses = [
    {
      name: 'Macon Campus',
      address: '100 University Parkway Macon, GA 31206'
    },
    {
      name: 'Warner Robins Campus',
      address: '100 University Boulevard Warner Robins, GA 31093'
    },
    {
      name: 'Dublin Campus',
      address: '1900 Bellevue Road Dublin, GA 31021'
    },
    {
      name: 'Cochran Campus',
      address: '1100 Second Street, S.E. Cochran, GA 31014'
    },
    {
      name: 'Eastman Campus',
      address: '71 Airport Road Eastman, GA 31023'
    },
  ];
  loading = false;
  section = 1;
  trip: Trip;
  geocoder;
  originError: Boolean = false;
  destinationError: Boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private http: Http
  ) { }

  ngOnInit() {
    this.form = new ValidationManager({
      'origin': 'required',
      'destination': 'required'
    });

    this.geocoder = new google.maps.Geocoder();

    /*
    let map = new google.maps.Map(document.getElementById("google-map"), {
      center: new google.maps.LatLng(32.838131, -83.634705),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    let that = this;

    map.addListener('click', function(e) {
      for (marker of that.markers) {
        marker.setMap(null);
      }

      var marker = new google.maps.Marker({
        position: e.latLng,
        map: map
      });

      marker.addListener('click', function() {
        marker.setMap(null);
      });

      console.log(this);
      that.markers.push(marker);
    });*/
  }

  submit() {
    console.log("SUBMITTING");
  }

  areValidAddresses() {
    let formData = this.form.getData();
    let origin = formData.origin;
    let destination = formData.destination;
    let that = this;

    async.parallel([
        function(cb) {
          that.geocoder.geocode({'address': origin}, function(results, status) {
            if (status == "ZERO_RESULTS") {
              that.originError = true;
              cb('origin');
            } else {
              cb(null, results);
            }
          });
        },
        function(cb) {
          that.geocoder.geocode({'address': destination}, function(results, status) {
            if (status == "ZERO_RESULTS") {
              that.destinationError = false;
              cb('destination');
            } else {
              cb(null, results);
            }
          });
        }
      ],
      //callback function: results is an array of geocoder results
      function(err, results) {
        if (!err) {
          console.log(results);
          that.section += 1;
        }
      }
    );
  }

  nextSection() {
    if (this.section == 1) {
      if (this.form.isValid()) {
        //the valid Addresses function will advance the section internally
        this.areValidAddresses();
      }
    } else {
      this.section += 1;
    }
  }

  prevSection() {
    this.section -= 1;
  }

}
