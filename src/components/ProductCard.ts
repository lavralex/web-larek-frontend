import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IProduct, TProductId } from '../types';
import { CDN_URL } from '../utils/constants';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class ProductCard extends Component<IProduct> {
	protected _id: TProductId;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _inBasket: boolean;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: TProductId) {
		this._id = value;
	}

	get id() {
		return this._id;
	}

	set image(value: string) {
		const src = CDN_URL + value;
		this.setImage(this._image, src, this._title.textContent);
	}

	set category(value: string) {
		this._category.textContent = value;
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number) {
		if (typeof value == 'number') {
			this._price.textContent = value + ' синапсов';
		} else if (value === null) {
			this._price.textContent = 'Бесценно';
			if (this._button) {
				this._button.disabled = true;
			}
		}
	}

	set inBasket(value: boolean) {
		if (!this._button.disabled) {
			this._button.disabled = value;
		}
	}
}

export class ProductCardInList extends ProductCard {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
	}
}

export class ProductCardPreview extends ProductCard {
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
	}
}

interface IProductBasket extends IProduct {
	index: number;
}

export class ProductCardInBasket extends ProductCard {
	protected _index: HTMLElement;

	constructor(
		blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(blockName, container, actions);

		this._title = container.querySelector(`.${blockName}__title`);
		this._index = container.querySelector(`.basket__item-index`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);

		if (this._button) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
		}
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}

	render(data: Partial<IProductBasket>): HTMLElement {
		super.render(data);
		this.index = data.index;
		return this.container;
	}
}
