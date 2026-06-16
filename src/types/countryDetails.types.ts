import { Country } from './country.types';

export interface CountryDetails extends Country {
  timezones: string[];
  borders: string[];
  languages: Record<string, string>;
  currencies: Record<string, { name: string; symbol: string }>;
}
