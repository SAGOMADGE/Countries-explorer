import { Country } from '@/types/country.types';

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
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

function reducer(state: Country[], action: Action): Country[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter((Country) => Country.cca3 !== action.payload);
    case 'CLEAR_ALL':
      return [];
  }
}

export const FavoritesContext = createContext<FavoritesContextType | null>(
  null
);

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error(`Warning! Context has been used outside of its Provider`);

  return context;
};

const initialState: Country[] = [];

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ favorites, dispatch }), [favorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// ============= ERRORS ============= //
/** ---- 10.06.2026 ---------
 *
 * 1) Контекст хранит только state - dispatch потерян (Компоненты должны и читать список и изменять его). Без dispatch в контексте они не смогут добавлять и удалять.
 */
