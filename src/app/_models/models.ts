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
    profilePicture: string;
    cars: Car[];

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
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
    firstName: string;
    lastName: string;
    profilePicture: string;
    joinDate: Date;

    constructor(init?: Partial<Passenger>) {
        Object.assign(this, init);
    }
}

export class Trip {
    driverId: number;
    carId: number;
    id: number;
    originAddress: string;
    originCity: string;
    originLatitude: number;
    originLongitude: number;
    destAddress: string;
    destCity: string;
    destLatitude: number;
    destLongitude: number;
    departureTime: Date;
    meetingLocation: string;
    availableSeats: number;
    remainingSeats: number;
    driver: User;
    car: Car;
    passengers: Passenger[];
    messages: Message[];

    constructor(init?: Partial<Trip>) {
        Object.assign(this, init);
    }
}

export class Message {
    tripId: number;
    userId: number;
    id: number;
    logDate: Date;
    comment: string;
    firstName: string;
    lastName: string;

    constructor(init?: Partial<Message>) {
        Object.assign(this, init);
    }
}