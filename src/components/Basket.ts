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
			this.setDisabled(this._button, true);
		} else {
			this.setDisabled(this._button, false);
		}
	}

	set price(price: number) {
		this.setText(this._price, formatNumber(price) + ' синапсов');
	}

	setIndexes() {
		Array.from(this._items.children).forEach((item, index) => {
			const itemElement = item.querySelector(
				`.basket__item-index`
			) as HTMLElement;
			const itemIndex = (index + 1).toString();
			this.setText(itemElement, itemIndex);
		});
	}

	disableButton() {
		this.setDisabled(this._button, true);
	}

	clearBasket(): void {
		this._items.replaceChildren();
		this.setText(this._price, '0 синапсов');
		this.disableButton();
	}
}
