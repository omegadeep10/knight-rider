import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';

import { UserService } from '../../_services/user.service';
import { AlertService } from '../../_services/alert.service';

@Component({
    selector: 'menu-bar',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.sass']
})

export class MenuComponent {
    user: User;

    constructor(private alertService: AlertService, private userService: UserService) { 
        userService.getUser().subscribe(
            user => {
                this.user = user;
            },
            error => {
                this.alertService.error(error);
            }
            );
        }
}
