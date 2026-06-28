import { Outlet } from 'react-router-dom';

import { NavBar } from '../NavBar/NavBar';

import { Footer } from '../Footer/Footer';

import styles from './Layout.module.css';

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <NavBar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
