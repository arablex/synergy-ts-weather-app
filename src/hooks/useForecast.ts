import { getDailyForecast } from '../api/openMeteo';
import type { Coords, ForecastRow } from '../types/weather';
import { useAsync } from './useAsync';
import type { UseAsyncResult } from './useAsync';

/** Для страницы прогноза: дневной прогноз по координатам из адреса страницы */
export function useForecast(coords: Coords | null): UseAsyncResult<ForecastRow[]> {
  return useAsync<ForecastRow[]>(
    async () => {
      if (!coords) throw new Error('В адресе страницы нет координат (параметры lat и lng)');
      return getDailyForecast(coords);
    },
    [coords?.lat, coords?.lng],
  );
}
