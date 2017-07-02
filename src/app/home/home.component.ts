import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { User, Trip } from '../_models/user';

import { UserService } from '../_services/user.service';
import { AlertService } from '../_services/alert.service';


@Component({
  selector: 'app-home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  trips: Trip[] = [];

  constructor(private userService: UserService, private alertService: AlertService) { 
    userService.getUserTrips().subscribe(
      data => {
        this.trips = data;
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  ngOnInit() {
    
  }
}
