import * as crypto from 'crypto'

export class Bid {
    id: string;
    username: string;
    auctionId: string;
    amount: number
    public static generate_id(): string { return `BID${crypto.randomBytes(6).toString('hex')}`; }

    constructor(bid) {
        this.id = Bid.generate_id();
        this.username = bid.username;
        this.auctionId = bid.auctionId;
        this.amount = bid.amount;
    }
}