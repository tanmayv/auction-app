"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class AuctionItem {
    constructor(imageUrl, minPrice) {
        this.id = AuctionItem.generate_id();
        this.imageUrl = imageUrl;
        this.minPrice = minPrice;
        this.currentMaxBid = 0;
        this.totalBids = 0;
    }
    static generate_id() { return `AI${crypto.randomBytes(12).toString('hex')}`; }
}
exports.AuctionItem = AuctionItem;
//# sourceMappingURL=auction-item.js.map