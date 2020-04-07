export class User {
    username: string;
    name: string;
    phone: string;
    email: string;
    address: Address;

    public static generate_id(): string { return `USER${crypto.randomBytes(6).toString('hex')}`; }

    constructor(user: User) {
        this.username = user.username || User.generate_id();
        this.name = user.name;
        this.phone = user.phone;
        this.email = user.email;
        this.address = user.address;
    }

}

export class Address {
    addressLine1: string;
    addressLine2: string;
    pincode: number;
    city: string;
    state: string;
}