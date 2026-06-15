export interface CountryDetails {
  cca3: string; // code
  name: { common: string; official: string }; // name of the country
  population: number;
  flags: { svg: string; alt: string }; // flag in svg format
  capital: string[]; // array where string capital in it
  region: string; //europe for example
  timezones: string[]; // URC+3 for example
  borders: string[]; // codes of nearest countries
  languages: Record<string, string>; // ключ string - тут динамичен, поэтому Record
  currencies: Record<string, { name: string; symbol: string }>; // тоже самое и тут, только значение ключа не строка а объект
}
