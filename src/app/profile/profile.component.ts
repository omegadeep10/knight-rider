import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationManager } from 'ng2-validation-manager';
import { User } from '../_models/';

import { AlertService, UserService, HelperService } from '../_services/';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  form;
  loading = false;
  image: string;
  image_extension: string;
  fileUploadError = false;
  passwordError = false;
  user: User = new User({});

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private helperService: HelperService
  ) { }

  ngOnInit() {
    this.form = new ValidationManager({
      'firstName': 'required',
      'lastName': 'required',
      'email': 'required|email',
      'phone': ''
    });

    this.userService.getUser(parseInt(this.helperService.getUserId())).subscribe(
      data => { 
        this.user = data;

        this.form.setValue('firstName', this.user.firstName);
        this.form.setValue('lastName', this.user.lastName);
        this.form.setValue('email', this.user.email);
        this.form.setValue('phone', this.user.phone);
      },
      error => { this.alertService.error(error) }
    );
  }

  submit() {
    this.loading = true;

    let formData = this.form.getData();

    this.user.firstName = formData.firstName;
    this.user.lastName = formData.lastName;
    this.user.phone = formData.phone;
    this.user.profilePicture = this.image;

    this.userService.updateUser(this.user).subscribe(
      data => {
        this.alertService.success("Update was successful", true);
        
        console.log(this.image_extension);
        this.userService.updateUserPhoto(this.user.id, this.user.profilePicture, this.image_extension).subscribe(
          data => {
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.alertService.error(error);
            console.log(error);
          }
        );
      },
      error => {
        this.alertService.error(error);
        console.log(error);
        this.loading = false;
      }
    );
  }

  changeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    this.image_extension = file.name.split('.').pop();

    let filesize:number = (file.size/1024)/1024;

    if (filesize > 1) {
      this.alertService.error('Uploaded file is too large! Must be less than 1 megabyte.');
      return;
    }
    
    var myReader:FileReader = new FileReader();


    myReader.onloadend = (e) => {
      this.image = myReader.result;
      console.log(this.image);
    }
    myReader.readAsDataURL(file);
  }

  resetPasswordError() {
    this.passwordError = false;
  }

}

