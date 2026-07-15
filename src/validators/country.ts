import type { Country } from '@/types/country.types';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const isCountry = (value: unknown): value is Country => {
  if (!isRecord(value)) {
    return false;
  }

  const { cca3, name, flags, capital, region, population } = value;

  return (
    typeof cca3 === 'string' &&
    isRecord(name) &&
    typeof name.common === 'string' &&
    typeof name.official === 'string' &&
    isRecord(flags) &&
    typeof flags.svg === 'string' &&
    typeof flags.alt === 'string' &&
    Array.isArray(capital) &&
    capital.every((item) => typeof item === 'string') &&
    typeof region === 'string' &&
    typeof population === 'number'
  );
};

export const isCountryArray = (value: unknown): value is Country[] => {
  return Array.isArray(value) && value.every(isCountry);
};
