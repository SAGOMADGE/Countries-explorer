import { useFavoritesContext } from '@/context/FavoritesContext';

import { Link, NavLink } from 'react-router-dom';

import style from './FavoritesPage.module.css';

export const FavoritesPage = () => {
  const { favorites, dispatch } = useFavoritesContext();

  const emptyState = favorites.length === 0;

  return (
    <div className={style.favoritesPageWrapper}>
      {emptyState && (
        <div className={style.emptyState}>
          <p>Добавьте в избранные интересующие Вас страны!</p>

          <NavLink to={`/`}>Перейти на главную</NavLink>
        </div>
      )}

      <ul className={style.favoritesList}>
        {favorites.map((fav) => (
          <li key={fav.cca3} className={style.favoriteCountryEl}>
            <Link to={`/country/${fav.cca3}`}>
              <p>{fav.name.official}</p>

              <p>{fav.capital.join(', ')}</p>

              <p>{fav.cca3}</p>

              <img src={fav.flags.svg} alt={fav.flags.alt} />

              <p>{fav.region}</p>

              <p>{fav.population}</p>
            </Link>

            <button
              onClick={() => dispatch({ type: 'REMOVE', payload: fav.cca3 })}
            >
              Удалить из избранного
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
