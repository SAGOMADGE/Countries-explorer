import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { getCountryByCode } from '@/services/countries';
import { CountryDetails } from '@/types/countryDetails.types';
import { useFetch } from '@/hooks/useFetch';
import { useCallback } from 'react';

export const DetailsPage = () => {
  const { cca3 } = useParams();

  if (!cca3) throw new Error('cca3 is missing');

  const fetcher = useCallback(
    (signal?: AbortSignal) => getCountryByCode(cca3, signal),
    [cca3]
  );

  const { data: country, loading, error } = useFetch<CountryDetails>(fetcher);

  if (loading) return <p>Loading...</p>;

  if (!country) return null;

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="countryPage">
      <h1>{country.name.official}</h1>

      <p>Столица: {country.capital.join(', ')}</p>

      <p>Население: {country.population}</p>

      <p>Регион: {country.region}</p>

      <img src={country.flags.svg} alt={country.flags.alt} />

      {Object.values(country.languages).map((language) => (
        <p key={language}>Язык: {language}</p>
      ))}

      <strong>
        Currencies:
        {Object.values(country.currencies).map((currency) => (
          <p key={currency.name}>
            {currency.name} {currency.symbol}
          </p>
        ))}
      </strong>

      <ul style={{ display: 'flex', gap: '8px', listStyle: 'none' }}>
        {country.borders.map((c) => (
          <NavLink
            to={`/country/${c}`}
            key={c}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {c}
          </NavLink>
        ))}
      </ul>
    </div>
  );
};
