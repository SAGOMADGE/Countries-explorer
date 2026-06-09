export interface Country {
  cca3: string;
  name: {
    common: string;
    official: string;
  };
  flags: {
    svg: string;
    alt: string;
  };
  capital: string[];
  region: string;
  population: number;
}

export interface CountriesState {
  data: Country[] | null;
  loading: boolean;
  error: string | null;
}
