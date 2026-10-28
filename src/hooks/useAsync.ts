import { useCallback, useEffect, useState } from 'react';
import type { AsyncState } from '../types/weather';

/** Результат хука: состояние загрузки + функция повторной загрузки */
export interface UseAsyncResult<T> extends AsyncState<T> {
  reload: () => void;
}

/**
 * Универсальный хук для асинхронной загрузки: хранит data / loading / error.
 * Если зависимости изменились или компонент размонтирован, результат устаревшего
 * запроса игнорируется (флаг ignore) — нет "гонок" и предупреждений в консоли.
 */
export function useAsync<T>(fetcher: () => Promise<T>, deps: ReadonlyArray<unknown>): UseAsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    setState({ data: null, loading: true, error: null });

    fetcher()
      .then((data) => {
        if (!ignore) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setState({ data: null, loading: false, error: message });
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, reload };
}
