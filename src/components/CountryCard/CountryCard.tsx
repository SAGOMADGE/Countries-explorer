import style from './CountryCard.module.css';

import { Link } from 'react-router-dom';

import { Country } from '@/types/country.types';
import { ToggleButton } from '../ToggleButton/ToggleButton';

interface CountryCardProps {
  country: Country;
  isFavorite: boolean;
}

export const CountryCard = ({ country, isFavorite }: CountryCardProps) => {
  return (
    <li className={style.countryEl}>
      <Link to={`/country/${country.cca3}`}>
        <p>{country.name.official}</p>

        <p>Столица: {country.capital.join(', ')}</p>

        <p>Код страны: {country.cca3}</p>

        <img
          src={country.flags.svg}
          alt={country.flags.alt}
          className={style.flag}
        />

        <p>Регион: {country.region}</p>

        <p>Население {country.population.toLocaleString('ru-RU')} человек</p>
      </Link>

      <ToggleButton isFavorite={isFavorite} country={country} />
    </li>
  );
};
