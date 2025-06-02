import { IProduct, TProductId, IProductsListData } from '../types';
import { IEvents } from './base/events';

export class Product implements IProduct {
	id: TProductId;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
	inBasket = false;

	constructor(public data: IProduct, private events: IEvents) {
		Object.assign(this, data);
	}
}

export class ProductsListData implements IProductsListData {
	protected _products: Product[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set products(products: IProduct[]) {
		this._products = products.map(
			(item) => new Product({ ...item, inBasket: false }, this.events)
		);
		this.events.emit('products:change', { products: this._products });
	}

	get products(): Product[] {
		return this._products;
	}

	removeFromBasket() {
		this.products.forEach((item) => (item.inBasket = false));
	}
}
