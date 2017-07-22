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
  loading = false;
  section = 1;
  trip: Trip;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.form = new ValidationManager({
      'origin': 'required',
      'destination': 'required',
      'meetingLocation': 'required',
      'dropoffLocation': 'required'
    });
  }

  submit() {
    console.log(this.form.getData());
  }

  nextSection() {
    this.section += 1;
  }

  prevSection() {
    this.section -= 1;
  }

}
