import { request } from './api';

import { Country } from '@/types/country.types';
import { CountryDetails } from '@/types/countryDetails.types';

const URL_FOR_ALL_COUNTRIES =
  'https://restcountries.com/v3.1/all?fields=cca3,name,flags,capital,region,population';

export const getAllCountries = (signal?: AbortSignal) =>
  request<Country[]>(URL_FOR_ALL_COUNTRIES, signal);

export const getCountryByCode = (code: string, signal?: AbortSignal) =>
  request<CountryDetails>(
    `https://restcountries.com/v3.1/alpha/${code}?fields=cca3,name,flags,capital,region,timezones,borders,languages,currencies`,
    signal
  );

//  =============== ERRORS ==================== //
/**
 * // 10.06.2026
 * 
 * 1) 
 * async <Country[]>(...) // ← не нужен
 * 
 * решил что getCountriesAll асинхронная функция, потому что внутри происходит феч. Async нужен когда используем await внутри. Если просто возвращаю результат request - он уже Promise, async лишний
 * 
 * 2) 
 * ({ signal?: AbortSignal })  // ← объект, лишнее, плюс так нельзя описывать объект, либо { signal } : { signal: AbortSignal} либо отдельно прописывать пропс, JS читает { signal: AbortSignal } как:
 * возьми signal, переименуй в 'AbortSignal', а не как типизацию

    (signal?: AbortSignal)      // ← просто параметр
 * 
 * решил передавать в функцию объект { signal } вместо просто (signal), для одного параметра объект не нужен - это лишнее
 * 
 * 3) 
 * const getCountriesAll = async <Country[]>  // ← неверно, дженерик не нужен функции
 * 
request<Country[]>(url, signal)            // ← вот где дженерик нужен
 * 
 * 
 * Дженерик не на той функции. getCountriesAll всегда возвращает Country[] - зачем ей дженерик ? Дженерик нужен request потому что он универсальный. getCountriesAll конкретная.
 * 
 * 4) забыл что если у меня в стрелочной функции формат где => { } в фигурных скобках нужно явно указывать что я возвращаю, иначе TS видит void. отличается от => expression, так как тут TS понимает что, то что явно стоит после стрелок то и надо вернуть
 */
