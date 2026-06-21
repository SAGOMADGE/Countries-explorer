import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { CountryCard } from './CountryCard';
import { Country } from '@/types/country.types';

const mockCountry: Country = {
  cca3: 'DEU',
  name: { common: 'Germany', official: 'Federal Republic of Germany' },
  flags: { svg: '', alt: '' },
  capital: ['Berlin'],
  region: 'Europe',
  population: 83000000,
};

// переменная renderWithProviders принимает ui - реакт элементы типа { key, children, types }, возвращает рендер функцию которая принимает обертку мемори роутер в обертке контекста в котором находится ui.. хмм
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <FavoritesProvider>{ui}</FavoritesProvider>
    </MemoryRouter>
  );
};

describe('CountryCard', () => {
  it('отображает значение страны', () => {
    renderWithProviders(
      <CountryCard country={mockCountry} isFavorite={false} />
    );

    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();
    // toBeInTheDocument - это матчер из jest-dom, проверяет что элемент есть в DOM
  });

  it('отображает столицу', () => {
    renderWithProviders(
      <CountryCard country={mockCountry} isFavorite={false} />
    );

    expect(screen.getByText(/Berlin/)).toBeInTheDocument();
    // /Berlin/ - регулярное выражение, ищет подстроку внутри текста
    // нужно потому что текст в компонент 'Столица: Berlin', а не просто 'Berlin'
  });

  it('отображает кнопку добавления в избранное', () => {
    renderWithProviders(
      <CountryCard country={mockCountry} isFavorite={false} />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('кнопка показывает правильный текст когда isFavorite = true', () => {
    renderWithProviders(
      <CountryCard country={mockCountry} isFavorite={true} />
    );

    expect(screen.getByText('Удалить из избранного')).toBeInTheDocument();
  });
});
