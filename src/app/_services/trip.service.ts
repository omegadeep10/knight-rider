import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { User, Trip, Passenger, Car, Message } from '../_models/';
import { HelperService } from './helper.service';
declare var google: any;

@Injectable()
export class TripService {
    _baseURL: string = 'http://168.16.222.103:8080/knightrider';

    constructor(private http: Http, private helperService: HelperService) { }

    createTrip(trip: Trip) {
        let user_id = this.helperService.getUserId();

        let tripData = {
            carId: trip.car.id,
            driverId: user_id,
            originAddress: trip.originAddress,
            originCity: trip.originCity,
            originLatitude: trip.originLatitude,
            originLongitude: trip.originLongitude,
            departureTime: trip.departureTime.valueOf(),
            destAddress: trip.destAddress,
            destCity: trip.destCity,
            destLatitude: trip.destLatitude,
            destLongitude: trip.destLongitude,
            availableSeats: trip.availableSeats,
            meetingLocation: 'none specified'
        };

        return this.http.post(this._baseURL + `/users/${user_id}/trips`, tripData, this.helperService.jwt())
            .map((response: Response) => response.json());
    }

    deleteTrip(trip: Trip) {
        return this.http.delete(this._baseURL + `/trips/${trip.id}`, this.helperService.jwt())
            .map((res: Response) => { res });
    }

    joinTrip(trip: Trip, user_id) {
        return this.http.post(this._baseURL + `/passengers/${trip.id}/${user_id}`, this.helperService.jwt())
            .map((res: Response) => { res.json() });
    }

    leaveTrip(trip: Trip, user_id) {
        return this.http.delete(this._baseURL + `/passengers/${trip.id}/${user_id}`, this.helperService.jwt())
            .map((res: Response) => { res });
    }

    getAllTrips() {
        return this.http.get(this._baseURL + '/trips', this.helperService.jwt()).map((response: Response) => {
            //variable to store user's trips
            let trips: Trip[] = [];  
            let tripData = response.json();

            for (let trip of tripData) {

                //Create an array of passengers for each trip
                let passengers_temp: Passenger[] = [];
                for (let passenger of trip.passengers) {
                    passengers_temp.push(new Passenger({
                        joinDate: new Date(passenger.joinDate),
                        userId: passenger.userId,
                        tripId: passenger.tripId,
                        firstName: passenger.firstName,
                        lastName: passenger.lastName
                    }));
                }

                //create temp Driver
                let driver_temp: User = new User({
                    id: trip.driver.driverId,
                    email: trip.driver.username,
                    firstName: trip.driver.firstName,
                    lastName: trip.driver.lastName,
                    address: trip.driver.address,
                    zip: trip.driver.zip,
                    phone: trip.driver.phone
                });

                //create temp car
                let car_temp: Car = new Car({
                    id: trip.car.id,
                    maker: trip.car.maker,
                    type: trip.car.type,
                    capacity: trip.car.capacity
                });

                //create array of messages for each trip
                let messages_temp: Message[] = [];
                for (let message of trip.messages) {
                    messages_temp.push(new Message({
                        id: message.id,
                        tripId: message.tripId,
                        userId: message.userId,
                        comment: message.comment,
                        logDate: new Date(message.logDate)
                    }));
                }
            
                //add to trips array
                trips.push(new Trip({
                    id: trip.id,
                    carId: trip.carId,
                    driverId: trip.driverId,
                    originAddress: trip.originAddress,
                    originCity: trip.originCity,
                    originLatitude: trip.originLatitude,
                    originLongitude: trip.originLongitude,
                    destAddress: trip.destAddress,
                    destLatitude: trip.destLatitude,
                    destLongitude: trip.destLongitude,
                    destCity: trip.destCity,
                    departureTime: new Date(trip.departureTime),
                    availableSeats: trip.availableSeats,
                    remainingSeats: trip.remainingSeats,
                    driver: driver_temp,
                    car: car_temp,
                    passengers: passengers_temp,
                    messages: messages_temp
                }));
            }

            return trips;
        });
    }

    getUserTrips() {
        let email = this.helperService.getUsername();
        let user_id = this.helperService.getUserId();

        return this.http.get(this._baseURL + `/users/${user_id}/trips`, this.helperService.jwt()).map((response: Response) => {
            //variable to store user's trips
            let trips: Trip[] = [];  
            let tripData = response.json();

            for (let trip of tripData) {

                //Create an array of passengers for each trip
                let passengers_temp: Passenger[] = [];
                for (let passenger of trip.passengers) {
                    passengers_temp.push(new Passenger({
                        joinDate: new Date(passenger.joinDate),
                        userId: passenger.userId,
                        tripId: passenger.tripId,
                        firstName: passenger.firstName,
                        lastName: passenger.lastName
                    }));
                }

                //create temp car
                let car_temp: Car = new Car({
                    id: trip.car.id,
                    maker: trip.car.maker,
                    type: trip.car.type,
                    capacity: trip.car.capacity
                });

                //create array of messages for each trip
                let messages_temp: Message[] = [];
                for (let message of trip.messages) {
                    messages_temp.push(new Message({
                        id: message.id,
                        tripId: message.tripId,
                        userId: message.userId,
                        comment: message.comment,
                        logDate: new Date(message.logDate)
                    }));
                }
            
                //add to trips array
                trips.push(new Trip({
                    id: trip.id,
                    carId: trip.carId,
                    driverId: trip.driverId,
                    originAddress: trip.originAddress,
                    originCity: trip.originCity,
                    originLatitude: trip.originLatitude,
                    originLongitude: trip.originLongitude,
                    destAddress: trip.destAddress,
                    destLatitude: trip.destLatitude,
                    destLongitude: trip.destLongitude,
                    destCity: trip.destCity,
                    departureTime: new Date(trip.departureTime),
                    availableSeats: trip.availableSeats,
                    remainingSeats: trip.remainingSeats,
                    car: car_temp,
                    passengers: passengers_temp,
                    messages: messages_temp
                }));
            }

            return trips;
        });
    }

    getTrip(tripId: number) {
        return this.http.get(this._baseURL + '/trips/' + tripId, this.helperService.jwt()).map((response: Response) => {
            //variable to store trip data
            let trip = response.json();

            //Create an array of passengers for each trip
                let passengers_temp: Passenger[] = [];
                for (let passenger of trip.passengers) {
                    passengers_temp.push(new Passenger({
                        joinDate: new Date(passenger.joinDate),
                        userId: passenger.userId,
                        tripId: passenger.tripId,
                        firstName: passenger.firstName,
                        lastName: passenger.lastName
                    }));
                }

                //create temp Driver
                let driver_temp: User = new User({
                    id: trip.driver.driverId,
                    email: trip.driver.username,
                    firstName: trip.driver.firstName,
                    lastName: trip.driver.lastName,
                    address: trip.driver.address,
                    zip: trip.driver.zip,
                    phone: trip.driver.phone
                });

                //create temp car
                let car_temp: Car = new Car({
                    id: trip.car.id,
                    maker: trip.car.maker,
                    type: trip.car.type,
                    capacity: trip.car.capacity
                });

                //create array of messages for each trip
                let messages_temp: Message[] = [];
                for (let message of trip.messages) {
                    messages_temp.push(new Message({
                        id: message.id,
                        tripId: message.tripId,
                        userId: message.userId,
                        comment: message.comment,
                        logDate: new Date(message.logDate)
                    }));
                }
            
                //add to trips array
                let tripObj: Trip = new Trip({
                    id: trip.id,
                    carId: trip.carId,
                    driverId: trip.driverId,
                    originAddress: trip.originAddress,
                    originCity: trip.originCity,
                    originLatitude: trip.originLatitude,
                    originLongitude: trip.originLongitude,
                    destAddress: trip.destAddress,
                    destLatitude: trip.destLatitude,
                    destLongitude: trip.destLongitude,
                    destCity: trip.destCity,
                    departureTime: new Date(trip.departureTime),
                    availableSeats: trip.availableSeats,
                    remainingSeats: trip.remainingSeats,
                    driver: driver_temp,
                    car: car_temp,
                    passengers: passengers_temp,
                    messages: messages_temp
                });
            

            return tripObj;
        });
    }
}