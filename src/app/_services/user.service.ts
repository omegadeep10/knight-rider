import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';

import { User, Trip, Passenger } from '../_models/user';

@Injectable()
export class UserService {
    _baseURL: string = 'http://168.16.222.103:8080/knightrider';
    constructor(private http: Http) { }


    createUser(user: User) {
        return this.http.post(this._baseURL + '/auth/register', user, this.jwt()).map((response: Response) => response.json());
    }

    getUser() {
        let user_id = this.getUserId();
        let email = this.getUsername();
        return this.http.get(this._baseURL + '/users/' + user_id, this.jwt()).map((response: Response) => {
            let usr = new User();
            let user = response.json();

            if (user.username === email) {
                usr.address = user.address;
                usr.firstName = user.firstName;
                usr.lastName = user.lastName;
                usr.id = user.id;
                usr.phone = user.phone;
                usr.zip = user.zip;
                usr.email = user.username;
                usr.password = null;

                return usr;
            }
        });
    }

    getUserTrips() {
        let email = this.getUsername();
        let user_id = this.getUserId();

        return this.http.get(this._baseURL + '/users/' + user_id, this.jwt()).map((response: Response) => {
            //variable to store user's trips
            let trips: Trip[] = [];  
            let user = response.json();

            if (user.username === email) {
                for (let trip of user.trips) {

                    //Create an array of passengers for each trip
                    let passengers_temp: Passenger[] = [];
                    for (let passenger of trip.passengers) {
                        passengers_temp.push(new Passenger({
                            joinDate: new Date(passenger.joinDate),
                            userId: passenger.userId,
                            tripId: passenger.tripId
                        }));
                    }
                
                    //add to trips array
                    trips.push(new Trip({
                        id: trip.id,
                        availableSeats: trip.availableSeats,
                        origin: trip.origin,
                        destination: trip.destination,
                        meetingLocation: trip.meetingLocation,
                        departureTime: new Date(trip.departureTime),
                        passengers: passengers_temp
                    }));
                }
            }

            return trips;
        });
    }

    getTrip(tripId: number) {
        return this.http.get(this._baseURL + '/trips/' + tripId, this.jwt()).map((response: Response) => {
            //variable to store trip data
            let tripData = response.json();

            let passengers_temp: Passenger[] = [];
            for (let passenger of tripData.passengers) {
                passengers_temp.push(new Passenger({
                    joinDate: new Date(passenger.joinDate),
                    userId: passenger.userId,
                    tripId: passenger.tripId
                }));
            }

            let trip: Trip = new Trip({
                id: tripData.id,
                availableSeats: tripData.availableSeats,
                origin: tripData.origin,
                destination: tripData.destination,
                meetingLocation: tripData.meetingLocation,
                departureTime: new Date(tripData.departureTime),
                passengers: passengers_temp
            });
            

            return trip;
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

    private getUserId() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.user_id) {
            return currentUser.user_id;
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