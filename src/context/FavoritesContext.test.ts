import { Country } from '@/types/country.types';

import { reducer } from './FavoritesContext';

// Мок-данные - минимальный объект который удовлетворяет типу Country
const mockCountry: Country = {
  cca3: 'DEU',
  name: { common: 'Germany', official: 'Federal Republic of Germany' },
  flags: { svg: '', alt: '' },
  capital: ['Berlin'],
  region: 'Europe',
  population: 83000000,
};

describe('FavoritesContext reducer', () => {
  it('ADD - добавляет страну в массив', () => {
    const state: Country[] = [];

    const nextState = reducer(state, { type: 'ADD', payload: mockCountry });

    expect(nextState).toContainEqual(mockCountry);
    // toContainEqual - глубокое сравнение объектов внутри массива
  });

  it('REMOVE - удаляет страну по cca3', () => {
    const state: Country[] = [mockCountry];

    const nextState = reducer(state, { type: 'REMOVE', payload: 'DEU' });

    expect(nextState.find((c) => c.cca3 === 'DEU')).toBeUndefined();
  });

  it('CLEAR_ALL - возвращает пустой массив', () => {
    const state: Country[] = [mockCountry];

    const nextState = reducer(state, { type: 'CLEAR_ALL' });

    expect(nextState).toHaveLength(0);
    // toHaveLength - проверяет .length массива
  });
});
