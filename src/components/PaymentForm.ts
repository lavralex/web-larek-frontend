import { IEvents } from './base/events';
import { Form } from './common/Form';
import { TOrderPaymentInfo } from '../types';
import { PaymentMethod } from '../types';

export class Payment extends Form<TOrderPaymentInfo> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
		if (this._cash) {
			this._cash.addEventListener('click', () =>
				this.togglePaymentMethod(PaymentMethod.Cash)
			);
		}
		if (this._card) {
			this._card.addEventListener('click', () =>
				this.togglePaymentMethod(PaymentMethod.Сard)
			);
		}
	}

	private togglePaymentMethod(method: PaymentMethod): void {
		const isCard = method === PaymentMethod.Сard;

		this.toggleClass(this._card, 'button_alt-active', isCard);
		this.toggleClass(this._cash, 'button_alt-active', !isCard);
		this.onInputChange('payment', method);
	}

	deactivateButtons(): void {
		this.toggleClass(this._cash, 'button_alt-active', false);
		this.toggleClass(this._card, 'button_alt-active', false);
	}

	clearForm(): void {
		super.clearForm();
		this.deactivateButtons();
	}
}
