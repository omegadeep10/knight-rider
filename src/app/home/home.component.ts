import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';

import { UserService } from '../_services/user.service';
import { AlertService } from '../_services/alert.service';


@Component({
  selector: 'app-home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(private userService: UserService, private alertService: AlertService) { 
    userService.getUser().subscribe(
      data => {
        this.user = data;
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  ngOnInit() {
    
  }
}
