import { IEvents } from './base/events';
import { Form } from './common/Form';
import { TOrderСontactsInfo } from '../types';

export class Contacts extends Form<TOrderСontactsInfo> {
	protected _emailCache: string = '';
	protected _phoneCache: string = '';

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	get emailCache(): string {
		return this._emailCache;
	}

	get phoneCache(): string {
		return this._phoneCache;
	}

	protected onInputChange(field: keyof TOrderСontactsInfo, value: string) {
		if (field === 'email') {
			this._emailCache = value;
		} else if (field === 'phone') {
			this._phoneCache = value;
		}
		super.onInputChange(field, value);
		this.events.emit('orderInput:change', {
			field,
			value,
		});
	}
}
