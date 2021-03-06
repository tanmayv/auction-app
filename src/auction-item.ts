import * as crypto from 'crypto'

export class AuctionItem {
    id: string;
    currentMaxBid: number;
    totalBids: number;
    minPrice: number;
    imageUrl: string;
    title: string;
    description: string;

    public static generate_id(): string { return `AI${crypto.randomBytes(12).toString('hex')}`; }

    constructor(imageUrl,minPrice, title, description) {
        this.id = AuctionItem.generate_id();
        this.imageUrl = imageUrl;
        this.minPrice = minPrice;
        this.description = description;
        this.currentMaxBid = 0;
        this.totalBids = 0;
        this.title = title;
    }
}