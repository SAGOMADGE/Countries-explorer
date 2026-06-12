import { Outlet } from 'react-router-dom';

import { NavBar } from './NavBar/NavBar';

import { Footer } from './Footer/Footer';

export const Layout = () => {
  return (
    <div className="layout">
      <NavBar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
