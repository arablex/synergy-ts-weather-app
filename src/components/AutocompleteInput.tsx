import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { searchCities } from '../api/openMeteo';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type { GeoResult } from '../types/weather';
import { buildForecastPath } from '../utils/routes';

/** Поле поиска города с автодополнением (geocoding-api open-meteo) */
export function AutocompleteInput() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const query = useDebouncedValue(value.trim(), 300);

  // Запрос вариантов при изменении (с задержкой) текста
  useEffect(() => {
    if (query.length < 2) {
      setOptions([]);
      setSearching(false);
      return;
    }
    let ignore = false; // результат устаревшего запроса не применяем
    setSearching(true);
    searchCities(query, 6)
      .then((results) => {
        if (ignore) return;
        setOptions(results);
        setActive(-1);
        setSearching(false);
      })
      .catch(() => {
        if (ignore) return;
        setOptions([]);
        setSearching(false);
      });
    return () => {
      ignore = true;
    };
  }, [query]);

  // Закрываем список кликом вне компонента
  useEffect(() => {
    const onDocumentClick = (ev: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(ev.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, []);

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setValue(ev.target.value);
    setOpen(true);
  };

  // Выбор варианта: полное название в input, скрыть список, перейти на страницу прогноза
  const handleSelect = (option: GeoResult) => {
    setValue(option.name);
    setOpen(false);
    setOptions([]);
    navigate(buildForecastPath(option.name, { lat: option.latitude, lng: option.longitude }));
  };

  const handleKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (!open || options.length === 0) return;
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      setActive((i) => (i + 1) % options.length);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      setActive((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      handleSelect(options[active >= 0 ? active : 0]);
    } else if (ev.key === 'Escape') {
      setOpen(false);
    }
  };

  const showList = open && query.length >= 2 && options.length > 0;
  const showEmpty = open && query.length >= 2 && !searching && options.length === 0 && value.trim() === query;

  return (
    <div className="autocomplete" ref={wrapperRef}>
      <Form.Control
        type="text"
        size="lg"
        placeholder="Найти другой город…"
        aria-label="Поиск города"
        autoComplete="off"
        value={value}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {showList && (
        <ListGroup className="autocomplete__list shadow">
          {options.map((option, index) => (
            <ListGroup.Item
              key={option.id}
              action
              active={index === active}
              onClick={() => handleSelect(option)}
            >
              <span className="autocomplete__name">{option.name}</span>
              <small className="autocomplete__meta">
                {[option.admin1, option.country].filter(Boolean).join(', ')}
              </small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      {showEmpty && (
        <ListGroup className="autocomplete__list shadow">
          <ListGroup.Item disabled>Ничего не найдено</ListGroup.Item>
        </ListGroup>
      )}
    </div>
  );
}
