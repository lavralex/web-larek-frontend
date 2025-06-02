import { Component } from './base/Component';
import { IEvents } from './base/events';
import { formatNumber } from '../utils/utils';

export interface IBasket {
	items: HTMLElement[];
	price: number;
}

export class Basket extends Component<IBasket> {
	protected _items: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		this._items = container.querySelector(`.${blockName}__list`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._price = container.querySelector(`.${blockName}__price`);

		if (this._button) {
			this._button.addEventListener('click', () =>
				this.events.emit('order:payment')
			);
		}
	}

	set items(items: HTMLElement[]) {
		this._items.replaceChildren(...items);
		if (!items.length) {
			this._button.disabled = true;
		} else {
			this._button.disabled = false;
		}
	}

	set price(price: number) {
		this._price.textContent = formatNumber(price) + ' синапсов';
	}

	setIndexes() {
		Array.from(this._items.children).forEach(
			(item, index) =>
				(item.querySelector(`.basket__item-index`).textContent = (
					index + 1
				).toString())
		);
	}

	disableButton() {
		this._button.disabled = true;
	}

	clearBasket(): void {
		this._items.remove();
		this._price.textContent = '0 синапсов';
		this._button.disabled = true;
	}
}
