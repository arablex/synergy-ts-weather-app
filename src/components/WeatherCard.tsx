import type { MouseEvent } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCityWeather } from '../hooks/useCityWeather';
import { formatTemperature } from '../utils/formatTemperature';
import { buildForecastPath } from '../utils/routes';
import { getWeatherDescription } from '../utils/weatherCode';
import { ErrorMessage } from './ErrorMessage';
import { Loader } from './Loader';

interface WeatherCardProps {
  /** Название города на английском — карточка сама находит координаты и погоду */
  city: string;
}

/** Карточка с текущей погодой города (2 запроса к API внутри хука useCityWeather) */
export function WeatherCard({ city }: WeatherCardProps) {
  const { data, loading, error, reload } = useCityWeather(city);
  const navigate = useNavigate();
  const href = data ? buildForecastPath(city, data.coords) : '#';

  return (
    <Card className="weather-card h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h2" className="weather-card__city">
          {city}
        </Card.Title>

        {loading && <Loader small label="Загружаем погоду…" />}
        {error && <ErrorMessage message={error} onRetry={reload} />}

        {data && (
          <>
            <div className="weather-card__temp">{formatTemperature(data.current.temperature)}</div>
            <Card.Text className="weather-card__desc">
              {getWeatherDescription(data.current.weathercode)}
            </Card.Text>
            <Card.Text className="text-muted">
              Ветер: {data.current.windspeed} м/с
            </Card.Text>
            {/* Настоящая ссылка (href) — работает «открыть в новой вкладке»; обычный клик идёт через роутер без перезагрузки */}
            <Button
              href={href}
              onClick={(ev: MouseEvent<HTMLElement>) => {
                if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
                ev.preventDefault();
                navigate(href);
              }}
              variant="primary"
              className="mt-auto align-self-start"
            >
              Смотреть прогноз
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
