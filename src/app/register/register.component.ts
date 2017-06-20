import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { User } from '../_models/user';

import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';

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
      'username': 'required|email',
      'phone': 'digits',
      'password': 'required|minLength:4',
      'confirmPassword': 'required|equalTo:password'
    });
  }

  submit() {
    this.loading = true;

    this.userService.create(this.form.getData()).subscribe(
      data => {
        this.alertService.success("Registration was successful", true);
        console.log(data);
        this.router.navigate(['/login']);
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );

  }

}
