import { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { ForecastTable } from '../components/ForecastTable';
import { Loader } from '../components/Loader';
import { PageHeader } from '../components/PageHeader';
import { useForecast } from '../hooks/useForecast';
import { parseCoords } from '../utils/routes';

/** Страница прогноза: /weather/:city?lat=..&lng=.. */
export function ForecastPage() {
  const { city = '' } = useParams<{ city: string }>();
  const [searchParams] = useSearchParams();
  const coords = useMemo(() => parseCoords(searchParams), [searchParams]);
  const { data, loading, error, reload } = useForecast(coords);

  return (
    <Container className="py-4">
      <Link to="/" className="back-link">
        ← Назад
      </Link>

      <PageHeader title={`Прогноз погоды: ${city}`} subtitle="Ближайшие 7 дней" />

      {loading && <Loader label="Загружаем прогноз…" />}
      {error && <ErrorMessage message={error} onRetry={coords ? reload : undefined} />}
      {data && <ForecastTable rows={data} />}
    </Container>
  );
}
