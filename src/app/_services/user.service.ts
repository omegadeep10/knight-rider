import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { User, Trip, Passenger, Car, Message } from '../_models/user';
declare var google: any;

@Injectable()
export class UserService {
    _baseURL: string = 'http://168.16.222.103:8080/knightrider';
    geocoder = new google.maps.Geocoder();

    constructor(private http: Http) { }


    createUser(user: User) {
        return this.http.post(this._baseURL + '/auth/register', user, this.jwt()).map((response: Response) => response.json());
    }

    createCar(car: Car) {
        let user_id = this.getUserId();
        return this.http.post(this._baseURL + `/users/${user_id}/cars`, car, this.jwt()).map((response: Response) => response.json());
    }

    createTrip(trip: Trip) {
        let user_id = this.getUserId();

        let tripData = {
            userId: user_id,
            origin: trip.origin,
            originLatitude: trip.originLatitude,
            originLongitude: trip.originLongitude,
            departureTime: trip.departureTime.valueOf(),
            destination: trip.destination,
            destLatitude: trip.destLatitude,
            destLongitude: trip.destLongitude,
            availableSeats: trip.availableSeats,
            meetingLocation: trip.meetingLocation
        };

        return this.http.post(this._baseURL + `/users/${user_id}/trips`, tripData, this.jwt()).map((response: Response) => response.json());
    }

    getUserCars() {
        let user_id = this.getUserId();

        return this.http.get(this._baseURL + `/users/${user_id}/cars`, this.jwt()).map((response: Response) => {
            let cars: Car[] = [];
            let carData = response.json();

            for (let c of carData) {
                cars.push(new Car(c));
            }

            return cars;
        });
    }

    getUser(user_id?) {
        let uid = user_id || this.getUserId();

        return this.http.get(this._baseURL + '/users/' + uid, this.jwt()).map((response: Response) => {
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
            usr.email = user.username;
            usr.password = null;
            usr.cars = cars_temp;

            return usr;
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

                    //create array of messages for each trip
                    let messages_temp: Message[] = [];
                    for (let message of trip.messages) {
                        messages_temp.push(new Message({
                            tripId: message.tripId,
                            userId: message.userId,
                            comment: message.comment
                        }));
                    }

                    let [originCity, destCity] = trip.meetingLocation.split('|');
                
                    //add to trips array
                    trips.push(new Trip({
                        id: trip.id,
                        userId: trip.userId,
                        availableSeats: trip.availableSeats,
                        origin: trip.origin,
                        destination: trip.destination,
                        meetingLocation: trip.meetingLocation,
                        departureTime: new Date(trip.departureTime),
                        passengers: passengers_temp,
                        messages: messages_temp,
                        originCity: originCity,
                        destCity: destCity
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

            //create array of messages for each trip
            let messages_temp: Message[] = [];
            for (let message of tripData.messages) {
                messages_temp.push(new Message({
                    tripId: message.tripId,
                    userId: message.userId,
                    comment: message.comment
                }));
            }

            let [originCity, destCity] = tripData.meetingLocation.split('|');

            let trip: Trip = new Trip({
                id: tripData.id,
                userId: tripData.userId,
                availableSeats: tripData.availableSeats,
                origin: tripData.origin,
                destination: tripData.destination,
                meetingLocation: tripData.meetingLocation,
                departureTime: new Date(tripData.departureTime),
                passengers: passengers_temp,
                messages: messages_temp,
                originCity: originCity,
                destCity: destCity
            });
            

            return trip;
        });
    }

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
    private getUsername() {
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