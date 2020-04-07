"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vehicles_1 = require("./vehicles");
const datastore_1 = require("./datastore");
const auction_item_1 = require("./auction-item");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
// Set some defaults (required if your JSON file is empty)
db.defaults({ auctions: [], users: [] })
    .write();
class SimpleAPI {
    static async make_vehicle(vehicle_class) {
        let vehicle = await SimpleAPI.get_new_vehicle(vehicle_class);
        return SimpleAPI.save_vehicle(vehicle);
    }
    static async createAuctionItem(auctionItem) {
        auctionItem = new auction_item_1.AuctionItem(auctionItem.imageUrl, auctionItem.minPrice);
        return SimpleAPI.saveAuctionItem(auctionItem);
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