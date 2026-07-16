import { useFetch } from '@/hooks/useFetch';

import type { Country } from '@/types/country.types';
import type { Region } from '@/types/region';

import { getAllCountries } from '@/services/countries';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useFavoritesContext } from '@/context/FavoritesContext';

import style from './HomePage.module.css';
import { normalize } from '@/utils/normalize';
import { CountryCard } from '../CountryCard/CountryCard';

export const HomePage = () => {
  const {
    data: countries,
    loading,
    error,
  } = useFetch<Country[]>(getAllCountries);

  const [query, setQuery] = useState('');

  const debounceQuery = useDebounce(query, 400);

  const [selectedRegion, setSelectedRegion] = useState<Region>('All');

  const { favorites } = useFavoritesContext();

  if (loading) return <p className={style.loading}>Loading...</p>;

  if (error) return <p className={style.error}>{error}</p>;

  if (!countries) return null;

  const filteredCountries = countries.filter((country) => {
    const isMatchingSearch =
      normalize(country.name.common).includes(normalize(debounceQuery)) ||
      normalize(country.name.official).includes(normalize(debounceQuery));

    const isMatchingCategory =
      selectedRegion === 'All' || country.region === selectedRegion;

    return isMatchingSearch && isMatchingCategory;
  });

  return (
    <div className={style.homePageWrapper}>
      <div className={style.inputsArea}>
        <input
          className={style.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск.."
        />

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value as Region)}
        >
          <option value="All">All</option>

          <option value="Africa">Africa</option>

          <option value="Americas">Americas</option>

          <option value="Asia">Asia</option>

          <option value="Europe">Europe</option>

          <option value="Oceania">Oceania</option>
        </select>
      </div>

      {filteredCountries.length === 0 ? (
        <p className={style.noResult}>Страна не найдена!</p>
      ) : (
        <ul className={style.countriesList}>
          {filteredCountries.map((country) => {
            const isFavorite = favorites.some(
              (fav) => fav.cca3 === country.cca3
            );

            return (
              <CountryCard
                key={country.cca3}
                country={country}
                isFavorite={isFavorite}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};
