export interface IProduct {
	id: TProductId;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
	inBasket: boolean;
}

export enum PaymentMethod {
	Cash = 'cash',
	Сard = 'online',
}

export interface IOrderData {
	items: IProduct[];
	payment: string;
	email: string;
	phone: string;
	address: string;
}
export interface IRequestOrderData {
	items: TProductId[];
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
}

export type TProductId = Pick<IProduct, 'id'>;

export interface IProductsListData {
	set products(products: IProduct[]);
	get products(): IProduct[];
}

export interface ISuccessOrder {
	id: string;
	total: number;
}

type OrderForm = Omit<IOrderData, 'items'>;

export interface IAppData {
	formErrors: Partial<Record<keyof OrderForm, string>>;
	addProduct(product: IProduct): void;
	deleteProduct(product: TProductId): void;
	checkProductInOrder(productId: TProductId): boolean;
	clearBasket(): void;
	getTotal(): number;
	getCount(): number;
	get order(): IOrderData;
}

export type TOrderCartInfo = Pick<IOrderData, 'items'>;

export type TOrderPaymentInfo = Pick<IOrderData, 'payment' | 'address'>;

export type TOrderСontactsInfo = Pick<IOrderData, 'email' | 'phone'>;

export interface IModalData {
	content: HTMLElement;
}

export type ApiPostMethods = 'POST' | 'PUT';

export interface IApi {
	get<T>(url: string): Promise<T>;
	post<T>(url: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export type TFormErrors = Partial<Record<keyof IOrderForm, string>>;

export type CategoryKeys =
	| 'софт-скил'
	| 'хард-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка';
