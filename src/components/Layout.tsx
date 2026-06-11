import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { NavBar } from './NavBar/NavBar';

export const Layout = () => {
  return (
    <div className="layout">
      <NavBar />

      <main>
        <Outlet />
      </main>

      <footer>
        <p>Copyright @ 2026 SAGOMADGE</p>
      </footer>
    </div>
  );
};
