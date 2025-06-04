import { IEvents } from './base/events';
import { Form } from './common/Form';
import { TOrderСontactsInfo } from '../types';

export class Contacts extends Form<TOrderСontactsInfo> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	protected onInputChange(field: keyof TOrderСontactsInfo, value: string) {
		super.onInputChange(field, value);
		this.events.emit('orderInput:change', {
			field,
			value,
		});
	}
}
