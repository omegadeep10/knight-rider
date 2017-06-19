import { Component, OnInit } from '@angular/core';
import { AlertService } from '../_services/alert.service';


@Component({
  selector: 'app-home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private alertService: AlertService ) { }

  ngOnInit() {
    this.alertService.success('ALERT success login');
  }
}
