import styles from './NavBar.module.css';

import { NavLink } from 'react-router-dom';

export const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/">Главная</NavLink>

      <NavLink to="/favorites">Избранное</NavLink>
    </nav>
  );
};
