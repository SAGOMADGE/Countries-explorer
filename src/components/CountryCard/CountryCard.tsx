import style from './CountryCard.module.css';

import { Link } from 'react-router-dom';

import { Country } from '@/types/country.types';
import { useFavoritesContext } from '@/context/FavoritesContext';

interface CountryCardProps {
  country: Country;
  isFavorite: boolean;
}

export const CountryCard = ({ country, isFavorite }: CountryCardProps) => {
  const { dispatch } = useFavoritesContext();

  return (
    <li className={style.countryEl}>
      <Link to={`/country/${country.cca3}`}>
        <p>{country.name.official}</p>

        <p>Столица: {country.capital.join(', ')}</p>

        <p>Код страны: {country.cca3}</p>

        <img src={country.flags.svg} alt={country.flags.alt} />

        <p>Регион: {country.region}</p>

        <p>Население {country.population} человек</p>
      </Link>

      <button
        onClick={() =>
          isFavorite
            ? dispatch({ type: 'REMOVE', payload: country.cca3 })
            : dispatch({ type: 'ADD', payload: country })
        }
      >
        {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      </button>
    </li>
  );
};
