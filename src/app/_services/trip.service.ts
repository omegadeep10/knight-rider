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

        return this.http.post(this._baseURL + `/users/${user_id}/trips`, tripData, this.helperService.jwt()).map((response: Response) => response.json());
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

            return trips;
        });
    }

    getUserTrips() {
        let email = this.helperService.getUsername();
        let user_id = this.helperService.getUserId();

        return this.http.get(this._baseURL + '/users/' + user_id, this.helperService.jwt()).map((response: Response) => {
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
        return this.http.get(this._baseURL + '/trips/' + tripId, this.helperService.jwt()).map((response: Response) => {
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
}