import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { User, Trip } from '../_models/';

import { TripService, AlertService } from '../_services/';


@Component({
  selector: 'app-home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  trips: Trip[] = [];
  completedTrips: Trip[] = [];
  loading: boolean = true;

  constructor(private tripService: TripService, private alertService: AlertService) { 
    tripService.getUserTrips().subscribe(
      data => {
        this.trips = data.filter(elm => { return elm.completed === false; });
        this.completedTrips = data.filter(elm => { return elm.completed === true; });
        this.loading = false;
      },
      error => {
        this.alertService.error(error);
        console.log("ERROR", error);
        this.loading = false;
      }
    );
  }

  ngOnInit() {
    
  }
}
