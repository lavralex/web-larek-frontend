import { IProduct, IProductsListData } from '../types';
import { IEvents } from './base/events';

export class ProductsListData implements IProductsListData {
	protected _products: IProduct[] = [];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set products(products: IProduct[]) {
		this._products = products.map((item) => ({
			...item,
			inBasket: false,
		}));
		this.events.emit('products:change', { products: this._products });
	}

	get products(): IProduct[] {
		return this._products;
	}
}
