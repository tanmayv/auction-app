"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vehicles_1 = require("./vehicles");
const simple_api_1 = require("./simple-api");
const express = require("express");
class App {
    static get port() { return 3000; }
    static init() {
        switch (process.argv[2]) {
            case 'start-server':
                return App.start_server();
            case 'list-vehicles':
                return simple_api_1.SimpleAPI.list_vehicles();
            default:
                return App.display_help();
        }
    }
    static start_server() {
        const server = express();
        server.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
            next();
        });
        server.use(express.json());
        server.get('/make-vehicle', App.make_vehicle);
        server.post('/auctionItem', App.createAuctionItem);
        server.get('/auctionItem', App.getAuctionItems);
        server.post('/user', App.registerUser);
        server.get('/user', App.fetchUser);
        server.get('/bid', App.createBid);
        server.get('/', (req, res) => { res.send('call /make-vehicle to create a vehicle'); });
        server.listen(App.port, () => { console.log('Listening on port ' + App.port); });
    }
    static createAuctionItem(request, response) {
        console.log(request.body);
        simple_api_1.SimpleAPI.createAuctionItem(request.body).then((auctionItem) => {
            response.json(auctionItem);
        });
    }
    static createBid(request, response) {
        response.json(simple_api_1.SimpleAPI.newBid(request.query));
    }
    static getAuctionItems(request, response) {
        response.json(simple_api_1.SimpleAPI.listAuctionItems(request.query.id));
    }
    static registerUser(request, response) {
        response.json(simple_api_1.SimpleAPI.registerUser(request.body));
    }
    static fetchUser(request, response) {
        response.json(simple_api_1.SimpleAPI.fetchUser(request.query.username));
    }
    static make_vehicle(request, response) {
        let types = [vehicles_1.GroceryGetter.name, vehicles_1.CopAttractor.name, vehicles_1.JunkHauler.name];
        if (!request.query.class || !types.includes(request.query.class)) {
            return response.send('class parameter must be one of [ ' + types.join(' | ') + ' ]');
        }
        simple_api_1.SimpleAPI.make_vehicle(request.query.class)
            .then((vehicle) => { response.json(vehicle); });
    }
    static display_help() { console.log('usage: index.ts [ start-server | list-vehicles ]'); }
}
App.init();
//# sourceMappingURL=index.js.map