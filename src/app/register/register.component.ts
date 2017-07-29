import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { User } from '../_models/';

import { AlertService, UserService } from '../_services/';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  form;
  loading = false;
  user: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.form = new ValidationManager({
      'firstName': 'required',
      'lastName': 'required',
      'email': 'required|email',
      'phone': 'digits',
      'password': 'required|minLength:4',
      'matchingPassword': 'required|equalTo:password'
    });
  }

  submit() {
    this.loading = true;

    this.userService.createUser(this.form.getData()).subscribe(
      data => {
        this.alertService.success("Registration was successful. Check your email to verify.", true);
        this.router.navigate(['/login']);
        this.loading = false;
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );

  }

}
