import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { Trip, Car } from '../_models/';

import { AlertService, UserService, CarService, HelperService, TripService } from '../_services/';


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
  loading = true;
  trip: Trip = new Trip();
  cars: Car[] = [];
  selectedCar: Car = null;
  selectedCarError = false;
  originError: Boolean = false;
  destinationError: Boolean = false;
  showCarForm: Boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private carService: CarService,
    private helperService: HelperService,
    private tripService: TripService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.carService.getUserCars().subscribe(
      data => { 
        this.cars = data;
        this.loading = false;
      },
      error => { this.alertService.error(error); }
    );

    this.form = new ValidationManager({
      'origin': 'required',
      'destination': 'required',
      'originDate': 'required',
      'destName': 'required'
    });

    this.carForm = new ValidationManager({
      'maker': 'required',
      'type': 'required',
      'capacity': 'required|number'
    });
  }

  submit() {
    this.loading = true;
    if (this.selectedCar == null) {
      this.selectedCarError = true;
      return;
    }

    let originAddress = this.form.getData().origin;
    let destinationAddress = this.form.getData().destination;
    let that = this;

    this.helperService.validateAddress(originAddress)
      .then((results) => {
        //set form input to Google's sanitized address
        that.form.setValue('origin', results[0].formatted_address);
        that.trip.originAddress = results[0].formatted_address;
        that.trip.originLatitude = results[0].geometry.location.lat();
        that.trip.originLongitude = results[0].geometry.location.lng();
        that.trip.originCity = results[0].address_components[2].short_name;
      })
      .then(() => { return this.helperService.validateAddress(destinationAddress) })
      .then((results) => {
        that.form.setValue('destination', results[0].formatted_address);
        that.trip.destAddress = results[0].formatted_address;
        that.trip.destLatitude = results[0].geometry.location.lat();
        that.trip.destLongitude = results[0].geometry.location.lng();
        that.trip.destCity = results[0].address_components[2].short_name;
      })
      .then(() => {
        that.trip.departureTime = that.form.getData().originDate;
        that.trip.driverId = that.helperService.getUserId();
        that.trip.availableSeats = that.selectedCar.capacity;
        that.trip.car = that.selectedCar;
        that.trip.destName = that.form.getData().destName;

        that.tripService.createTrip(that.trip).subscribe(
          data => {
            this.alertService.success('Trip successfully created.', true);
            this.router.navigate(['/home']);
          },
          error => {
            that.alertService.error(error);
            that.loading = false;
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

        console.log(invalidAddress);
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
    this.loading = true;
    let car = new Car();
    let carData = this.carForm.getData();

    car.userId = this.helperService.getUserId();
    car.maker = carData.maker;
    car.type = carData.type;
    car.capacity = carData.capacity;

    this.carService.createCar(car).subscribe(
      data => {
        this.showCarForm = false;
        //fetch new data
        this.carService.getUserCars().subscribe(
          data => { 
            this.cars = data; 
            this.loading = false;
          },
          error => { 
            this.alertService.error(error); 
            this.loading = false;
          }
        );
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

}
