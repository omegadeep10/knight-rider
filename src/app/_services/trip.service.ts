import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { User, Trip, Passenger, Car, Message, Location } from '../_models/';
import { HelperService } from './helper.service';
import { environment } from '../../environments/environment';
declare var google: any;

@Injectable()
export class TripService {
    _baseURL: string = environment.api;

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
            destName: trip.destName,
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

    completeTrip(trip: Trip) {
        return this.http.post(this._baseURL + `/completetrip/${trip.id}`, {}, this.helperService.jwt())
            .map((res: Response) => res.json());
    }

    joinTrip(trip: Trip, user: User) {
        let tripData = {
            userId: user.id,
            tripId: trip.id,
            latitude: 0.0,
            longitude: 0.0,
            address: user.address
        };

        return this.http.post(this._baseURL + `/passengers/${trip.id}/${user.id}`, tripData, this.helperService.jwt())
            .map((res: Response) => { res });
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
                        userId: passenger.id,
                        tripId: trip.id,
                        firstName: passenger.firstName,
                        lastName: passenger.lastName,
                        profilePicture: passenger.profilePicture,
                        address: passenger.address,
                        latitude: passenger.latitude,
                        longitude: passenger.longitude
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
                    phone: trip.driver.phone,
                    profilePicture: trip.driver.profilePicture,
                    latitude: trip.currentLatitude,
                    longitude: trip.currentLongitude
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
                        logDate: new Date(message.logDate),
                        firstName: message.firstName,
                        lastName: message.lastName
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
                    destName: trip.destName,
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
                    messages: messages_temp,
                    completed: trip.completed,
                    completedTimestamp: new Date(trip.completedTimestamp)
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
                        userId: passenger.id,
                        tripId: trip.id,
                        firstName: passenger.firstName,
                        lastName: passenger.lastName,
                        profilePicture: passenger.profilePicture
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
                        logDate: new Date(message.logDate),
                        firstName: message.firstName,
                        lastName: message.lastName
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
                    destName: trip.destName,
                    destAddress: trip.destAddress,
                    destLatitude: trip.destLatitude,
                    destLongitude: trip.destLongitude,
                    destCity: trip.destCity,
                    departureTime: new Date(trip.departureTime),
                    availableSeats: trip.availableSeats,
                    remainingSeats: trip.remainingSeats,
                    car: car_temp,
                    passengers: passengers_temp,
                    messages: messages_temp,
                    completed: trip.completed,
                    completedTimestamp: new Date(trip.completedTimestamp)
                }));
            }

            return trips;
        });
    }

    getTrip(tripId: number) {
        return this.http.get(this._baseURL + '/trips/' + tripId, this.helperService.jwt()).map((response: Response) => {
            //variable to store trip data
            let trip = response.json();

                let locations_temp: Location[] = [];
                for (let location of trip.locations) {
                    locations_temp.push({
                        id: location.id,
                        userId: location.userId,
                        tripId: location.tripId,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        speed: location.speed,
                        currentTime: new Date(location.currentTime)
                    });
                }

            //Create an array of passengers for each trip
                let passengers_temp: Passenger[] = [];
                for (let passenger of trip.passengers) {
                    passengers_temp.push(new Passenger({
                        userId: passenger.id,
                        tripId: trip.id,
                        firstName: passenger.firstName,
                        lastName: passenger.lastName,
                        profilePicture: passenger.profilePicture,
                        address: passenger.address,
                        latitude: passenger.latitude,
                        longitude: passenger.longitude
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
                    phone: trip.driver.phone,
                    profilePicture: trip.driver.profilePicture,
                    latitude: trip.currentLatitude,
                    longitude: trip.currentLongitude
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
                        logDate: new Date(message.logDate),
                        firstName: message.firstName,
                        lastName: message.lastName
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
                    destName: trip.destName,
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
                    messages: messages_temp,
                    locations: locations_temp,
                    currentLatitude: trip.currentLatitude,
                    currentLongtitude: trip.currentLongitude,
                    completed: trip.completed,
                    completedTimestamp: new Date(trip.completedTimestamp)
                });
            

            return tripObj;
        });
    }
}