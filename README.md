# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Типы данных приложения

Товар

```
interface IProduct {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
}
```

Заказ

```
interface IOrder {
  items: IProduct[];
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  count: number;
}
```

Интерфейс для коллекции товаров

```
interface IProductsListData {
  products: IProduct[];
  preview: Pick<IProduct, '_id'> | null;
  addProduct(product: IProduct): void;
  getProduct(productId: string): IProduct;
}
```

Тип для корзины покупок

```
type TOrderCartInfo = Pick<IOrder, "items" | "total">
```
Тип для значка корзины 

```
type TCartInfo = Pick<IOrder, "count">
```

Тип для формы способа оплаты 

```
type TOrderPaymentInfo = Pick<IOrder, "payment" | "address">
```

Тип для формы контактных данных

```
type TOrderСontactsInfo = Pick<IOrder, "email" | "phone">
```

## Архитектура приложения

Код приложения реализован согласно парадигме MVP
- слой предстваления отвечает за отображение данных
- слой данных отвечает за хранение и изменнение данных
- презентер связывает слои представления и данных

### Базовый код

#### Класс Api

Реализует логику отправки запросов серверу. В конструктор предается адресс сервера и опциональный объект заголовков запроса

Методы:
```
get(uri: string): Promise<object>
```
Принимает параметр:
uri - эндпоинт

Возвращает: промис с объектом ответа

```
post(
  uri: string,
  data: object,
  method: ApiPostMethods = 'POST'
): Promise<object>
```
Принимает параметры:
uri - эндпоинт
data - Объект, который будет преобразован в JSON и отправлен в теле запроса
method - HTTP-метод для запроса. Допустимые значения: 'POST', 'PUT', 'DELETE'.  По умолчанию 'POST'.

Возвращает: промис с объектом ответа

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события

Методы:

```
on<T extends object>(eventName: EventName, callback: (event: T) => void)
```
Подписывает функцию-обработчик callback на событие eventName

```
off(eventName: EventName, callback: Subscriber)
```
Отписывает функцию-обработчик callback от события с именем eventName.

```
emit<T extends object>(eventName: string, data?: T)
```
Публикует событие с именем eventName, передавая данные data всем подписанным обработчикам

### Слой данных

#### Класс productData
Класс отвечает за хранение и логику роботы с данными товара

- checkPriceSalePossibility(price: number): bool - проверяет цену товара на возможность купить его.

#### Класс productsListData

Класс отвечает за хранение и логику работы с данными списка товаров

Поля:
- _products: IProduct[] - Массив объектов товаров

- _preview: Pick<IProduct, '_id'> | null - Id товара выбранного для просмотра

Методы:
```
addProduct(product: IProduct): void;
```
добавляет один товар

```
getProduct(productId: Pick<IProduct, '_id'>): IProduct;
```
возвращает товар по id

#### Класс orderData

Класс отвечает за хранение и логику работы с данными заказа, конструктор класса принимает инстант брокера событий

Поля:
- `_items: IProduct[]` - список товаров в заказе
- `payment: PaymentMethod` - способ оплаты
- `email: string` - почта
- `phone: string` - телефон
- `address: string `- адресс
- `total: number` - итоговая цена
- `count: number` - поличество товаров
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных 

Методы:

```
addProduct(product: IProduct): void;
```
добавляет один товар

```
deleteProduct(productId: string): void;
```
удаляет один товар по id

```
setPaymentInfo(paymentInfo: TOrderPaymentInfo): void;
```
сохраняет данные оплаты

```
checkPaymentInfoValidation(data: Record<keyof TOrderPaymentInfo, string>): boolean
```
проверяет валидность данных оплаты

```
setСontactstInfo(contactstInfo: TOrderСontactsInfo): void;
```
сохраняет контактные данные

```
checkСontactstInfoValidation(data: Record<keyof TOrderСontactsInfo, string>): boolean
```
проверяет валидность контактных данных

`checkProductNotInCart(cart: IProduct[], productId: Pick<IProduct, '_id'>): bool` - проверяет отсутствие товара в корзине

### Слой представления

Классы представления отвечают за отображение передаваемых в них данных

#### Класс Modal

реализует модальное окно
- `constructor(selector: string, events: IEvents)` конструктор принимает selector селектор по которому в разметке страницы будет идентифицированно модальное окно, template шаблон который будет отображаться в модальном окне, modalData - данные для заполнения шаблона и events - экземпляр класса EventEmitter, для инициализации событий.

Поля:
- `modal: HTMLElement` - элемент модального окна
- `events: IEvents `- брокер событий
- `submitButton: HTMLButtonElement` - кнопка подтверждения

Методы:
- `open(): void` - открывает модальное окно
- `close(): void `- закрывает модальное окно
- `setValid(isValid: bool): void` - акивирует и отключает кнопку подверждения

#### Класс ProductCard
отвечает за отображение товара в списке товаров

Поля:
- `_id: string`
- `title: string`
- `description: string`
- `category: string`
- `image: string`
- `price: number`

Методы:
- `setData(data: IProduct): void` - заполняет атрибуты элементов карточки товара данными
- `deleteProduct(): void` - удаляет отображение товара
- `render(): HTMLElement` - возвращает карточку товара
- геттер `id` - возвращает id карточки

#### Класс ProductCardPreviewModal
Расширяет класс ProductCard. Отвечает за отображение подробной карточки товара

Методы:
- `open(data: IProduct): void` - расширяет родительский метод принимая данные карточки товара
- `close(): void` - расширяет родительский метод очищая данные при закрытии

#### Класс ProductCardInCart
Расширяет класс ProductCard. Отвечает за отображение карточки товара в корзине

Методы:
- `delete(): void` - удаляет отображение карточки

#### Класс productContainer
Отвечает за отображения списка доступных товаров

Методы:
- `addProducts(productElements: HTMLElement[]): void` - для добавления товаров

#### Класс OrderCartModal
Расширяет класс Modal. Отвечает за отображение корзины покупок

Поля:
- `items: IProduct[]`
- `totalPrice: number`

Методы:
- `addProduct(productElement: HTMLElement)` - для добавления товара в список покупок
- `renderCart(IProduct[]): void` - отображает данные корзины покупок

#### Класс ModalWithForm
Расширяет класс Modal. Отвечает за отображение окна с формой

Поля:
- `_form: HTMLButtonElement` - элемент формы
- `formName: string` - значение атрибута name формы
- `inputs: NodeListOf<HTMLInputElement>` - список полей формы
- `errors: Record<string, HTMLElement>` - объект хронящий все элементы для вывода ошибок формы

Методы:
- `get form: HTMLElement` - геттер для получения формы
- `getInputValues(): Record<string, string> `- возвращает объект с данными из полей ввода
- `setInputValues(values: Record<string, string>): void` - принимает объект с данными для заполнения полей ввода
- `setError(data: {field: string, value: string, ValidInfo: string}): void` - принимает объект с элементами для вывода ошибок
- `showError(field: string, errorMessage: string): void` - отображает текст ошибки
- `hideError(field: string): void` - скрывает текст ошибки

### Слой коммуникации

#### Класс appApi

Принимает в конструктор экземпляр класса Api и представляет методы взаимодейстия с бэкендом

Список событий которые могут генерироваться в системе:

- `products:change` - изменение масива товаров
- `product:selected` - изменение товара отображаемого в модальном окне
- `product:previewClear` - очистка данных в превью карточни товара 

События возникающие от взаимодейстия в интерфейсом:

- `cart:open` - открывает модальное окно корзины
- `payment:open` - открывает модальное окно методов оплаты
- `contact:open` - открывает модальное окно контактных данных
- `success:open` - открывает окно удачного оформления заказа
- `success:submit` - подтверждение в окне удачного оформления заказа
- `product:select` - выбирает товар для модального окна
- `product:add` - добавляет товар в корзину
- `product:delete` - удаляет товар из корзины
- `payment:input` - изменение данных в форме оплаты
- `payment:submit` - подтверждение в форме оплаты
- `payment:validation` - событие, сообщающее о необходимости валидации формы оплаты
- `contact:input` - изменение данных в форме контактных дыннх 
- `contact:submit` - подтверждение в форме контактных дыннх 
- `contact:validation` - событие, сообщающее о необходимости валидации формы контактных дыннх 