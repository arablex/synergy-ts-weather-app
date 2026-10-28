// Частичная типизация ответов API open-meteo (только те поля, которые используем)

/** Один результат геокодинга */
export interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

/** Ответ geocoding-api: при отсутствии совпадений поле results не приходит */
export interface GeocodingResponse {
  results?: GeoResult[];
}

/** Текущая погода (current_weather=true) */
export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}

export interface CurrentWeatherResponse {
  current_weather: CurrentWeather;
}

/** Суточный прогноз (daily=weathercode,temperature_2m_max,temperature_2m_min) */
export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface DailyForecastResponse {
  daily: DailyForecast;
}

/** Строка таблицы прогноза, собранная из массивов daily */
export interface ForecastRow {
  date: string;
  min: number;
  max: number;
  weatherCode: number;
}

/** Координаты города */
export interface Coords {
  lat: number;
  lng: number;
}

/** Словарь расшифровки weathercode */
export type WeatherInterpretation = Record<number, string>;

/** Состояние асинхронной загрузки */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
