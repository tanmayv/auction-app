import { Vehicle, VehicleColor, VehicleType, GroceryGetter, JunkHauler, CopAttractor } from './vehicles'
import { DataStore } from './datastore'
import { AuctionItem } from './auction-item'
import { User } from './user'
import { Bid } from './bid'

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ auctions: [], users: [], bids: [] })
  .write()

export abstract class SimpleAPI {

	public static async make_vehicle(vehicle_class: string): Promise<Vehicle> {

		let vehicle: Vehicle = await SimpleAPI.get_new_vehicle(vehicle_class)
		return SimpleAPI.save_vehicle(vehicle)
	}

	public static async createAuctionItem(auctionItem: AuctionItem): Promise<AuctionItem> {
		auctionItem = new AuctionItem(auctionItem.imageUrl, auctionItem.minPrice, auctionItem.title, auctionItem.description);
		return SimpleAPI.saveAuctionItem(auctionItem);
	}

	public static registerUser(user: User) {
		user = new User(user);
		return SimpleAPI.saveUser(user);
	}

	public static saveUser(user) {
		const current  = db.get('users').find({id: user.username}).value();
			if (!current) {
				db.get('users')
				.push(user)
				.write();
				return user;
			} else {
				throw "duplicate username";
			}
	}

	public static fetchUser(username) {
		return db.get('users').find({'username': username}).value() || {};
	}

	public static newBid(bid: Bid) {
		const existingBid = db.get('bids').find({username: bid.username, auctionId: bid.auctionId}).value();
		if (existingBid) {
			return db.get('bids').find({username: bid.username, auctionId: bid.auctionId}).assign({amount: bid.amount}).value();
		} else {
			return db.get('bids').push(new Bid(bid)).write();
		}
	}

	public static listAuctionItems(id: string): AuctionItem[] {
		let query = db.get('auctions');
		if (id) query = query.find({'id': id});
		return query.value() || {};
	}

	private static async get_new_vehicle(vehicle_class: string) {

		switch (vehicle_class) {
			
			case GroceryGetter.name:
				return new GroceryGetter(VehicleColor.Blue)
			
			case CopAttractor.name:
				return new CopAttractor(VehicleColor.Red)

			case JunkHauler.name:
				return new JunkHauler(VehicleColor.Green)
			
			default:
				throw new Error('Invalid vehicle class')
		}
	}

	private static async save_vehicle(vehicle: Vehicle): Promise<Vehicle> {

		let path = 'data/vehicles/' + vehicle.vehicle_id + '.json'
		return new Promise<Vehicle>((resolve, reject) => {

			DataStore.write(path, vehicle)
				.then(() => { return resolve(vehicle) })
				.catch((error) => { return reject(error)})
		})
	}

	private static async saveAuctionItem(auctionItem: AuctionItem): Promise<AuctionItem> {
		console.log(auctionItem);
		return new Promise<AuctionItem>((resolve, reject) => {
			const current  = db.get('auctions').find({id: auctionItem.id}).value();
			if (!current) {
				db.get('auctions')
				.push(auctionItem)
				.write();
				return resolve(auctionItem);
			} else {
				return reject('Duplicate ID');
			}
		})
	}

	

	public static async list_vehicles(): Promise<any> {

		let list = await DataStore.list('data/vehicles/')
		return list.forEach(item => console.log(item))
	}
}