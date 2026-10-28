/** Температура со знаком и единицами: 7.7 -> "+8°C", -3.2 -> "-3°C", 0 -> "0°C" */
export function formatTemperature(value: number): string {
  const rounded = Math.round(value);
  if (rounded > 0) return `+${rounded}°C`;
  return `${rounded === 0 ? 0 : rounded}°C`;
}
