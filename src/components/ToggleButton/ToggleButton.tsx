import { useFavoritesContext } from '@/context/FavoritesContext';
import style from './ToggleButton.module.css';

import { Country } from '@/types/country.types';

interface ToggleButtonProps {
  isFavorite: boolean;
  country: Country;
}

export const ToggleButton = ({ isFavorite, country }: ToggleButtonProps) => {
  const { dispatch } = useFavoritesContext();

  return (
    <button
      className={style.toggleBtn}
      onClick={() =>
        isFavorite
          ? dispatch({ type: 'REMOVE', payload: country.cca3 })
          : dispatch({ type: 'ADD', payload: country })
      }
    >
      {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    </button>
  );
};
