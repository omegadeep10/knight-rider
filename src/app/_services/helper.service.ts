import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { environment } from '../../environments/environment'

declare var google: any;

@Injectable()
export class HelperService {
    _baseURL: string = environment.api;
    geocoder = new google.maps.Geocoder();

    constructor(private http: Http) { }

    validateAddress(address: string) {
        return new Promise((resolve, reject) => {
            this.geocoder.geocode({ 'address': address }, function(results, status) {
                if (status.toString() === "ZERO_RESULTS") {
                    reject(address);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // private helper methods
    getUsername() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return this.decode_jwt(currentUser.token).sub;
        } else {
            return new Error('User is not logged in.');
        }
    }

    getUserId() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.user_id) {
            return currentUser.user_id;
        } else {
            return new Error('User is not logged in.');
        }
    }

    jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'X-Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

    decode_jwt(token) {
        let jwt: JwtHelper = new JwtHelper();
        return jwt.decodeToken(token);
    }
}