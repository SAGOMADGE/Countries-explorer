export const request = async <T>(
  url: string,
  signal?: AbortSignal
): Promise<T> => {
  const res = await fetch(url, { signal });

  if (!res.ok) throw new Error(`Bad response status: ${res.status}`);

  return res.json();
};

// request получает url и сигнал от слоя маршрутизации, при вызове получает Generic поэтому TS точно знает что эта функция вернет Promise<T>; это помогает с подсказками IDE
