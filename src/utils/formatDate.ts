/**
 * Форматирует дату из API ("2026-06-15") в вид "15/06".
 * Разбираем строку вручную, без new Date(), чтобы не зависеть от часового пояса.
 */
export function formatDate(isoDate: string): string {
  const [, month, day] = isoDate.split('-');
  return `${day}/${month}`;
}
