"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vehicles_1 = require("./vehicles");
const datastore_1 = require("./datastore");
const auction_item_1 = require("./auction-item");
const user_1 = require("./user");
const bid_1 = require("./bid");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
// Set some defaults (required if your JSON file is empty)
db.defaults({ auctions: [], users: [], bids: [] })
    .write();
class SimpleAPI {
    static async make_vehicle(vehicle_class) {
        let vehicle = await SimpleAPI.get_new_vehicle(vehicle_class);
        return SimpleAPI.save_vehicle(vehicle);
    }
    static async createAuctionItem(auctionItem) {
        auctionItem = new auction_item_1.AuctionItem(auctionItem.imageUrl, auctionItem.minPrice, auctionItem.title, auctionItem.description);
        return SimpleAPI.saveAuctionItem(auctionItem);
    }
    static registerUser(user) {
        user = new user_1.User(user);
        return SimpleAPI.saveUser(user);
    }
    static saveUser(user) {
        const current = db.get('users').find({ id: user.username }).value();
        if (!current) {
            db.get('users')
                .push(user)
                .write();
            return user;
        }
        else {
            throw "duplicate username";
        }
    }
    static fetchUser(username) {
        return db.get('users').find({ 'username': username }).value() || {};
    }
    static newBid(bid) {
        const existingBid = db.get('bids').find({ username: bid.username, auctionId: bid.auctionId }).value();
        if (existingBid) {
            return db.get('bids').find({ username: bid.username, auctionId: bid.auctionId }).assign({ amount: bid.amount }).value();
        }
        else {
            return db.get('bids').push(new bid_1.Bid(bid)).write();
        }
    }
    static listAuctionItems(id) {
        let query = db.get('auctions');
        if (id)
            query = query.find({ 'id': id });
        return query.value() || {};
    }
    static async get_new_vehicle(vehicle_class) {
        switch (vehicle_class) {
            case vehicles_1.GroceryGetter.name:
                return new vehicles_1.GroceryGetter(vehicles_1.VehicleColor.Blue);
            case vehicles_1.CopAttractor.name:
                return new vehicles_1.CopAttractor(vehicles_1.VehicleColor.Red);
            case vehicles_1.JunkHauler.name:
                return new vehicles_1.JunkHauler(vehicles_1.VehicleColor.Green);
            default:
                throw new Error('Invalid vehicle class');
        }
    }
    static async save_vehicle(vehicle) {
        let path = 'data/vehicles/' + vehicle.vehicle_id + '.json';
        return new Promise((resolve, reject) => {
            datastore_1.DataStore.write(path, vehicle)
                .then(() => { return resolve(vehicle); })
                .catch((error) => { return reject(error); });
        });
    }
    static async saveAuctionItem(auctionItem) {
        console.log(auctionItem);
        return new Promise((resolve, reject) => {
            const current = db.get('auctions').find({ id: auctionItem.id }).value();
            if (!current) {
                db.get('auctions')
                    .push(auctionItem)
                    .write();
                return resolve(auctionItem);
            }
            else {
                return reject('Duplicate ID');
            }
        });
    }
    static async list_vehicles() {
        let list = await datastore_1.DataStore.list('data/vehicles/');
        return list.forEach(item => console.log(item));
    }
}
exports.SimpleAPI = SimpleAPI;
//# sourceMappingURL=simple-api.js.map