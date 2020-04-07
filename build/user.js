"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(user) {
        this.username = user.username || User.generate_id();
        this.name = user.name;
        this.phone = user.phone;
        this.email = user.email;
        this.address = user.address;
    }
    static generate_id() { return `USER${crypto.randomBytes(6).toString('hex')}`; }
}
exports.User = User;
class Address {
}
exports.Address = Address;
//# sourceMappingURL=user.js.map