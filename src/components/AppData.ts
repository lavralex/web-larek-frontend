import { IOrderData, TProductId, IAppData, IProduct } from '../types';
import { IEvents } from './base/events';
import { isEmail, isPhoneNumber } from '../utils/formUtils';
import { TFormErrors, IOrderForm, IProductsListData } from '../types';

const emptyOrder: IOrderData = {
	items: [],
	payment: undefined,
	email: '',
	phone: '',
	address: '',
};

const errorsText = {
	payment: 'Выберете способ оплаты',
	email: 'Введите email',
	phone: 'Введите телефон',
	address: 'Введите адрес',
};

export class AppData implements IAppData {
	protected _order: IOrderData = JSON.parse(JSON.stringify(emptyOrder));
	protected events: IEvents;
	protected productsModel: IProductsListData;
	formErrors: TFormErrors = {};

	constructor(events: IEvents, productsModel: IProductsListData) {
		this.events = events;
		this.productsModel = productsModel;
	}

	checkProductInOrder(productId: TProductId) {
		return this._order.items.some((item) => item.id === productId);
	}

	addProduct(product: IProduct) {
		if (!this.checkProductInOrder(product.id)) {
			this._order.items.push(product);
			product.inBasket = true;
		}
	}

	deleteProduct(product: IProduct) {
		product.inBasket = false;
		this._order.items = this._order.items.filter(
			(item) => item.id !== product.id
		);
		const productIndex = this._order.items.findIndex(
			(item) => item.id == product.id
		);
		if (productIndex !== -1) {
			this._order.items.slice(productIndex, 1);
		}
	}

	checkPaymentInfoValidation() {
		const errors: typeof this.formErrors = {};
		if (!isEmail(this.order.email)) {
			errors.email = errorsText.email;
		}
		if (!isPhoneNumber(this.order.phone)) {
			errors.phone = errorsText.phone;
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	checkСontactstInfoValidation() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = errorsText.address;
		}
		if (!this.order.payment) {
			errors.payment = errorsText.payment;
		}
		this.formErrors = errors;
		this.events.emit('paymentFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.checkPaymentInfoValidation()) {
			this.events.emit('contacts:valid', this.order);
		}
		if (this.checkСontactstInfoValidation()) {
			this.events.emit('payment:valid', this.order);
		}
	}

	clearBasket(): void {
		this._order.items = [];
		this.productsModel.products.forEach(
			(product) => (product.inBasket = false)
		);
	}

	getTotal(): number {
		return this._order.items.reduce((sum, product) => sum + product.price, 0);
	}

	getCount(): number {
		return this._order.items.length;
	}

	get order(): IOrderData {
		return this._order;
	}

	get basket() {
		return this.order.items;
	}

	clearOrder(): void {
		this.productsModel.products.forEach(
			(product) => (product.inBasket = false)
		);
		this._order = JSON.parse(JSON.stringify(emptyOrder));
	}

	getRequestOrderData() {
		return {
			items: this.order.items.map((item) => item.id),
			phone: this.order.phone,
			email: this.order.email,
			payment: this.order.payment,
			address: this.order.address,
			total: this.getTotal(),
		};
	}
}
