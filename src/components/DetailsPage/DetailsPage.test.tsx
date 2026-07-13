import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { FavoritesProvider } from '@/context/FavoritesContext';
import { getCountryByCode } from '@/services/countries';
import { DetailsPage } from './DetailsPage';

import type { CountryDetails } from '@/types/countryDetails.types';
import userEvent from '@testing-library/user-event';

vi.mock('@/services/countries', async () => {
  const actual = await vi.importActual<typeof import('@/services/countries')>(
    '@/services/countries'
  );

  return {
    ...actual,
    getCountryByCode: vi.fn(),
  };
});

const mockedGetCountryByCode = vi.mocked(getCountryByCode);

const mockFrance: CountryDetails = {
  cca3: 'FRA',
  name: {
    common: 'France',
    official: 'French Republic',
  },
  flags: {
    svg: 'https://flagcdn.com/fr.svg',
    alt: 'Flag of France',
  },
  capital: ['Paris'],
  region: 'Europe',
  population: 67_000_000,
  timezones: ['UTC+01:00'],
  borders: ['DEU', 'LUX'],
  languages: {
    fra: 'French',
  },
  currencies: {
    EUR: {
      name: 'Euro',
      symbol: '€',
    },
  },
};

const mockGermany: CountryDetails = {
  cca3: 'DEU',
  name: {
    common: 'Germany',
    official: 'Federal Republic of Germany',
  },
  flags: {
    svg: 'https://flagcdn.com/de.svg',
    alt: 'Flag of Germany',
  },
  capital: ['Berlin'],
  region: 'Europe',
  population: 83_240_525,
  timezones: ['UTC+01:00'],
  borders: ['FRA'],
  languages: {
    deu: 'German',
  },
  currencies: {
    EUR: {
      name: 'Euro',
      symbol: '€',
    },
  },
};

const renderDetailsPage = (initialPath = '/country/FRA') => {
  const testRouter = createMemoryRouter(
    [
      {
        path: '/country/:cca3',
        element: <DetailsPage />,
      },
    ],
    {
      initialEntries: [initialPath],
    }
  );

  return render(
    <FavoritesProvider>
      <RouterProvider router={testRouter} />
    </FavoritesProvider>
  );
};

beforeEach(() => {
  mockedGetCountryByCode.mockReset();
});

describe('DetailsPage', () => {
  it('загружает страну по cca3 из URL', async () => {
    mockedGetCountryByCode.mockResolvedValue(mockFrance);

    renderDetailsPage('/country/FRA');

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    const [countryCode] = mockedGetCountryByCode.mock.calls[0];

    expect(countryCode).toBe('FRA');

    expect(
      await screen.findByRole('heading', {
        name: 'French Republic',
      })
    ).toBeInTheDocument();

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('показывает ошибку при неудачной загрузке страны', async () => {
    mockedGetCountryByCode.mockRejectedValue(new Error('Country not found'));

    renderDetailsPage('/country/FRA');

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    const error = await screen.findByRole('alert');

    expect(error).toHaveTextContent('Country not found');

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('отображает доступную соседнюю страну как ссылку', async () => {
    mockedGetCountryByCode.mockResolvedValue(mockFrance);

    renderDetailsPage('/country/FRA');

    const borderLink = await screen.findByRole('link', {
      name: 'DEU',
    });

    expect(borderLink).toHaveAttribute('href', '/country/DEU');
  });

  it('загружает соседнюю страну после перехода по ссылке', async () => {
    const user = userEvent.setup();

    mockedGetCountryByCode
      .mockResolvedValueOnce(mockFrance)
      .mockResolvedValueOnce(mockGermany);

    renderDetailsPage('/country/FRA');

    const borderLink = await screen.findByRole('link', {
      name: 'DEU',
    });

    await user.click(borderLink);

    expect(
      await screen.findByRole('heading', {
        name: 'Federal Republic of Germany',
      })
    ).toBeInTheDocument();

    const [secondCountryCode] = mockedGetCountryByCode.mock.calls[1];

    expect(secondCountryCode).toBe('DEU');

    expect(
      screen.queryByRole('heading', {
        name: 'French Republic',
      })
    ).not.toBeInTheDocument();
  });

  it('отображает недоступную соседнюю страну как текст, а не ссылку', async () => {
    mockedGetCountryByCode.mockResolvedValue(mockFrance);

    renderDetailsPage('/country/FRA');

    const unavailableCountryCode = await screen.findByText('LUX');

    expect(
      screen.queryByRole('link', {
        name: 'LUX',
      })
    ).not.toBeInTheDocument();

    expect(unavailableCountryCode).not.toHaveAttribute('href');
  });
});
