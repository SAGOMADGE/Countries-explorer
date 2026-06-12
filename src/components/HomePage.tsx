import { useEffect, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { useFetch } from '@/hooks/useFetch';
import { getAllCountries, getCountryByCode } from '@/services/countries';

// types
import { Country } from '@/types/country.types';

export const HomePage = () => {
  const [query, setQuery] = useState('');
  const debounceQuery = useDebounce(query, 400);

  const {
    data: countries,
    loading,
    error,
  } = useFetch<Country[]>((signal) => getAllCountries(signal));

  return (
    <div className="homePageWrapper">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск..."
      />

      {loading && <p className="loading">Loading...</p>}

      {error && !loading && countries && <p className="error">{error}</p>}

      {countries && countries.length > 0 && (
        <ul className="countriesList">
          {countries.map((country) => (
            <li key={country.cca3} className="countryEl">
              <p>{country.name.official}</p>

              <p>{country.capital}</p>

              <p>{country.cca3}</p>

              <p>{country.flags.svg}</p>

              <p>{country.region}</p>

              <p>{country.population}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
