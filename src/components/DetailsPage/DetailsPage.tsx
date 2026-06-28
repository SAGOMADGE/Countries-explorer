import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import style from './DetailsPage.module.css';

import { getCountryByCode } from '@/services/countries';
import { availableCountryCode } from '@/services/countries';
import { CountryDetails } from '@/types/countryDetails.types';
import { useFetch } from '@/hooks/useFetch';
import { useCallback } from 'react';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { ToggleButton } from '../toggleButton/ToggleButton';

export const DetailsPage = () => {
  const { cca3 } = useParams();

  const { favorites } = useFavoritesContext();

  const fetcher = useCallback(
    (signal?: AbortSignal) => {
      if (!cca3) throw new Error('cca3 is missing');
      return getCountryByCode(cca3, signal);
    },
    [cca3]
  );

  const { data: country, loading, error } = useFetch<CountryDetails>(fetcher);

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="error">{error}</p>;

  if (!country) return null;

  const isFavorite = favorites.some((fav) => fav.cca3 === country.cca3);

  return (
    <div className={style.countryPage}>
      <h1>{country.name.official}</h1>

      <p>Столица: {country.capital.join(', ')}</p>

      <p>Население: {country.population.toLocaleString('ru-RU')} человек</p>

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

      <ul className={style.DetailsList}>
        <span>Границы: </span>
        {country.borders.map((c) =>
          availableCountryCode.has(c) ? (
            <NavLink to={`/country/${c}`} key={c} className={style.bordersLink}>
              {c}
            </NavLink>
          ) : (
            <span key={c} className={style.borderDisabled}>
              {c}
            </span>
          )
        )}
      </ul>

      <ToggleButton isFavorite={isFavorite} country={country} />
    </div>
  );
};
