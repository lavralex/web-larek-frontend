import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ProductsListData, Product } from './components/ProductsData';
import { AppData } from './components/AppData';
import { AppApi } from './components/AppApi';
import {
	IApi,
	IProduct,
	IOrderData,
	ISuccessOrder,
	TProductId,
	TOrderPaymentInfo,
	TOrderСontactsInfo,
	IOrderForm,
	IRequestOrderData,
} from './types';
import { Api } from './components/base/api';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, settings } from './utils/constants';
import { Page } from './components/Page';
import {
	ProductCardInList,
	ProductCardPreview,
	ProductCardInBasket,
} from './components/ProductCard';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Payment } from './components/PaymentForm';
import { Contacts } from './components/ContactsForm';
import { Success } from './components/Success';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const page = new Page(document.body, events);
const productsData = new ProductsListData(events);
const appData = new AppData(events);

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const paymentForm = new Payment(
	'order',
	cloneTemplate(paymentTemplate),
	events
);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
		events.emit('modal:close');
	},
});

api
	.getProductsList()
	.then((initialProducts: IProduct[]) => {
		productsData.products = initialProducts;
	})
	.catch((err) => {
		console.log(err);
	});

events.on('products:change', () => {
	page.catalog = productsData.products.map((item) => {
		const card = new ProductCardInList(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('product:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('product:select', (item: Product) => {
	const product = new ProductCardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('product:inBasket', item);
		},
	});
	modal.render({
		content: product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			inBasket: item.inBasket,
		}),
	});
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('product:inBasket', (item: Product) => {
	appData.addProduct(item);
	item.inBasket = true;
	page.counter = appData.getCount();
	modal.close();
});

events.on('basket:open', () => {
	page.locked = true;
	const basketItems = appData.basket.map((item, index) => {
		const basketItem = new ProductCardInBasket(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => events.emit('basketItem:delete', item),
			}
		);
		return basketItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render({
			items: basketItems,
			price: appData.getTotal(),
		}),
	});
});

events.on('basketItem:delete', (item: Product) => {
	appData.deleteProduct(item);
	item.inBasket = false;
	basket.price = appData.getTotal();
	page.counter = appData.getCount();
	basket.setIndexes();
	if (!appData.basket.length) {
		basket.disableButton();
	}
});

events.on('order:payment', () => {
	modal.render({
		content: paymentForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('paymentFormErrors:change', (errors: TOrderPaymentInfo) => {
	const { payment, address } = errors;
	paymentForm.valid = !payment && !address;

	paymentForm.errors = Object.values({ payment, address })
		.filter((msg) => Boolean(msg))
		.map((msg, index) =>
			index > 0 ? msg.charAt(0).toLowerCase() + msg.slice(1) : msg
		)
		.join(' и ');
});

events.on('contactsFormErrors:change', (errors: TOrderСontactsInfo) => {
	const { email, phone } = errors;
	contactsForm.valid = !email && !phone;

	contactsForm.errors = Object.values({ phone, email })
		.filter((msg) => Boolean(msg))
		.map((msg, index) => {
			if (index === 0) {
				return msg;
			} else {
				return msg
					.replace(/^\S+\s*/, '')
					.replace(/^\w/, (firstChar) => firstChar.toLowerCase());
			}
		})
		.join(' и ');
});

events.on(
	'orderInput:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setField(data.field, data.value);
	}
);

events.on('order:submit', () => {
	const currentData = {
		valid: true,
		errors: [] as string[],
	};

	modal.render({
		content: contactsForm.render(currentData),
	});
});

events.on('contacts:submit', () => {
	if (!appData.order.email || !appData.order.phone || appData.order.address) {
		const formFields = [
			{ name: 'email', value: contactsForm.emailCache },
			{ name: 'phone', value: contactsForm.phoneCache },
		];
		formFields.forEach((field) => {
			if (!appData.order[field.name as keyof IOrderData]) {
				appData.setField(field.name as keyof IOrderForm, field.value);
			}
		});
	}

	api
		.postOrder(appData.getRequestOrderData())
		.then((res) => {
			appData.clearOrder();
			page.counter = 0;
			productsData.removeFromBasket();
			basket.clearBasket();
			paymentForm.deactivateButtons();
			events.emit('order:success', res);
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('order:success', (res: ISuccessOrder) => {
	modal.render({
		content: success.render({
			description: res.total,
		}),
	});
});
