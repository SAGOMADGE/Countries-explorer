import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '@/components/Layout';

import { NotFoundPage } from '@/components/NotFoundPage';

import { HomePage } from '@/components/HomePage';

import { FavoritesPage } from '@/components/FavoritesPage';

import { CountryPage } from '@/components/CountryPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: 'country/:cca3',
        element: <CountryPage />,
      },
    ],
  },
]);
