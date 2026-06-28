import { Country } from '@/types/country.types';
import { CountryDetails } from '@/types/countryDetails.types';

import countriesData from '@/data/countries.json';

export const getAllCountries = (signal?: AbortSignal): Promise<Country[]> =>
  Promise.resolve(countriesData as Country[]);

export const availableCountryCode = new Set(countriesData.map((c) => c.cca3));

export const getCountryByCode = (
  code: string,
  signal?: AbortSignal
): Promise<CountryDetails> => {
  const country = countriesData.find((c) => c.cca3 === code);
  if (!country) return Promise.reject(new Error('Country not found'));
  return Promise.resolve(country as unknown as CountryDetails);
};
