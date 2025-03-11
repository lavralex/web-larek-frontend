export interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
}

enum PaymentMethod {
  Online = "online",
  Сard = "card"
}

export interface IAppData {
  items: string[];
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
}

type TProductId = Pick<IProduct, 'id'>;

export interface IProductsListData {
  products: IProduct[];
  preview: TProductId | null;
  setProducts(products: IProduct[]): void;
  getProducts(): IProduct[];
  setPreview(productId: TProductId): void;
}

export interface ISuccessOrder {
  id: string;
  total: number
}

type OrderForm = Omit<IAppData, 'total' | 'items'>;

export interface IOrderData {
  items: IProduct[];
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  formErrors: Partial<Record<keyof OrderForm, string>>;
  addProduct(product: IProduct): void;
  deleteProduct(product: TProductId): void;
  setPaymentInfo(paymentInfo: TOrderPaymentInfo): void;
  checkPaymentInfoValidation(data: TOrderPaymentInfo): boolean;
  setСontactstInfo(contactstInfo: TOrderСontactsInfo): void;
  checkСontactstInfoValidation(data: TOrderСontactsInfo): boolean;
  checkProductInOrder(product: TProductId): boolean;
  clearCart(): void;
  getTotal(): number;
  getCount(): number;
} 

export type TOrderCartInfo = Pick<IAppData, "items" | "total">

export type TOrderPaymentInfo = Pick<IAppData, "payment" | "address">

export type TOrderСontactsInfo = Pick<IAppData, "email" | "phone">

export interface IModalData {
  content: HTMLElement;
}