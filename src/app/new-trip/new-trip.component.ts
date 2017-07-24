import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { Trip, Car } from '../_models/user';

import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.sass']
})

export class NewTripComponent implements OnInit {
  form;
  carForm;
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
  trip: Trip = new Trip();
  cars: Car[] = [];
  selectedCar: Car = null;
  selectedCarError = false;
  originError: Boolean = false;
  destinationError: Boolean = false;
  showCarForm: Boolean = false;
  originCity: string = "";
  destCity: string = "";

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.userService.getUserCars().subscribe(
      data => { this.cars = data; },
      error => { this.alertService.error(error); }
    );

    this.form = new ValidationManager({
      'origin': 'required',
      'destination': 'required',
      'originDate': 'required'
    });

    this.carForm = new ValidationManager({
      'maker': 'required',
      'type': 'required',
      'capacity': 'required|number'
    });
  }

  submit() {
    if (this.selectedCar == null) {
      this.selectedCarError = true;
      return;
    }

    let originAddress = this.form.getData().origin;
    let destinationAddress = this.form.getData().destination;
    let that = this;

    this.userService.validateAddress(originAddress)
      .then((results) => {
        //set form input to Google's sanitized address
        that.form.setValue('origin', results[0].formatted_address);
        that.trip.origin = results[0].formatted_address;
        that.trip.originLatitude = results[0].geometry.location.lat();
        that.trip.originLongitude = results[0].geometry.location.lng();
        that.originCity = results[0].address_components[2].short_name;
      })
      .then(() => { return this.userService.validateAddress(destinationAddress) })
      .then((results) => {
        that.form.setValue('destination', results[0].formatted_address);
        that.trip.destination = results[0].formatted_address;
        that.trip.destLatitude = results[0].geometry.location.lat();
        that.trip.destLongitude = results[0].geometry.location.lng();
        that.destCity = results[0].address_components[2].short_name;
      })
      .then(() => {
        console.log(that.trip);
        that.trip.departureTime = that.form.getData().originDate;
        that.trip.userId = that.userService.getUserId();
        that.trip.availableSeats = that.selectedCar.capacity;
        that.trip.meetingLocation = that.originCity + ' | ' + that.destCity;

        that.userService.createTrip(that.trip).subscribe(
          data => {
            this.router.navigate(['/home']);
          },
          error => {
            that.alertService.error(error);
          }
        )
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

  resetOriginError() {
    this.originError = false;
  }

  resetDestinationError() {
    this.destinationError = false;
  }

  TodaysDate() {
    return new Date();
  }

  createCar() {
    let car = new Car();
    let carData = this.carForm.getData();

    car.userId = this.userService.getUserId();
    car.maker = carData.maker;
    car.type = carData.type;
    car.capacity = carData.capacity;

    this.userService.createCar(car).subscribe(
      data => {
        //fetch new data
        this.userService.getUserCars().subscribe(
          data => { this.cars = data; },
          error => { this.alertService.error(error); }
        );
        this.showCarForm = false;
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

}