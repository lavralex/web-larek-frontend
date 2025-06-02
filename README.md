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

## Архитектура приложения

Код приложения реализован согласно парадигме MVP
- слой предстваления отвечает за отображение данных
- слой данных отвечает за хранение и изменнение данных
- презентер связывает слои представления и данных

### Базовый код

#### Класс Component<T>

Базовый абстрактный класс для всех компонентов отображения

Конструктор:
`constructor(protected readonly container: HTMLElement)`

Методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - Переключить класс
- `setText(element: HTMLElement, value: unknown)` - преобразует value в текст и устанавливает его в element
- `setDisabled(element: HTMLElement, state: boolean)` - Сменить статус блокировки element в зависимости от state
- `render(data?: Partial<T>): HTMLElement` - возвращает HTML-элемент
- `setHidden(element: HTMLElement)` - скрывает element
- `setVisible(element: HTMLElement)` - показвает element
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - Установить изображение src с алтернативным текстом alt в элемент element

#### Класс Api

Реализует логику отправки запросов серверу. В конструктор предается адресс сервера и опциональный объект заголовков запроса

Конструктор:
`constructor(baseUrl: string, options: RequestInit = {})`
принимает базовый url baseUrl и объект заголовков 

Методы:

`get(uri: string): Promise<object>` - отправляет GET запрос к серверу

Принимает параметр uri - эндпоинт

Возвращает промис с объектом ответа

`post( uri: string, data: object, method: ApiPostMethods = 'POST' ): Promise<object>`


совершает запрос метода method, по умолчанию POST на эндпоинт uri, отправляя в теле зпроса data. Возвращает: промис с объектом ответа

`protected handleResponse(response: Response): Promise<object>` - Обрабатывает ответ от сервера.
Принимает ответ сервера и возвращает промис с ответом в json

#### Класс EventEmitter
Брокер событий, классическая реализация
Позволяет отправлять события и подписываться на события

Конструктор:
```
constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
}
```

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

`onAll(callback: (event: EmitterEvent) => void)` - Слушать все события

`offAll()` - Сбросить все обработчики

`trigger<T extends object>(eventName: string, context?: Partial<T>)` - Сделать коллбек триггер, генерирующий событие при вызове


### Слой данных

#### Класс Product
Класс отвечает за хранение данных товара и взаимодействие с системой событий.

Поля:
Название	Тип	Описание
- `id:	TProductId`	Уникальный идентификатор товара
- `title:	string`	Название товара
- `description:	string`	Описание товара
- `image:	string`	Ссылка на изображение товара
- `category:	string`	Категория товара
- `price:	number | null`	Цена товара (может быть null, если не указана)
- `inBasket:	boolean`	Флаг, указывающий, находится ли товар в корзине (false по умолчанию)
- `events:	IEvents`	Брокер событий для уведомления системы об изменениях

Конструктор:
`constructor(data: IProduct, events: IEvents)`

Параметры:
`data` — объект с данными товара.
`events` — брокер событий.

#### Класс ProductsListData

Класс отвечает за хранение и логику работы с данными списка товаров

Поля:
- `_products: IProduct[]` - Массив объектов товаров
- `events` - брокер событий

Методы:
- `set products(products: IProduct[])` - Добавляет товары в массив
- `get products(): IProduct[];` - массив товаров
- `removeFromBasket()` - меняет статусы товаров inBasket, помечая что товар не в корзине 

#### Класс AppData

Класс отвечает за хранение и логику работы с данными заказа, конструктор класса принимает инстант брокера событий

Поля:
- `_order: IOrderData` - данные заказа
- `formErrors: Partial<Record<keyof OrderForm, string>>` - ошибки
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных 

Методы:


- `addProduct(product: IProduct): void;` - добавляет один товар
- `deleteProduct(productId: TProductId): void;` - удаляет один товар по id
- `setPaymentInfo(paymentInfo: TOrderPaymentInfo): void;` - сохраняет данные оплаты
- `checkPaymentInfoValidation(): boolean` - проверяет валидность данных оплаты
- `setСontactstInfo(contactstInfo: TOrderСontactsInfo): void;` - сохраняет контактные данные
- `checkСontactstInfoValidation(): boolean` - проверяет валидность контактных данных
- `checkProductInOrder(product: TProductId): boolean;` - проверяет отсутствие товара в корзине
- `clearBasket(): void;` - очищает корзину
- `getTotal(): number;` - возвращает общую стоимость товаров в корзине
- `getCount(): number;` - возвращает общее количество товаров в корзине
- `setField(field: keyof IOrderForm, value: string)` - заполняет поле field данными value
- `get order()` - получить данные заказа
- `get basket()` - получить список продуктов в корзине
- `clearOrder(): void ` - очистить данные заказа
- `getRequestOrderData()` - получить данные заказа для запроса на сервер

### Слой представления

Классы представления отвечают за отображение передаваемых в них данных

`interface IModalData {content: HTMLElement;}` - интерфейс данных модального окна

#### Класс Modal

Наследуется от Component, реализует модальное окно
- `constructor(container: HTMLElement, events: IEvents)` конструктор принимает selector селектор по которому в разметке страницы будет идентифицированно модальное окно, template шаблон который будет отображаться в модальном окне, modalData - данные для заполнения шаблона и events - экземпляр класса EventEmitter, для инициализации событий.

Поля:
- `_content: HTMLElement;` - элемент контента
- `events: IEvents `- брокер событий
- `_closeButton: HTMLButtonElement;` - кнопка подтверждения

Методы:
- `open(): void` - открывает модальное окно
- `close(): void `- закрывает модальное окно
- `set content(value: HTMLElement)` - устанавливает контент
- `render(data: IModalData): HTMLElement` - возвращает HTML-элемент

#### Класс ProductCard
Наследуется от Component, отвечает за отображение товара в списке товаров
- `constructor(container: HTMLElement, events: IEvents)`

Поля:
- `_id: TProductId`
- `_title: HTMLElement`
- `_category: HTMLElement`
- `_image: HTMLImageElement`
- `_price: HTMLElement`
- `_button: HTMLButtonElement`
- `_inBasket: boolean`

конструктор:
`constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) `

`blockName `- название блока 
`container` - HTML елемент 
`actions` - действия для брокера событий

Методы:
- `render(): HTMLElement` - возвращает карточку товара
- set для полей title, category, price заполняют текст элементов
- `set inBasket(value: boolean)` - активирует и отключает кнопку в зависимости от статуса товара
- `set image(value: string)` - устанавливает src и alt для элемента изображения
- set и get id установить и получить id товара

#### Класс ProductCardPreview
Расширяет класс ProductCard. Отвечает за отображение подробной карточки товара

- `constructor(container: HTMLElement, events: IEvents)`

#### Класс ProductCardInBasket
Расширяет класс ProductCard. Отвечает за отображение карточки товара в корзине

- `constructor(blockName: string, container: HTMLElement, actions?: ICardActions)`

Методы:
- `set index(value: number)` - устанавливает индекс товара
- render(data: Partial<IProductBasket>): HTMLElement - переоределяет родительский метод добавляя отображение индексов

#### Класс  Basket
Отвечает за отображение списка товаров в корзине

- `constructor(protected blockName: string,container: HTMLElement,protected events: IEvents)`

Свойства:
- `protected _items: HTMLElement;` - список товаров
- `protected _price: HTMLElement;` - итоговая цена
- `protected _button: HTMLElement;` - кнопка подтверждения

Методы:
- `set items(items: HTMLElement[])` - добавляет товары в список
- `set price(total: number)` - устанавливает итоговую цену
- `setIndexes()`  - устанавливает индекс 
- `disableButton()` -  отключает кнопку
- `clearBasket(): void` - очищает корзину

#### Класс Page
Отвечает за отображения списка доступных товаров

Поля:
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

Методы:
- `addProducts(productElements: HTMLElement[]): void` - для добавления товаров

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)`

Методы:

- `set counter(value: number)` ставить счетчик товаров
- `set catalog(items: HTMLElement[])` ставит список товаров
- `set locked(value: boolean)` - включает и отключает прокрутку страницы

#### Класс Form
Расширяет класс Component. Отвечает за отображение окна с формой

- `constructor(container: HTMLElement, events: IEvents)`

Поля:
- `_form: HTMLButtonElement` - элемент формы
- `formName: string` - значение атрибута name формы
- `inputs: NodeListOf<HTMLInputElement>` - список полей формы
- `errors: Record<string, HTMLElement>` - объект хронящий все элементы для вывода ошибок формы
- `protected _button: HTMLElement;` - кнопка подтверждения

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

Методы:
-`getProductsList(): Promise<IProduct[]>` - запрашивает у api список товаров
-`getProductItem(id: TProductId): Promise<IProduct>` - запрашивает у api подробное описание товара
-`postOrder(order: IOrderData): Promise<ISuccessOrder>` - отправляет запрос по совершению заказа в api


Список событий которые могут генерироваться в системе:

- `products:change` - изменение масива товаров
- `product:select` - изменение товара отображаемого в модальном окне
- `product:inBasket` - добавление товара в корзину
- `basket:open` - окрыть карзину
- `basketItem:delete` - удалить товар
- `order:payment` - открыть форму оплаты
- `order:submit` - открыть форму контактных данных
- `modal:open` - открыть модальное окно
- `modal:close` - закрыть модальное окно
- `orderInput:change` - изменение ввода
- `contactsFormErrors:change` - изменение статуса ошибки контактных данных
- `paymentFormErrors:change` - изменение статуса ошибки оплаты
- `contacts:valid` - форма контактов валидны
- `payment:valid` - форма оплаты валидна
- `contacts:submit` - подтверждение контактных данных и отправка заказа
- `order:success` - окрыть окно успешного заказа 


## Типы данных приложения

Товар

```
interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
}
```

Заказ

```
interface IOrderData {
  items: string[];
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
}
```

- `type TProductId = Pick<IProduct, 'id'>;` - id товара

Интерфейс для коллекции товаров

```
interface IProductsListData {
  set products(products: IProduct[])
  get products(): Product[]
  removeFromBasket(): void
}
```

интерфейс ответа сервера при успешном заказе

```
interface SuccessOrder {
  id: string;
  total: number
}
```

интерфейс класса формирующего заказ

```
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
```

Тип для корзины покупок

`type TOrderCartInfo = Pick<IOrderData, "items" | "total">`

Тип для формы способа оплаты 

`type TOrderPaymentInfo = Pick<IOrderData, "payment" | "address">`

Тип для формы контактных данных

`type TOrderСontactsInfo = Pick<IOrderData, "email" | "phone">`
