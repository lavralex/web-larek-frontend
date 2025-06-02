import { IEvents } from './base/events';
import { Form } from './common/Form';
import { TOrderPaymentInfo } from '../types';
import { PaymentMethod } from '../types';

export class Payment extends Form<TOrderPaymentInfo> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		protected events: IEvents
	) {
		super(container, events);
		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this._cash.classList.add('button_alt-active');
				this._card.classList.remove('button_alt-active');
				this.onInputChange('payment', PaymentMethod.Cash);
			});
		}
		if (this._card) {
			this._card.addEventListener('click', () => {
				this._cash.classList.remove('button_alt-active');
				this._card.classList.add('button_alt-active');
				this.onInputChange('payment', PaymentMethod.Сard);
			});
		}
	}

	deactivateButtons() {
		this._cash.classList.remove('button_alt-active');
		this._card.classList.remove('button_alt-active');
	}
}
