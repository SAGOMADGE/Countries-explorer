import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FavoritesProvider } from '@/context/FavoritesContext';
import { getAllCountries } from '@/services/countries';
import type { Country } from '@/types/country.types';

import { HomePage } from './HomePage';

vi.mock('@/services/countries', () => ({
  getAllCountries: vi.fn(),
}));

const mockedGetAllCountries = vi.mocked(getAllCountries);

beforeEach(() => {
  vi.resetAllMocks();
});

const renderHomePage = () => {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <FavoritesProvider>
        <HomePage />
      </FavoritesProvider>
    </MemoryRouter>
  );
};

const mockCountries: Country[] = [
  {
    cca3: 'DEU',
    name: {
      common: 'Germany',
      official: 'Federal Republic of Germany',
    },
    flags: {
      svg: 'https://flagcdn.com/de.svg',
      alt: 'Germany flag',
    },
    capital: ['Berlin'],
    region: 'Europe',
    population: 83240525,
  },
];

describe('HomePage', () => {
  it('показывает загрузку, а после успешной загрузки рендерит страны', async () => {
    mockedGetAllCountries.mockResolvedValue(mockCountries);

    renderHomePage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    expect(
      await screen.findByText('Federal Republic of Germany')
    ).toBeInTheDocument();

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    expect(mockedGetAllCountries).toHaveBeenCalled();
  });

  it('показывает сообщение об ошибке, если загрузка стран завершилась ошибкой', async () => {
    mockedGetAllCountries.mockRejectedValue(new Error('Server error'));

    renderHomePage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    expect(await screen.findByText('Server error')).toBeInTheDocument();

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Federal Republic of Germany')
    ).not.toBeInTheDocument();

    expect(mockedGetAllCountries).toHaveBeenCalled();
  });

  it('показывает сообщение, если после загрузки список стран пуст', async () => {
    mockedGetAllCountries.mockResolvedValue([]);

    renderHomePage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    expect(await screen.findByText('Страна не найдена!')).toBeInTheDocument();

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    expect(
      screen.queryByText('Federal Republic of Germany')
    ).not.toBeInTheDocument();

    expect(screen.queryByText('Server error')).not.toBeInTheDocument();

    expect(mockedGetAllCountries).toHaveBeenCalled();
  });
});
