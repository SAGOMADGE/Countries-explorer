// хук принимает коллбек функцию , которая принимает сигнал и внутри себя вызывает сервисные функции, которые уже берут нужные для себя параметры, типа (code) из замыкания, интересно , такого я еще не делал

import { useEffect, useState } from 'react';

export const useFetch = <T,>(fetcher: (signal?: AbortSignal) => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetcher(controller.signal);

        if (!data) throw new Error('No Data');

        setData(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [fetcher]);

  return { data, loading, error };
};
