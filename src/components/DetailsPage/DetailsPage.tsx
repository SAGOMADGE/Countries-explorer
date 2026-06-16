import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import style from './DetailsPage.module.css';

import { getCountryByCode } from '@/services/countries';
import { CountryDetails } from '@/types/countryDetails.types';
import { useFetch } from '@/hooks/useFetch';
import { useCallback } from 'react';
import { useFavoritesContext } from '@/context/FavoritesContext';

export const DetailsPage = () => {
  const { cca3 } = useParams();

  const { favorites, dispatch } = useFavoritesContext();

  const fetcher = useCallback(
    (signal?: AbortSignal) => {
      if (!cca3) throw new Error('cca3 is missing');
      return getCountryByCode(cca3, signal);
    },
    [cca3]
  );

  const { data: country, loading, error } = useFetch<CountryDetails>(fetcher);

  if (loading) return <p>Loading...</p>;

  if (!country) return null;

  if (error) return <p className="error">{error}</p>;

  const isFavorite = favorites.some((fav) => fav.cca3 === country.cca3);

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

      <section>
        Currencies:
        {Object.values(country.currencies).map((currency) => (
          <p key={currency.name}>
            {currency.name} {currency.symbol}
          </p>
        ))}
      </section>

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

      <button
        onClick={() =>
          isFavorite
            ? dispatch({ type: 'REMOVE', payload: country.cca3 })
            : dispatch({ type: 'ADD', payload: country })
        }
      >
        {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      </button>
    </div>
  );
};
