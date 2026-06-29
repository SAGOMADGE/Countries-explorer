import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('возвращает начальное значение сразу', () => {
    const { result } = renderHook(() => useDebounce('germany', 400));

    expect(result.current).toBe('germany');
  });

  it('не обновляет значение до истечения delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: 'germany' } }
    );

    rerender({ value: 'france' });

    vi.advanceTimersByTime(300);

    expect(result.current).toBe('germany');
  });

  it('обновляет значение после истечения delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: 'germany' } }
    );

    rerender({ value: 'france' });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe('france');
  });
});
