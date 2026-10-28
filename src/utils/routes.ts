import type { Coords } from '../types/weather';

/** Адрес страницы прогноза: /weather/St%20Petersburg?lat=59.93863&lng=30.31413 */
export function buildForecastPath(city: string, coords: Coords): string {
  const params = new URLSearchParams({ lat: String(coords.lat), lng: String(coords.lng) });
  return `/weather/${encodeURIComponent(city)}?${params.toString()}`;
}

/** Достаёт координаты из строки запроса; если они некорректны — возвращает null */
export function parseCoords(search: URLSearchParams): Coords | null {
  const lat = search.get('lat');
  const lng = search.get('lng');
  if (lat === null || lng === null || lat === '' || lng === '') return null;
  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null;
  return { lat: latNum, lng: lngNum };
}
