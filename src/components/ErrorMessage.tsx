import { Alert, Button } from 'react-bootstrap';

interface ErrorMessageProps {
  message: string;
  /** Если передан — показываем кнопку «Повторить» */
  onRetry?: () => void;
}

/** Сообщение об ошибке загрузки (показываем в интерфейсе вместо падения приложения) */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Alert variant="danger" className="mb-0">
      <p className="mb-2">{message}</p>
      {onRetry && (
        <Button variant="outline-danger" size="sm" onClick={onRetry}>
          Повторить
        </Button>
      )}
    </Alert>
  );
}
