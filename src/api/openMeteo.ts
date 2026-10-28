import type {
  Coords,
  CurrentWeather,
  CurrentWeatherResponse,
  DailyForecastResponse,
  ForecastRow,
  GeocodingResponse,
  GeoResult,
} from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// Кэш запросов: одинаковый URL повторно не запрашиваем (экономим лимиты API,
// а StrictMode в dev-режиме не удваивает запросы)
const cache = new Map<string, Promise<unknown>>();

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** fetch с проверкой статуса; при 429 (лимит запросов) пробуем ещё раз с паузой */
async function request<T>(url: string, retries = 2): Promise<T> {
  const response = await fetch(url);
  if (response.status === 429 && retries > 0) {
    await sleep(1500);
    return request<T>(url, retries - 1);
  }
  if (!response.ok) {
    throw new Error(`Ошибка запроса (${response.status})`);
  }
  return (await response.json()) as T;
}

/** Общий helper над fetch: кэширует успешные ответы, неудачные из кэша убирает */
function fetchJson<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached) return cached as Promise<T>;
  const promise = request<T>(url).catch((err: unknown) => {
    cache.delete(url);
    throw err instanceof Error && err.name !== 'TypeError'
      ? err
      : new Error('Не удалось загрузить данные. Проверьте подключение к интернету');
  });
  cache.set(url, promise);
  return promise;
}

/** Поиск городов по названию (используется и карточками, и автодополнением) */
export async function searchCities(name: string, count = 5): Promise<GeoResult[]> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=${count}`;
  const data = await fetchJson<GeocodingResponse>(url);
  return data.results ?? [];
}

/** Запрос 1: координаты города по названию (берём первое совпадение) */
export async function getCityCoords(city: string): Promise<Coords> {
  const results = await searchCities(city, 1);
  if (results.length === 0) {
    throw new Error(`Город «${city}» не найден`);
  }
  return { lat: results[0].latitude, lng: results[0].longitude };
}

/** Запрос 2: текущая погода по координатам (скорость ветра в м/с) */
export async function getCurrentWeather(coords: Coords): Promise<CurrentWeather> {
  const url =
    `${FORECAST_URL}?latitude=${coords.lat}&longitude=${coords.lng}` +
    `&current_weather=true&windspeed_unit=ms`;
  const data = await fetchJson<CurrentWeatherResponse>(url);
  return data.current_weather;
}

/** Прогноз на 7 дней: превращаем параллельные массивы daily в массив строк таблицы */
export async function getDailyForecast(coords: Coords): Promise<ForecastRow[]> {
  const url =
    `${FORECAST_URL}?latitude=${coords.lat}&longitude=${coords.lng}` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=GMT`;
  const { daily } = await fetchJson<DailyForecastResponse>(url);
  return daily.time.map((date, i) => ({
    date,
    weatherCode: daily.weathercode[i],
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
  }));
}
