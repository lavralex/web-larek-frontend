export interface IProduct {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
}

enum PaymentMethod {
  Online = "online",
  UponReceipt = "upon receipt"
}

export interface IOrder {
  items: IProduct[];
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  count: number;
}

export interface IProductsListData {
  products: IProduct[];
  preview: Pick<IProduct, '_id'> | null;
  addProduct(product: IProduct): void;
  getProduct(productId: Pick<IProduct, '_id'>): IProduct;
}

export interface IOrderData {
  items: IProduct[];
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  count: number;
  addProduct(product: IProduct): void;
  deleteProduct(productId: string): void;
  setPaymentInfo(paymentInfo: TOrderPaymentInfo): void;
  checkPaymentInfoValidation(data: Record<keyof TOrderPaymentInfo, string>): boolean
  setСontactstInfo(contactstInfo: TOrderСontactsInfo): void;
  checkСontactstInfoValidation(data: Record<keyof TOrderСontactsInfo, string>): boolean
} 

export type TOrderCartInfo = Pick<IOrder, "items" | "total">

export type TCartInfo = Pick<IOrder, "count">

export type TOrderPaymentInfo = Pick<IOrder, "payment" | "address">

export type TOrderСontactsInfo = Pick<IOrder, "email" | "phone">