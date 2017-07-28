import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/';

import { UserService, AlertService } from '../../_services/';

@Component({
    selector: 'menu-bar',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.sass']
})

export class MenuComponent {
    user: User = new User();
    menu = 'close';
    sidebar = 'close';

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

    openMenu() {
        this.menu = 'open';
        setTimeout(() => {
            this.sidebar = 'open';
        }, 100);
    }

    closeMenu() {
        this.sidebar = 'close';
        setTimeout(() => {
            this.menu = 'close';
        }, 200);
    }
}
