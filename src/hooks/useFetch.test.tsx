import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useFetch } from './useFetch';

import type { Country } from '@/types/country.types';

const mockCountries: Country[] = [
  {
    cca3: 'FRA',
    name: {
      common: 'France',
      official: 'French Republic',
    },
    flags: {
      svg: 'https://flagcdn.com/fr.svg',
      alt: 'Flag of France',
    },
    capital: ['Paris'],
    region: 'Europe',
    population: 68_000_000,
  },
];

describe('useFetch', () => {
  it('возвращает начальное состояние до завершения запроса', () => {
    const fetcher = vi.fn(
      (_signal?: AbortSignal) => new Promise<string>(() => {})
    );

    const { result } = renderHook(() => useFetch(fetcher));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('сохраняет данные после успешного запроса', async () => {
    const fetcher = vi.fn((_signal?: AbortSignal) =>
      Promise.resolve(mockCountries)
    );

    const { result } = renderHook(() => useFetch(fetcher));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockCountries);
      expect(result.current.error).toBeNull();
    });
  });

  it('сохраняет сообщение ошибки при неудачном запросе', async () => {
    const fetcher = vi.fn((_signal?: AbortSignal) =>
      Promise.reject(new Error('Server Error'))
    );

    const { result } = renderHook(() => useFetch(fetcher));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('Server Error');
    });
  });

  it('возвращает Unknown error при неизвестном типе ошибки', async () => {
    const fetcher = vi.fn((_signal?: AbortSignal) =>
      Promise.reject('Something went wrong')
    );

    const { result } = renderHook(() => useFetch(fetcher));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('Unknown error');
    });
  });

  it('возвращает No data, если fetcher не вернул данные', async () => {
    const fetcher = vi.fn((_signal?: AbortSignal) => Promise.resolve(null));

    const { result } = renderHook(() => useFetch<string | null>(fetcher));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('No data');
    });
  });

  it('передает AbortSignal в fetcher', () => {
    const fetcher = vi.fn(
      (_signal?: AbortSignal) => new Promise<string>(() => {})
    );

    renderHook(() => useFetch(fetcher));

    expect(fetcher).toHaveBeenCalledTimes(1);

    const signal = fetcher.mock.calls[0][0];

    expect(signal).toBeInstanceOf(AbortSignal);

    if (!signal) {
      throw new Error('AbortSignal не был передан в fetcher');
    }

    expect(signal.aborted).toBe(false);
  });

  it('отменяет запрос при размонтировании', () => {
    const fetcher = vi.fn(
      (_signal?: AbortSignal) => new Promise<string>(() => {})
    );

    const { unmount } = renderHook(() => useFetch(fetcher));

    const signal = fetcher.mock.calls[0][0];

    if (!signal) {
      throw new Error('AbortSignal не был передан в fetcher');
    }

    expect(signal.aborted).toBe(false);

    unmount();

    expect(signal.aborted).toBe(true);
  });
});
