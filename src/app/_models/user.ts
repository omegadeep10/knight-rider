export class User {
    id: number;   
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    address?: string;
    zip?: string;
    phone?: string;
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
    id: number;
    origin: string;
    destination: string;
    departureTime: Date;
    meetingLocation: string;
    availableSeats: number;
    passengers: Passenger[];

    constructor(init?: Partial<Trip>) {
        Object.assign(this, init);
    }
}