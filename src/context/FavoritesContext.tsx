import { Country } from '@/types/country.types';

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

type Action =
  | { type: 'ADD'; payload: Country }
  | { type: 'REMOVE'; payload: string }
  | { type: 'CLEAR_ALL' };

type FavoritesContextType = {
  favorites: Country[];
  dispatch: Dispatch<Action>;
};

const LS_KEY = 'favorites';

const init = (initial: Country[]): Country[] => {
  const stored = localStorage.getItem(LS_KEY);
  return stored ? JSON.parse(stored) : initial;
};

export function reducer(state: Country[], action: Action): Country[] {
  switch (action.type) {
    case 'ADD': {
      const isAlreadyFavorite = state.some(
        (country) => country.cca3 === action.payload.cca3
      );

      if (isAlreadyFavorite) return state;

      return [...state, action.payload];
    }
    case 'REMOVE':
      return state.filter((country) => country.cca3 !== action.payload);
    case 'CLEAR_ALL':
      return [];
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const FavoritesContext = createContext<FavoritesContextType | null>(
  null
);

// eslint-disable-next-line react-refresh/only-export-components
export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error(`Warning! Context has been used outside of its Provider`);

  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, dispatch] = useReducer(reducer, [], init);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const value = useMemo(() => ({ favorites, dispatch }), [favorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
