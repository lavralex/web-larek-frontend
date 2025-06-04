import { Component } from './base/Component';
import { formatNumber } from '../utils/utils';

interface ISuccessActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
	description: number;
}

export class Success extends Component<ISuccess> {
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ISuccessActions
	) {
		super(container);
		this._description = container.querySelector(`.${blockName}__description`);
		this._button = container.querySelector(`.${blockName}__close`);
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	set description(value: number) {
		this.setText(this._description, `Списано ${formatNumber(value)} синапсов`);
	}
}
