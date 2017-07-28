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
    cars: Car[];
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
    messages: Message[];

    //not reflected in API but I need these
    originCity: string;
    destCity: string;

    constructor(init?: Partial<Trip>) {
        Object.assign(this, init);
    }
}

export class Message {
    tripId: number;
    userId: number;
    comment: string;

    constructor(init?: Partial<Message>) {
        Object.assign(this, init);
    }
}