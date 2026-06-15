export interface Country {
  cca3: string; // code (RUS)
  name: {
    // name of the country
    common: string;
    official: string;
  };
  flags: {
    // flag - svg format
    svg: string;
    alt: string;
  };
  capital: string[]; // array, inside string of a capital
  region: string; // EUROPE for example
  population: number; // how many people lives there
}

export interface CountriesState {
  // its for hook lifecycle
  data: Country[] | null;
  loading: boolean;
  error: string | null;
}
