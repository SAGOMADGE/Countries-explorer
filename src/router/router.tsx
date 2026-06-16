import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '@/components/Layout';

import { NotFoundPage } from '@/components/NotFoundPage';

import { HomePage } from '@/components/HomePage/HomePage';

import { FavoritesPage } from '@/components/FavoritesPage/FavoritesPage';

import { DetailsPage } from '@/components/DetailsPage/DetailsPage';

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
        element: <DetailsPage />,
      },
    ],
  },
]);
