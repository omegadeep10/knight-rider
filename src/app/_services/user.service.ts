import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';

import { User } from '../_models/user';

@Injectable()
export class UserService {
    _baseURL: string = 'http://168.16.222.103:8080/knightrider';
    constructor(private http: Http) { }


    createUser(user: User) {
        return this.http.post(this._baseURL + '/auth/register', user, this.jwt()).map((response: Response) => response.json());
    }

    getUser() {
        let email = this.getUsername();
        return this.http.get(this._baseURL + '/users', this.jwt()).map((response: Response) => {
            let usr = new User();
            for (let user of response.json()) {
                if (user.username === email) {
                    usr.address = user.address;
                    usr.firstName = user.firstName;
                    usr.lastName = user.lastName;
                    usr.id = user.id;
                    usr.phone = user.phone;
                    usr.zip = user.zip;
                    usr.username = user.username;
                    usr.password = null;

                    return usr;
                }
            }
        });
    }

    // private helper methods
    private getUsername() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return this.decode_jwt(currentUser.token).sub;
        } else {
            return new Error('User is not logged in.');
        }
    }

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'X-Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

    private decode_jwt(token) {
        let jwt: JwtHelper = new JwtHelper();
        return jwt.decodeToken(token);
    }
}