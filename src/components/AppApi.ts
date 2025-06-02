import {
	IApi,
	IProduct,
	ISuccessOrder,
	TProductId,
	IRequestOrderData,
} from '../types';

interface IProductListRes {
	total: number;
	items: IProduct[];
}

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getProductsList(): Promise<IProduct[]> {
		return this._baseApi
			.get<IProductListRes>('/product')
			.then((products: IProductListRes) => products.items);
	}

	getProductItem(id: TProductId): Promise<IProduct> {
		return this._baseApi
			.get<IProduct>(`/product/${id}`)
			.then((product: IProduct) => product);
	}

	postOrder(order: IRequestOrderData): Promise<ISuccessOrder> {
		return this._baseApi
			.post<ISuccessOrder>('/order', order)
			.then((res: ISuccessOrder) => res);
	}
}
