export const request = async <T>(
  url: string,
  signal?: AbortSignal
): Promise<T> => {
  const res = await fetch(url, { signal });

  if (!res.ok) throw new Error(`Bad respnose status: ${res.status}`);

  return res.json();
};
