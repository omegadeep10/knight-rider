import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { User, Trip, Passenger, Car, Message } from '../_models/';
import { HelperService } from './helper.service';
declare var google: any;

@Injectable()
export class UserService {
    _baseURL: string = 'http://168.16.222.104:8080/knightrider';

    constructor(private http: Http, private helperService: HelperService) { }

    createUser(user: User) {
        return this.http.post(this._baseURL + '/auth/register', user, this.helperService.jwt())
            .map((response: Response) => response.json());
    }

    updateUser(user: User) {
        let data = {
            username: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            zip: '',
            address: ''
        }

        return this.http.put(this._baseURL + `/users/${user.id}`, data, this.helperService.jwt())
            .map((res: Response) => { res });
    }

    updateUserPhoto(user_id, base64Photo) {
        let data = {
            profilePicture: base64Photo
        };

        return this.http.post(this._baseURL + `/users/profilepicture/${user_id}`, data, this.helperService.jwt())
            .map((res: Response) => { res });
    }

    //gets the user specified or the currently logged in user if no user is specified
    getUser(user_id?) {
        let uid = user_id || this.helperService.getUserId();

        return this.http.get(this._baseURL + '/users/' + uid, this.helperService.jwt()).map((response: Response) => {
            let usr = new User();
            let user = response.json();

            let cars_temp: Car[] = [];
            for (let car of user.cars) {
                cars_temp.push(new Car({
                    userId: car.userId,
                    id: car.id,
                    maker: car.maker,
                    type: car.type,
                    capacity: car.capacity
                }));
            }

            usr.address = user.address;
            usr.firstName = user.firstName;
            usr.lastName = user.lastName;
            usr.id = user.id;
            usr.phone = user.phone;
            usr.zip = user.zip;
            usr.profilePicture = user.profilePicture;
            usr.email = user.username;
            usr.password = null;
            usr.cars = cars_temp;

            return usr;
        });
    }
}