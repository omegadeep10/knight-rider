import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
    _baseURL: string = environment.api;
    constructor(private http: Http) { }

    login(username: string, password: string) {
        let credentials = JSON.stringify({ username: username, password: password });
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');

        console.log(credentials);
        return this.http.post(this._baseURL + '/auth/login', credentials, { headers: headers })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}