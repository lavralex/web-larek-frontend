import { IModalData } from '../../types';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	private isOpened = false;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		if (!this.isOpened) {
			this.toggleClass(this.container, 'modal_active', true);
			this.isOpened = true;
			this.events.emit('modal:open');
		}
	}

	close() {
		if (this.isOpened) {
			this.toggleClass(this.container, 'modal_active', false);
			this.isOpened = false;
			this.content = null;
			this.events.emit('modal:close');
		}
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
