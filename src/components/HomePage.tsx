import { useEffect, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { useFetch } from '@/hooks/useFetch';
import { getAllCountries, getCountryByCode } from '@/services/countries';

// types
import { Country } from '@/types/country.types';

export const HomePage = () => <h1>HomePage</h1>;
