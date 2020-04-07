import { GroceryGetter, JunkHauler, CopAttractor } from './vehicles';
import { SimpleAPI } from './simple-api'
import * as express from 'express'
import { AuctionItem } from './auction-item';
import { User } from './user';
import { resolveNaptr } from 'dns';

abstract class App {

	static get port(): number { return 3000 }

	static init(): any {

		switch (process.argv[2]) {

			case 'start-server':
				return App.start_server()
			case 'list-vehicles':
				return SimpleAPI.list_vehicles()
			default:
				return App.display_help()
		}
	}

	static start_server(): void {
		
		const server = express()
		server.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
			res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
			next();
		});
		server.use(express.json())
		server.get('/make-vehicle', App.make_vehicle)
		server.post('/auctionItem', App.createAuctionItem)
		server.get('/auctionItem', App.getAuctionItems)
		server.post('/user', App.registerUser)
		server.get('/user', App.fetchUser)
		server.get('/bid', App.createBid)
		server.get('/', (req, res) => { res.send('call /make-vehicle to create a vehicle') })
		server.listen(App.port, () => { console.log('Listening on port ' + App.port) })
	}

	static createAuctionItem(request: express.Request, response: express.Response): void {
		console.log(request.body);
		SimpleAPI.createAuctionItem(request.body).then((auctionItem: AuctionItem) => {
			response.json(auctionItem);
		});
	}

	static createBid(request: express.Request, response: express.Response):void {
		response.json(SimpleAPI.newBid(request.query));
	}

	static getAuctionItems(request: express.Request, response: express.Response): void {
		response.json(SimpleAPI.listAuctionItems(request.query.id))
	}

	static registerUser(request: express.Request, response: express.Response) {
		response.json(SimpleAPI.registerUser(request.body));
	}

	static fetchUser(request: express.Request, response: express.Response) {
		response.json(SimpleAPI.fetchUser(request.query.username));
	}

	static make_vehicle(request: express.Request, response: express.Response) {
		
		let types: Array<string> = [ GroceryGetter.name, CopAttractor.name, JunkHauler.name ]
		if (!request.query.class || !types.includes(request.query.class)) { 
			return response.send('class parameter must be one of [ ' + types.join(' | ') + ' ]')
		}

		SimpleAPI.make_vehicle(request.query.class)
			.then((vehicle) => { response.json(vehicle) })
	}

	static display_help() { console.log('usage: index.ts [ start-server | list-vehicles ]')}
}

App.init()