import { Spinner } from 'react-bootstrap';

interface LoaderProps {
  /** Подпись для скринридеров и под спиннером */
  label?: string;
  /** Маленький вариант — внутри карточки */
  small?: boolean;
}

/** Прелоадер на основе Spinner из React Bootstrap */
export function Loader({ label = 'Загрузка…', small = false }: LoaderProps) {
  return (
    <div className={small ? 'loader loader--small' : 'loader'} role="status">
      <Spinner animation="border" variant="primary" size={small ? 'sm' : undefined} />
      <span className="loader__label">{label}</span>
    </div>
  );
}
