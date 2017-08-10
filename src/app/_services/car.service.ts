import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { User, Trip, Passenger, Car, Message } from '../_models/';
import { HelperService } from './helper.service';
declare var google: any;

@Injectable()
export class CarService {
    _baseURL: string = 'http://168.16.222.104:8080/knightrider';

    constructor(private http: Http, private helperService: HelperService) { }

    createCar(car: Car) {
        let user_id = this.helperService.getUserId();
        return this.http.post(this._baseURL + `/users/${user_id}/cars`, car, this.helperService.jwt()).map((response: Response) => response.json());
    }

    getUserCars() {
        let user_id = this.helperService.getUserId();

        return this.http.get(this._baseURL + `/users/${user_id}/cars`, this.helperService.jwt()).map((response: Response) => {
            let cars: Car[] = [];
            let carData = response.json();

            for (let c of carData) {
                cars.push(new Car(c));
            }

            return cars;
        });
    }
}