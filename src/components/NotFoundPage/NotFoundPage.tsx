import { NavLink } from 'react-router-dom';
import style from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <div className={style.notFoundPage}>
      <p className={style.text}>УПС! Страница не найдена!</p>

      <span className={style.goHomeText}>
        Но ты можешь <NavLink to="/">вернуться домой</NavLink>
      </span>
    </div>
  );
};
