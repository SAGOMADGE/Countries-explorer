import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { FavoritesProvider } from './context/FavoritesContext';
import { router } from './router/router';

import { RouterProvider } from 'react-router-dom';

const root = document.getElementById('root');

if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>
  </StrictMode>
);
