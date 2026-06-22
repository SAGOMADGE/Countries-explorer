import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // заменяем реальные таймеры на фейковые
  });

  afterEach(() => {
    vi.useRealTimers(); // восстанавливаем реальные таймеры после каждого теста
  });

  it('возвращает начальное значение сразу', () => {
    const { result } = renderHook(() => useDebounce('germany', 400));
    // result.current - текущее возвращаемое значение хука
    expect(result.current).toBe('germany');
  });

  it('не обновляет значение до истечения delay', () => {
    const { result, rerender } = renderHook(
      /*тестовый компонент -> */ ({ value }) => useDebounce(value, 400),
      /* начальное значение value -> */ { initialProps: { value: 'germany' } }
    );

    rerender({ value: 'france' }); // меняем входное значение

    vi.advanceTimersByTime(300); // перематываем 300мс - таймер еще не сработал

    expect(result.current).toBe('germany'); // старое значение
  });

  it('обновляет значение после истечения delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: 'germany' } }
    );

    rerender({ value: 'france' });

    act(() => {
      vi.advanceTimersByTime(400); // таймер сработал
    });

    expect(result.current).toBe('france');
  });
});
