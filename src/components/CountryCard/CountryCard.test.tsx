import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { FavoritesProvider } from '@/context/FavoritesContext';
import { Country } from '@/types/country.types';

import { CountryCard } from './CountryCard';

const mockCountry: Country = {
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

const renderCountryCard = (isFavorite = false) => {
  render(
    <MemoryRouter initialEntries={['/country']}>
      <FavoritesProvider>
        <CountryCard country={mockCountry} isFavorite={isFavorite} />
      </FavoritesProvider>
    </MemoryRouter>
  );
};

describe('CountryCard', () => {
  it('отображает основную информацию о стране', () => {
    renderCountryCard();

    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();

    expect(screen.getByText('Столица: Berlin')).toBeInTheDocument();

    expect(screen.getByText('Код страны: DEU')).toBeInTheDocument();

    expect(screen.getByText('Регион: Europe')).toBeInTheDocument();

    expect(
      screen.getByText('Население 83 000 000 человек')
    ).toBeInTheDocument();
  });

  it('отображает флаг страны', () => {
    renderCountryCard();

    const countryFlag = screen.getByRole('img', {
      name: 'Germany flag',
    });

    expect(countryFlag).toBeInTheDocument();

    expect(countryFlag).toHaveAttribute('src', '/germany.svg');
  });

  // Link
  it('ссылка ведёт на страницу страны', () => {
    renderCountryCard();

    const countryLink = screen.getByRole('link', {
      name: /Federal Republic of Germany/i,
    });

    expect(countryLink).toHaveAttribute('href', '/country/DEU');
  });

  it('показывает кнопку добавления, если страна не в избранном', () => {
    renderCountryCard();

    expect(
      screen.getByRole('button', {
        name: /добавить в избранное/i,
      })
    ).toBeInTheDocument();
  });

  it('показывает кнопку удаления, если страна находится в избранном', () => {
    renderCountryCard(true);

    expect(
      screen.getByRole('button', {
        name: /удалить из избранного/i,
      })
    ).toBeInTheDocument();
  });
});
