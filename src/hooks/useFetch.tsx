import { useEffect, useState } from 'react';

export const useFetch = <T,>(fetcher: (signal?: AbortSignal) => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetcher(controller.signal);

        if (data === null || data === undefined) {
          throw new Error('No data');
        }

        setData(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [fetcher]);

  return { data, loading, error };
};
