import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { Trip } from '../_models/user';

import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';


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
  originError: Boolean = false;
  destinationError: Boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.form = new ValidationManager({
      'origin': 'required',
      'destination': 'required',
      'originDate': 'required',
      'destinationDate': 'required'
    });
  }

  submit() {
    console.log("SUBMITTING");
    let originAddress = this.form.getData().origin;
    let destinationAddress = this.form.getData().destination;

    this.userService.validateAddress(originAddress)
      .then((results) => {
        console.log(results);
        //update latLng for Trip
      })
      .then(() => { return this.userService.validateAddress(destinationAddress) })
      .then((results) => {
        console.log(results);
        //update latLng for Trip
      })
      .catch((invalidAddress) => {
        if (invalidAddress == originAddress) {
          this.originError = true;
        }
        if (invalidAddress == destinationAddress) {
          this.destinationError = true;
        }
      });
  }

  nextSection() {
    this.section += 1;
  }

  prevSection() {
    this.section -= 1;
  }

  resetOriginError() {
    this.originError = false;
  }

  resetDestinationError() {
    this.destinationError = false;
  }

  TodaysDate() {
    return new Date();
  }

}
