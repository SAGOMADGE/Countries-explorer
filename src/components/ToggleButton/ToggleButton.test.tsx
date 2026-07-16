import { ToggleButton } from './ToggleButton';

import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import type { Country } from '@/types/country.types';
import { FavoritesProvider } from '@/context/FavoritesContext';

const mockGermany: Country = {
  cca3: 'DEU',
  name: {
    common: 'Germany',
    official: 'Federal Republic of Germany',
  },
  flags: {
    svg: '/germany.svg',
    alt: 'Germany flag',
  },
  capital: ['Berlin'],
  region: 'Europe',
  population: 83000000,
};

const renderToggleButton = (isFavorite = false) => {
  return render(
    <FavoritesProvider>
      <ToggleButton isFavorite={isFavorite} country={mockGermany} />
    </FavoritesProvider>
  );
};

describe('ToggleButton', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('добавляет страну в избранное после клика', async () => {
    const user = userEvent.setup();

    renderToggleButton();

    const addBtn = screen.getByRole('button', {
      name: 'Добавить в избранное',
    });

    await user.click(addBtn);

    const storedFavorites = JSON.parse(
      localStorage.getItem('favorites') ?? '[]'
    );

    expect(storedFavorites).toEqual([mockGermany]);
  });

  it('удаляет страну из избранного после клика', async () => {
    localStorage.setItem('favorites', JSON.stringify([mockGermany]));

    const user = userEvent.setup();

    renderToggleButton(true);

    const deleteBtn = screen.getByRole('button', {
      name: 'Удалить из избранного',
    });

    await user.click(deleteBtn);

    const storedFavorites = JSON.parse(
      localStorage.getItem('favorites') ?? '[]'
    );

    expect(storedFavorites).toEqual([]);
  });
});
