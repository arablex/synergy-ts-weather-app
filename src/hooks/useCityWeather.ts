import { getCityCoords, getCurrentWeather } from '../api/openMeteo';
import type { Coords, CurrentWeather } from '../types/weather';
import { useAsync } from './useAsync';
import type { UseAsyncResult } from './useAsync';

export interface CityWeather {
  coords: Coords;
  current: CurrentWeather;
}

/** Для карточки: два последовательных запроса — координаты по названию, затем текущая погода */
export function useCityWeather(city: string): UseAsyncResult<CityWeather> {
  return useAsync<CityWeather>(
    async () => {
      const coords = await getCityCoords(city);
      const current = await getCurrentWeather(coords);
      return { coords, current };
    },
    [city],
  );
}
