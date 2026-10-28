# Погода в городах России

Итоговый проект курса «Программирование на TypeScript»: приложение погоды на **React + TypeScript**,
**React Bootstrap** и **SCSS**. Данные берутся с бесплатного API [open-meteo](https://open-meteo.com/).

## Возможности

- **Главная страница** — заголовок и 6 карточек с текущей погодой (Москва, Санкт-Петербург, Ростов-на-Дону,
  Владивосток, Краснодар, Екатеринбург). Сетка Bootstrap: 3 карточки в ряд на широких экранах,
  2 на средних, 1 на мобильных. Каждая карточка делает 2 запроса: геокодинг (координаты по названию)
  и текущая погода по координатам.
- **Страница прогноза** `/weather/:city?lat=..&lng=..` — ссылка «Назад» на главную, заголовок и таблица
  прогноза на 7 дней (дата `15/06`, мин./макс. температура, описание погоды).
- **Прелоадер** (`Spinner`) при загрузке данных, сообщение об ошибке с кнопкой «Повторить».
- **Задание повышенной сложности** — компонент `AutocompleteInput` (`Form.Control` + `ListGroup`):
  автодополнение города через геокодинг, по клику на вариант поле заполняется названием,
  список скрывается и происходит переход на страницу прогноза этого города.

## Стек

React 19, TypeScript (strict), Vite, React Router, React Bootstrap + Bootstrap 5, SCSS (`sass`).
Проект создан на Vite (шаблон react-ts) вместо Create React App: CRA больше не поддерживается,
а стек (React + TypeScript) тот же.

## Запуск

```bash
npm install
npm run dev          # http://localhost:3000
PORT=4495 npm run dev   # другой порт
npm run typecheck    # tsc --noEmit
npm run build        # проверка типов + сборка в dist/
npm run preview      # просмотр собранной версии
```

Порт настраивается переменной окружения `PORT`, по умолчанию 3000.

## Как проверялось

- `npm run build` — проверка типов (`tsc --noEmit`, strict) и сборка без ошибок.
- Реальные запросы к open-meteo (геокодинг, текущая погода, прогноз на 7 дней) проверены через curl.
- Все сценарии (главная, прогноз, автодополнение, переход по клику, «Назад») пройдены в headless Chrome:
  0 ошибок и предупреждений JavaScript в консоли.

## Структура

```
src/
  api/openMeteo.ts          # запросы fetch: геокодинг, текущая погода, прогноз (+ кэш)
  components/               # WeatherCard, ForecastTable, AutocompleteInput, Loader, ErrorMessage, PageHeader
  hooks/                    # useAsync (data/loading/error), useCityWeather, useForecast, useDebouncedValue
  pages/                    # HomePage, ForecastPage
  types/weather.ts          # типы ответов API и состояния загрузки
  utils/                    # weatherCode (словарь), formatDate, formatTemperature, routes, cities
  styles/                   # SCSS: переменные, подключение Bootstrap, стили компонентов
```
