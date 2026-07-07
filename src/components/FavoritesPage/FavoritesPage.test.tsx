import { render, screen, within } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { MemoryRouter } from 'react-router-dom';

import { FavoritesPage } from './FavoritesPage';

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

const mockFrance: Country = {
  cca3: 'FRA',
  name: {
    common: 'France',
    official: 'French Republic',
  },
  flags: {
    svg: '/france.svg',
    alt: 'France flag',
  },
  capital: ['Paris'],
  region: 'Europe',
  population: 68000000,
};

const renderFavoritesPage = () => {
  return render(
    <MemoryRouter initialEntries={['/favorites']}>
      <FavoritesProvider>
        <FavoritesPage />
      </FavoritesProvider>
    </MemoryRouter>
  );
};

describe('FavoritesPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('при отсутствии стран выводит сообщение об empty state', () => {
    renderFavoritesPage();

    expect(
      screen.getByText('Добавьте в избранные интересующие Вас страны!')
    ).toBeInTheDocument();

    const link = screen.getByRole('link', {
      name: 'Перейти на главную',
    });

    expect(link).toHaveAttribute('href', '/');
  });

  it('отображает страны из избранного вместо empty state', () => {
    localStorage.setItem('favorites', JSON.stringify([mockGermany]));

    renderFavoritesPage();

    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();

    expect(
      screen.queryByText('Добавьте в избранные интересующие Вас страны!')
    ).not.toBeInTheDocument();
  });

  it('удаляет страну и показывает empty state после клика', async () => {
    localStorage.setItem('favorites', JSON.stringify([mockGermany]));

    const user = userEvent.setup();

    renderFavoritesPage();

    const deleteBtn = screen.getByRole('button', {
      name: 'Удалить из избранного',
    });

    await user.click(deleteBtn);

    expect(
      screen.queryByText('Federal Republic of Germany')
    ).not.toBeInTheDocument();

    expect(
      screen.getByText('Добавьте в избранные интересующие Вас страны!')
    ).toBeInTheDocument();
  });

  it('при удалении одной страны, вторая остается на месте, а empty state не выводится', async () => {
    localStorage.setItem(
      'favorites',
      JSON.stringify([mockGermany, mockFrance])
    );

    const user = userEvent.setup();

    renderFavoritesPage();

    const germanyName = screen.getByText('Federal Republic of Germany');

    const germanyItem = germanyName.closest('li');

    if (!(germanyItem instanceof HTMLElement)) {
      throw new Error('Germany list item not found');
    }

    const deleteGermanyButton = within(germanyItem).getByRole('button', {
      name: 'Удалить из избранного',
    });

    await user.click(deleteGermanyButton);

    expect(
      screen.queryByText('Federal Republic of Germany')
    ).not.toBeInTheDocument();
    expect(screen.getByText('French Republic')).toBeInTheDocument();

    expect(
      screen.queryByText('Добавьте в избранные интересующие Вас страны!')
    ).not.toBeInTheDocument();
  });

  it('сохраняет удаление страны в localStorage', async () => {
    localStorage.setItem('favorites', JSON.stringify([mockGermany]));

    const user = userEvent.setup();

    renderFavoritesPage();

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

// npm test -- src/components/FavoritesPage/FavoritesPage.test.tsx
