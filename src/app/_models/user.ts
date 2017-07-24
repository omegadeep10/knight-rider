export class User {
    id: number;   
    email: string;
    password: string;
    matchingPassword: string;
    firstName: string;
    lastName: string;
    address?: string;
    zip?: string;
    phone?: string;
}

export class Car {
    userId: number;
    id: number;
    maker: string;
    type: string;
    capacity: number;

    constructor(init?: Partial<Car>) {
        Object.assign(this, init);
    }
}

export class Passenger {
    userId: number;
    tripId: number;
    joinDate: Date;

    constructor(init?: Partial<Passenger>) {
        Object.assign(this, init);
    }
}

export class Trip {
    userId: number;
    id: number;
    origin: string;
    originLatitude: number;
    originLongitude: number;
    destination: string;
    destLatitude: number;
    destLongitude: number;
    departureTime: Date;
    meetingLocation: string;
    availableSeats: number;
    passengers: Passenger[];

    constructor(init?: Partial<Trip>) {
        Object.assign(this, init);
    }
}