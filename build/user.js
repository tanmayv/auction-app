"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
var UserRole;
(function (UserRole) {
    UserRole[UserRole["STANDARD"] = 0] = "STANDARD";
    UserRole[UserRole["ADMIN"] = 1] = "ADMIN";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
class User {
    constructor(user) {
        this.username = user.username || User.generate_id();
        this.name = user.name;
        this.phone = user.phone;
        this.email = user.email;
        this.address = user.address;
        this.role = UserRole.STANDARD;
    }
    static generate_id() { return `USER${crypto.randomBytes(6).toString('hex')}`; }
}
exports.User = User;
class Address {
}
exports.Address = Address;
//# sourceMappingURL=user.js.map