import { Country } from '@/types/country.types';
import React from 'react';

import { render } from '@testing-library/react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { FavoritesPage } from './FavoritesPage';

const mockCountry: Country = {
  cca3: 'DEU',
  capital: ['Berlin'],
  flags: { svg: '', alt: '' },
  region: 'Europe',
  name: { common: 'Germany', official: 'Federal Republic of Germany' },
  population: 83000000,
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <FavoritesProvider>{ui}</FavoritesProvider>
    </MemoryRouter>
  );
};

describe('FavoritesPage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('показывает emptyState', () => {
    renderWithRouter(<FavoritesPage />);

    expect(
      screen.getByText('Добавьте в избранные интересующие Вас страны!')
    ).toBeInTheDocument();
  });

  it('рендерит список', () => {
    localStorage.setItem('favorites', JSON.stringify([mockCountry]));

    renderWithRouter(<FavoritesPage />);

    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();
  });
});

// а где мне тут внедрять local storage ? когда его прописывать и читать ?
