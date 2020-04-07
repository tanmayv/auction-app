"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class Bid {
    constructor(bid) {
        this.id = Bid.generate_id();
        this.username = bid.username;
        this.auctionId = bid.auctionId;
        this.amount = bid.amount;
    }
    static generate_id() { return `BID${crypto.randomBytes(6).toString('hex')}`; }
}
exports.Bid = Bid;
//# sourceMappingURL=bid.js.map