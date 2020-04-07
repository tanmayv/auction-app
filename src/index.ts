import { GroceryGetter, JunkHauler, CopAttractor } from './vehicles';
import { SimpleAPI } from './simple-api'
import * as express from 'express'
import { AuctionItem } from './auction-item';
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
		server.use(express.json())
		server.get('/make-vehicle', App.make_vehicle)
		server.post('/auctionItem', App.createAuctionItem)
		server.get('/auctionItem', App.getAuctionItems)
		server.get('/', (req, res) => { res.send('call /make-vehicle to create a vehicle') })
		server.listen(App.port, () => { console.log('Listening on port ' + App.port) })
	}

	static createAuctionItem(request: express.Request, response: express.Response): void {
		console.log(request.body);
		SimpleAPI.createAuctionItem(request.body).then((auctionItem: AuctionItem) => {
			response.json(auctionItem);
		});
	}

	static getAuctionItems(request: express.Request, response: express.Response): void {
		response.json(SimpleAPI.listAuctionItems(request.query.id))
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