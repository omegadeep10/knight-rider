import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { User, Trip, Passenger, Car, Message } from '../_models/';
import { HelperService } from './helper.service';

@Injectable()
export class MessageService {
    _baseURL: string = 'http://168.16.222.103:8080/knightrider';

    constructor(private http: Http, private helperService: HelperService) { }

    createMessage(trip_id, user_id, comment) {
        let message = {
            comment: comment,
            tripId: trip_id,
            userId: parseInt(user_id)
        };

        return this.http.post(this._baseURL + `/messages/${trip_id}/${user_id}`, message, this.helperService.jwt())
            .map((res: Response) => { res });
    }

    getMessages(trip_id) {
        return this.http.get(this._baseURL + `/messages/${trip_id}`, this.helperService.jwt())
            .map((res: Response) => {
                let messages: Message[] = [];
                let messageData = res.json();

                for (let message of messageData) {
                    messages.push(new Message({
                        id: message.id,
                        logDate: new Date(message.logDate),
                        comment: message.comment,
                        userId: message.userId,
                        tripId: message.tripId,
                        firstName: message.firstName,
                        lastName: message.lastName
                    }));
                }

                return messages;
            })
    }
}