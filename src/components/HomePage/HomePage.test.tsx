import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

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

afterEach(() => {
  vi.useRealTimers();
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
  {
    cca3: 'FRA',
    name: {
      common: 'France',
      official: 'French Republic',
    },
    flags: {
      svg: 'https://flagcdn.com/fr.svg',
      alt: 'France flag',
    },
    capital: ['Paris'],
    region: 'Europe',
    population: 67391582,
  },
  {
    cca3: 'JPN',
    name: {
      common: 'Japan',
      official: 'Japan',
    },
    flags: {
      svg: 'https://flagcdn.com/jp.svg',
      alt: 'Japan flag',
    },
    capital: ['Tokyo'],
    region: 'Asia',
    population: 125700000,
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

  it('фильтрует страны только после debounce-задержки', async () => {
    mockedGetAllCountries.mockResolvedValue(mockCountries);

    renderHomePage();

    expect(
      await screen.findByText('Federal Republic of Germany')
    ).toBeInTheDocument();

    expect(screen.getByText('French Republic')).toBeInTheDocument();

    vi.useFakeTimers();

    const searchInput = screen.getByPlaceholderText('Поиск..');

    fireEvent.change(searchInput, {
      target: { value: 'ger' },
    });

    expect(searchInput).toHaveValue('ger');

    // До debounce список ещё не изменился
    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();
    expect(screen.getByText('French Republic')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(399);
    });

    expect(screen.getByText('French Republic')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();
    expect(screen.queryByText('French Republic')).not.toBeInTheDocument();
  });

  it('фильтрует страны по выбранному региону', async () => {
    mockedGetAllCountries.mockResolvedValue(mockCountries);

    const user = userEvent.setup();

    renderHomePage();

    expect(
      await screen.findByText('Federal Republic of Germany')
    ).toBeInTheDocument();

    expect(screen.getByText('Japan')).toBeInTheDocument();

    const regionSelect = screen.getByRole('combobox');

    await user.selectOptions(regionSelect, 'Europe');

    expect(regionSelect).toHaveValue('Europe');

    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();
    expect(screen.getByText('French Republic')).toBeInTheDocument();

    expect(screen.queryByText('Japan')).not.toBeInTheDocument();
  });

  it('фильтрует страны по поиску и выбранному региону одновременно', async () => {
    mockedGetAllCountries.mockResolvedValue(mockCountries);

    renderHomePage();

    const inputEl = await screen.findByPlaceholderText('Поиск..');

    const regionSelect = screen.getByRole('combobox');

    vi.useFakeTimers();

    fireEvent.change(inputEl, {
      target: { value: 'ger' },
    });

    expect(inputEl).toHaveValue('ger');

    act(() => {
      vi.advanceTimersByTime(399);
    });

    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('French Republic')).toBeInTheDocument();
    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByText('Japan')).not.toBeInTheDocument();
    expect(screen.queryByText('French Republic')).not.toBeInTheDocument();
    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();

    fireEvent.change(regionSelect, {
      target: { value: 'Asia' },
    });

    expect(regionSelect).toHaveValue('Asia');

    expect(
      screen.queryByText('Federal Republic of Germany')
    ).not.toBeInTheDocument();

    expect(screen.getByText(/страна не найдена/i)).toBeInTheDocument();
  });

  it('сбрасывает debounce-задержку при новом вводе', async () => {
    mockedGetAllCountries.mockResolvedValue(mockCountries);

    renderHomePage();

    const inputEl = await screen.findByPlaceholderText('Поиск..');

    vi.useFakeTimers();

    fireEvent.change(inputEl, {
      target: { value: 'ger' },
    });

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(inputEl).toHaveValue('ger');

    fireEvent.change(inputEl, {
      target: { value: 'fre' },
    });

    expect(inputEl).toHaveValue('fre');

    act(() => {
      vi.advanceTimersByTime(399);
    });

    expect(screen.getByText('French Republic')).toBeInTheDocument();

    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();

    expect(screen.getByText('Japan')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByText('French Republic')).toBeInTheDocument();

    expect(
      screen.queryByText('Federal Republic of Germany')
    ).not.toBeInTheDocument();

    expect(screen.queryByText('Japan')).not.toBeInTheDocument();
  });

  it('выводит пустой результат при безуспешном поиске', async () => {
    mockedGetAllCountries.mockResolvedValue(mockCountries);

    renderHomePage();

    const inputEl = await screen.findByPlaceholderText('Поиск..');

    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();
    expect(screen.getByText('French Republic')).toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();

    vi.useFakeTimers();

    fireEvent.change(inputEl, {
      target: { value: 'xyz' },
    });

    expect(inputEl).toHaveValue('xyz');

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(
      screen.queryByText('Federal Republic of Germany')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('French Republic')).not.toBeInTheDocument();
    expect(screen.queryByText('Japan')).not.toBeInTheDocument();

    expect(screen.getByText('Страна не найдена!')).toBeInTheDocument();
  });

  it('не загружает страны повторно при  изменении поискового запроса', async () => {
    mockedGetAllCountries.mockResolvedValue(mockCountries);

    renderHomePage();

    const inputEl = await screen.findByPlaceholderText('Поиск..');

    expect(mockedGetAllCountries).toHaveBeenCalledTimes(1);

    fireEvent.change(inputEl, {
      target: { value: 'ja' },
    });

    expect(inputEl).toHaveValue('ja');
    expect(mockedGetAllCountries).toHaveBeenCalledTimes(1);

    fireEvent.change(inputEl, {
      target: { value: 'ger' },
    });

    expect(inputEl).toHaveValue('ger');
    expect(mockedGetAllCountries).toHaveBeenCalledTimes(1);
  });

  it('ищет страны по common  name', async () => {
    mockedGetAllCountries.mockResolvedValue(mockCountries);

    renderHomePage();

    const inputEl = await screen.findByPlaceholderText('Поиск..');

    vi.useFakeTimers();

    fireEvent.change(inputEl, {
      target: { value: 'france' },
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByText('French Republic')).toBeInTheDocument();
    expect(
      screen.queryByText('Federal Republic of Germany')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Japan')).not.toBeInTheDocument();
  });

  it('показывает все страны после сброса региона на All', async () => {
    mockedGetAllCountries.mockResolvedValue(mockCountries);

    renderHomePage();

    const regionSelect = await screen.findByRole('combobox');

    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();
    expect(screen.getByText('French Republic')).toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();

    fireEvent.change(regionSelect, {
      target: { value: 'Asia' },
    });

    expect(regionSelect).toHaveValue('Asia');

    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(
      screen.queryByText('Federal Republic of Germany')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('French Republic')).not.toBeInTheDocument();

    fireEvent.change(regionSelect, {
      target: { value: 'All' },
    });

    expect(regionSelect).toHaveValue('All');

    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();
    expect(screen.getByText('French Republic')).toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();
  });
});
