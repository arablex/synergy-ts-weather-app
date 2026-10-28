import { Table } from 'react-bootstrap';
import type { ForecastRow } from '../types/weather';
import { formatDate } from '../utils/formatDate';
import { formatTemperature } from '../utils/formatTemperature';
import { getWeatherDescription } from '../utils/weatherCode';

interface ForecastTableProps {
  rows: ForecastRow[];
}

/** Таблица прогноза на 7 дней: дата, мин., макс., погода */
export function ForecastTable({ rows }: ForecastTableProps) {
  return (
    <Table striped hover responsive className="forecast-table align-middle">
      <thead>
        <tr>
          <th>Дата</th>
          {/* На узких экранах заголовки короче, чтобы таблица помещалась без прокрутки */}
          <th>
            <span className="d-none d-sm-inline">Мин. температура</span>
            <span className="d-sm-none">Мин.</span>
          </th>
          <th>
            <span className="d-none d-sm-inline">Макс. температура</span>
            <span className="d-sm-none">Макс.</span>
          </th>
          <th>Погода</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.date}>
            <td>{formatDate(row.date)}</td>
            <td>{formatTemperature(row.min)}</td>
            <td>{formatTemperature(row.max)}</td>
            <td>{getWeatherDescription(row.weatherCode)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
