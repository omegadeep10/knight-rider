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
    latitude: number;
    longitude: number;
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
    color: string;
    licensePlate: string;

    constructor(init?: Partial<Car>) {
        Object.assign(this, init);
    }
}

export class Location {
    id: number;
    tripId: number;
    userId: number;
    latitude: number;
    longitude: number;
    speed: number;
    currentTime: Date;

    constructor(init?: Partial<Location>) {
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
    address: string;
    latitude: number;
    longitude: number;

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
    destName: string;
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
    locations: Location[];
    currentLatitude: number;
    currentLongtitude: number;
    completed: boolean;
    completedTimestamp: Date;

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

export class Review {
    tripId: number;
    userId: number;
    id: number;
    logDate: Date;
    score: number;
    profilePicture: string;
    comment: string;
    firstName: string;
    lastName: string;

    constructor(init?: Partial<Review>) {
        Object.assign(this, init);
    }
}