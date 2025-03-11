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

#### Класс productsListData

Класс отвечает за хранение и логику работы с данными списка товаров

Поля:
- `_products: IProduct[]` - Массив объектов товаров

- `_preview: TProductId | null` - Id товара выбранного для просмотра

Методы:
- `setProducts(products: IProduct[]): void;` - Добавляет товары в массив
- `getProducts(): IProduct[];` - массив товаров
- `setPreview(productId: TProductId): void;` - по id устанавливает товар в preview

#### Класс orderData

Класс отвечает за хранение и логику работы с данными заказа, конструктор класса принимает инстант брокера событий

Поля:
- `_items: IProduct[]` - список товаров в заказе
- `payment: PaymentMethod` - способ оплаты
- `email: string` - почта
- `phone: string` - телефон
- `address: string `- адресс
- `formErrors: Partial<Record<keyof OrderForm, string>>` - ошибки
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных 

Методы:


- `addProduct(product: IProduct): void;` - добавляет один товар
- `deleteProduct(productId: TProductId): void;` - удаляет один товар по id
- `setPaymentInfo(paymentInfo: TOrderPaymentInfo): void;` - сохраняет данные оплаты
- `checkPaymentInfoValidation(data: Record<keyof TOrderPaymentInfo, string>): boolean` - проверяет валидность данных оплаты
- `setСontactstInfo(contactstInfo: TOrderСontactsInfo): void;` - сохраняет контактные данные
- `checkСontactstInfoValidation(data: Record<keyof TOrderСontactsInfo, string>): boolean` - проверяет валидность контактных данных
- `checkProductInOrder(product: TProductId): boolean;` - проверяет отсутствие товара в корзине
- `clearCart(): void;` - очищает корзину
- `getTotal(): number;` - возвращает общую стоимость товаров в корзине
- `getCount(): number;` - возвращает общее количество товаров в корзине

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
- `setValid(isValid: bool): void` - акивирует и отключает кнопку подверждения

#### Класс ProductCard
Наследуется от Component, отвечает за отображение товара в списке товаров
- `constructor(container: HTMLElement, events: IEvents)`

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

#### Класс ProductCardPreview
Расширяет класс ProductCard. Отвечает за отображение подробной карточки товара

- `constructor(container: HTMLElement, events: IEvents)`

Методы:
- `open(data: IProduct): void` - расширяет родительский метод принимая данные карточки товара
- `close(): void` - расширяет родительский метод очищая данные при закрытии

#### Класс ProductCardInCart
Расширяет класс ProductCard. Отвечает за отображение карточки товара в корзине

- `constructor(container: HTMLElement, events: IEvents)`

Методы:
- `delete(): void` - удаляет отображение карточки

#### Класс  Basket
Отвечает за отображение списка товаров в корзине

- `constructor(container: HTMLElement, events: IEvents)`

Свойства:
- `protected _list: HTMLElement;` - список товаров
- `protected _total: HTMLElement;` - итоговая цена
- `protected _button: HTMLElement;` - кнопка подтверждения

Методы:
- `set items(items: HTMLElement[])` - добавляет товары в список
- `set total(total: number)` - устанавливает итоговую цену 

#### Класс productContainer
Отвечает за отображения списка доступных товаров

Методы:
- `addProducts(productElements: HTMLElement[]): void` - для добавления товаров


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
-`postOrder(order: IAppData): Promise<ISuccessOrder>` - отправляет запрос по совершению заказа в api


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
- `contact:validation` - событие, сообщающее о необходимости валидации формы контактных данных

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
interface IAppData {
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
  products: IProduct[];
  preview: TProductId | null;
  addProduct(product: IProduct): void;
  getProduct(productId: TProductId): IProduct;
  setPreview(productId: TProductId): void;
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

`type TOrderCartInfo = Pick<IAppData, "items" | "total">`

Тип для формы способа оплаты 

`type TOrderPaymentInfo = Pick<IAppData, "payment" | "address">`

Тип для формы контактных данных

`type TOrderСontactsInfo = Pick<IAppData, "email" | "phone">`
