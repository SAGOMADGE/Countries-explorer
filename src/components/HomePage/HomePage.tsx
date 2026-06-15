import { useFetch } from '@/hooks/useFetch';

import { Country } from '@/types/country.types';

import { getAllCountries } from '@/services/countries';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useFavoritesContext } from '@/context/FavoritesContext';

import style from './HomePage.module.css';
import { normalize } from '@/utils/normalize';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const {
    data: countries,
    loading,
    error,
  } = useFetch<Country[]>((signal) => getAllCountries(signal));

  const [query, setQuery] = useState('');

  const debounceQuery = useDebounce(query, 400);

  const { favorites, dispatch } = useFavoritesContext();

  if (loading) return <p className={style.loading}>Loading...</p>;

  if (error) return <p className={style.error}>{error}</p>;

  if (!countries) return null;

  // при пустом инпуте рендерятся все страны, так как "" не занимает место, это пустота,пустая подстрока содержится в каждой строке
  const filteredCountries = [...countries].filter((country) => {
    const isMatchingSearch =
      normalize(country.name.common).includes(normalize(debounceQuery)) ||
      normalize(country.name.official).includes(debounceQuery);

    return isMatchingSearch;
  });

  return (
    <div className={style.homePageWrapper}>
      <input
        className={style.searchInput}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск.."
      />

      {filteredCountries && (
        <ul className={style.countriesList}>
          {filteredCountries.map((country) => {
            const isFavorite = favorites.some(
              (fav) => fav.cca3 === country.cca3
            );

            return (
              <li key={country.cca3} className={style.countryEl}>
                <Link to={`/country/${country.cca3}`}>
                  <p>{country.name.official}</p>

                  <p>{country.capital.join(', ')}</p>

                  <p>{country.cca3}</p>

                  <img src={country.flags.svg} alt={country.flags.alt} />

                  <p>{country.region}</p>

                  <p>{country.population}</p>
                </Link>

                <button
                  onClick={() =>
                    isFavorite
                      ? dispatch({ type: 'REMOVE', payload: country.cca3 })
                      : dispatch({ type: 'ADD', payload: country })
                  }
                >
                  {isFavorite
                    ? 'Удалить из избранного'
                    : 'Добавить в избранное'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
