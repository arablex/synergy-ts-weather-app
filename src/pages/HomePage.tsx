import { Col, Container, Row } from 'react-bootstrap';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { PageHeader } from '../components/PageHeader';
import { WeatherCard } from '../components/WeatherCard';
import { cities } from '../utils/cities';

/** Главная: заголовок, поиск города и карточки погоды (3 / 2 / 1 в ряд) */
export function HomePage() {
  return (
    <Container className="py-4">
      <PageHeader title="Погода в городах России" subtitle="Текущая погода и прогноз на 7 дней">
        <AutocompleteInput />
      </PageHeader>

      <Row xs={1} md={2} lg={3} className="g-4">
        {cities.map((city) => (
          <Col key={city}>
            <WeatherCard city={city} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
