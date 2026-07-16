import { useFavoritesContext } from '@/context/FavoritesContext';

import { Link } from 'react-router-dom';

import style from './FavoritesPage.module.css';

export const FavoritesPage = () => {
  const { favorites, dispatch } = useFavoritesContext();

  const emptyState = favorites.length === 0;

  return (
    <div className={style.favoritesPageWrapper}>
      {emptyState ? (
        <div className={style.emptyState}>
          <p className={style.info}>
            Добавьте в избранное интересующие вас страны!
          </p>

          <Link className={style.link} to={'/'}>
            Перейти на главную
          </Link>
        </div>
      ) : (
        <ul className={style.favoritesList}>
          {favorites.map((fav) => (
            <li key={fav.cca3} className={style.favoriteCountryEl}>
              <Link to={`/country/${fav.cca3}`}>
                <p>{fav.name.official}</p>

                <p>Столица: {fav.capital.join(', ')}</p>

                <p>Код страны: {fav.cca3}</p>

                <img src={fav.flags.svg} alt={fav.flags.alt} />

                <p>Регион: {fav.region}</p>

                <p>
                  Население: {fav.population.toLocaleString('ru-RU')} человек
                </p>
              </Link>

              <button
                type="button"
                onClick={() => dispatch({ type: 'REMOVE', payload: fav.cca3 })}
              >
                Удалить из избранного
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
