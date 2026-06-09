export interface CountryDetail {
  cca3: string;
  name: { common: string; official: string };
  flags: { svg: string; alt: string };
  capital: string[];
  region: string;
  timezones: string[];
  borders: string[];
  languages: Record<string, string>; // ключ string - тут динамичен, поэтому Record
  currencies: Record<string, { name: string; symbol: string }>; // тоже самое и тут, только значение ключа не строка а объект
}
